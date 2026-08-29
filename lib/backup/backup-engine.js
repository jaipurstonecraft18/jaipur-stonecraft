/**
 * Jaipur Stonecraft — Master Backup Coordinator Engine (Phase 5C)
 * 
 * Orchestrates:
 *   1. Change-Aware Database Backup (Aiven MySQL / Local Mirror) -> compressed .sql.gz + JSON manifest.
 *   2. Content-Addressable Image Backup -> SHA-256 objects + JSON manifest.
 *   3. Off-Site Google Drive Disaster Recovery Sync.
 *   4. Retention Pruning (Local + Cloud).
 */

import fs from "fs";
import path from "path";
import { exportDatabaseWithManifest } from "./db-exporter.js";
import { backupUploadImages } from "./image-archiver.js";
import { uploadFileToGoogleDrive, pruneRemoteGoogleDriveBackups } from "./google-drive-provider.js";

export async function runFullBackup(options = {}) {
  const startTime = Date.now();
  const backupBaseDir = options.backupBaseDir || path.join(process.cwd(), "backups");
  const dbDir = path.join(backupBaseDir, "db");
  const imgDir = path.join(backupBaseDir, "images");

  // 1. Export Database with change detection
  const dbResult = await exportDatabaseWithManifest({
    backupDir: dbDir,
    forceFull: options.forceFull === true,
    aivenUrl: options.aivenUrl || process.env.AIVEN_DATABASE_URL
  });

  // 2. Export Images with content-addressable storage & change detection
  const imgResult = await backupUploadImages({
    backupDir: imgDir,
    sourceDir: options.sourceDir || path.join(process.cwd(), "public", "uploads")
  });

  // 3. Off-Site Google Drive Sync (Optional - disabled by default)
  const isGoogleDriveEnabled = options.enableGoogleDrive === true || process.env.ENABLE_GOOGLE_DRIVE_BACKUP === "true";
  const driveUploads = {
    dbDump: null,
    dbManifest: null,
    imageManifest: null,
    newImageObjects: []
  };

  if (isGoogleDriveEnabled) {
    if (dbResult.dumpFileCreated && dbResult.dumpFilePath) {
      driveUploads.dbDump = await uploadFileToGoogleDrive(dbResult.dumpFilePath, {
        subfolder: "Database/Full"
      });
    }
    if (dbResult.manifestFilePath) {
      driveUploads.dbManifest = await uploadFileToGoogleDrive(dbResult.manifestFilePath, {
        subfolder: "Database/Manifests"
      });
    }
    if (imgResult.manifestFilePath) {
      driveUploads.imageManifest = await uploadFileToGoogleDrive(imgResult.manifestFilePath, {
        subfolder: "Images/Manifests"
      });
    }
    if (imgResult.newObjectsStored && imgResult.newObjectsStored.length > 0) {
      for (const obj of imgResult.newObjectsStored) {
        const res = await uploadFileToGoogleDrive(obj.objectPath, {
          subfolder: "Images/Objects"
        });
        driveUploads.newImageObjects.push({
          name: obj.objectFilename,
          synced: res.synced
        });
      }
    }
  }

  // 4. Local Retention Pruning
  const retentionCount = parseInt(process.env.BACKUP_RETENTION_COUNT || "14", 10);
  const prunedLocalDbDumps = pruneDirectoryFiles(path.join(dbDir, "full"), retentionCount, ".sql.gz");
  const prunedLocalDbManifests = pruneDirectoryFiles(path.join(dbDir, "manifests"), retentionCount * 2, ".json");
  const prunedLocalImgManifests = pruneDirectoryFiles(path.join(imgDir, "manifests"), retentionCount * 2, ".json");

  // 5. Remote Google Drive Retention Pruning (if enabled)
  const remotePrune = isGoogleDriveEnabled ? await pruneRemoteGoogleDriveBackups(retentionCount * 2) : { prunedCount: 0 };

  const durationMs = Date.now() - startTime;

  return {
    timestamp: new Date().toISOString(),
    durationMs,
    database: {
      source: dbResult.manifest.source,
      status: dbResult.manifest.status,
      totalRows: dbResult.manifest.totalRows,
      dumpFileCreated: dbResult.dumpFileCreated,
      dumpFilePath: dbResult.dumpFilePath,
      compressedSizeKb: (dbResult.compressedSize / 1024).toFixed(2),
      manifestFilePath: dbResult.manifestFilePath,
      changedTables: dbResult.manifest.changedTables,
      googleDriveSync: driveUploads.dbDump
    },
    images: {
      source: "public/uploads",
      totalImages: imgResult.manifest.totalFiles,
      totalSizeBytes: imgResult.manifest.totalSizeBytes,
      stats: imgResult.manifest.stats,
      newObjectsStored: imgResult.newObjectsStoredCount,
      manifestFilePath: imgResult.manifestFilePath,
      googleDriveSync: driveUploads.imageManifest
    },
    googleDrive: {
      dbDumpSynced: driveUploads.dbDump?.synced || false,
      dbManifestSynced: driveUploads.dbManifest?.synced || false,
      imageManifestSynced: driveUploads.imageManifest?.synced || false,
      newImageObjectsCount: driveUploads.newImageObjects.length,
      remotePruned: remotePrune.prunedCount || 0
    },
    retention: {
      retentionLimit: retentionCount,
      localDbDumpsPruned: prunedLocalDbDumps,
      localDbManifestsPruned: prunedLocalDbManifests,
      localImgManifestsPruned: prunedLocalImgManifests
    }
  };
}

function pruneDirectoryFiles(dirPath, keepCount, extension) {
  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith(extension))
    .map(f => {
      const full = path.join(dirPath, f);
      return {
        name: f,
        fullPath: full,
        mtime: fs.statSync(full).mtime.getTime()
      };
    });

  files.sort((a, b) => b.mtime - a.mtime);

  if (files.length <= keepCount) return 0;

  const toRemove = files.slice(keepCount);
  let count = 0;
  for (const f of toRemove) {
    try {
      fs.unlinkSync(f.fullPath);
      count++;
    } catch (e) {}
  }
  return count;
}

export function listLocalBackups() {
  const backupBaseDir = path.join(process.cwd(), "backups");
  const dbFullDir = path.join(backupBaseDir, "db", "full");
  const dbManifestDir = path.join(backupBaseDir, "db", "manifests");
  const imgManifestDir = path.join(backupBaseDir, "images", "manifests");
  const imgObjectsDir = path.join(backupBaseDir, "images", "objects");

  const dbDumps = fs.existsSync(dbFullDir)
    ? fs.readdirSync(dbFullDir).filter(f => f.endsWith(".sql.gz") || f.endsWith(".sql")).map(f => {
        const full = path.join(dbFullDir, f);
        const stat = fs.statSync(full);
        return { name: f, sizeKb: (stat.size / 1024).toFixed(2), mtime: stat.mtime };
      })
    : [];

  const dbManifests = fs.existsSync(dbManifestDir)
    ? fs.readdirSync(dbManifestDir).filter(f => f.endsWith(".json")).map(f => {
        const full = path.join(dbManifestDir, f);
        const stat = fs.statSync(full);
        return { name: f, sizeKb: (stat.size / 1024).toFixed(2), mtime: stat.mtime };
      })
    : [];

  const imageManifests = fs.existsSync(imgManifestDir)
    ? fs.readdirSync(imgManifestDir).filter(f => f.endsWith(".json")).map(f => {
        const full = path.join(imgManifestDir, f);
        const stat = fs.statSync(full);
        return { name: f, sizeKb: (stat.size / 1024).toFixed(2), mtime: stat.mtime };
      })
    : [];

  const totalImageObjects = fs.existsSync(imgObjectsDir)
    ? fs.readdirSync(imgObjectsDir).length
    : 0;

  dbDumps.sort((a, b) => b.mtime - a.mtime);
  dbManifests.sort((a, b) => b.mtime - a.mtime);
  imageManifests.sort((a, b) => b.mtime - a.mtime);

  return {
    databaseDumps: dbDumps,
    databaseManifests: dbManifests,
    imageManifests,
    totalImageObjects
  };
}

