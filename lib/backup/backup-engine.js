/**
 * Jaipur Stonecraft — Master Backup Engine Coordinator
 * 
 * Coordinates complete DB export + Image archiving + Cloud Sync + Retention Rotation.
 */

import fs from "fs";
import path from "path";
import { exportDatabaseToFile } from "./db-exporter.js";
import { exportImageArchiveToFile } from "./image-archiver.js";
import { uploadFileToGoogleDrive, pruneRemoteGoogleDriveBackups } from "./google-drive-provider.js";

function formatDateForFilename(d = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  const secs = pad(d.getSeconds());
  return `${year}-${month}-${day}_${hours}${mins}${secs}`;
}

export async function runFullBackup(options = {}) {
  const startTime = Date.now();
  const timestampStr = formatDateForFilename();
  const backupBaseDir = path.join(process.cwd(), "backups");
  const dbBackupDir = path.join(backupBaseDir, "db");
  const imgBackupDir = path.join(backupBaseDir, "images");

  if (!fs.existsSync(dbBackupDir)) fs.mkdirSync(dbBackupDir, { recursive: true });
  if (!fs.existsSync(imgBackupDir)) fs.mkdirSync(imgBackupDir, { recursive: true });

  const dbDumpPath = path.join(dbBackupDir, `db_backup_${timestampStr}.sql`);
  const imgArchivePath = path.join(imgBackupDir, `images_backup_${timestampStr}.json`);

  // 1. Export Database
  const dbResult = await exportDatabaseToFile(dbDumpPath);

  // 2. Export Image Archive
  const imgResult = await exportImageArchiveToFile(imgArchivePath);

  // 3. Upload to Google Drive (if configured)
  const driveDbSync = await uploadFileToGoogleDrive(dbDumpPath);
  const driveImgSync = await uploadFileToGoogleDrive(imgArchivePath);

  // 4. Local Disk Retention Pruning
  const retentionCount = parseInt(process.env.BACKUP_RETENTION_COUNT || "14", 10);
  const localDbPruned = pruneLocalFiles(dbBackupDir, retentionCount, ".sql");
  const localImgPruned = pruneLocalFiles(imgBackupDir, retentionCount, ".json");

  // 5. Remote Google Drive Retention Pruning
  const remotePrune = await pruneRemoteGoogleDriveBackups(retentionCount * 2);

  const durationMs = Date.now() - startTime;

  return {
    timestamp: new Date().toISOString(),
    durationMs,
    database: {
      filePath: dbResult.filePath,
      fileSizeKb: (dbResult.fileSize / 1024).toFixed(2),
      summary: dbResult.summary,
      googleDriveSync: driveDbSync
    },
    images: {
      filePath: imgResult.filePath,
      fileSizeKb: (imgResult.fileSize / 1024).toFixed(2),
      totalImages: imgResult.totalImages,
      totalSizeBytes: imgResult.totalSizeBytes,
      googleDriveSync: driveImgSync
    },
    retention: {
      retentionLimit: retentionCount,
      localDbFilesPruned: localDbPruned,
      localImgFilesPruned: localImgPruned,
      remoteDriveFilesPruned: remotePrune.prunedCount || 0
    }
  };
}

function pruneLocalFiles(dirPath, keepCount, extension) {
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
  const dbDir = path.join(backupBaseDir, "db");
  const imgDir = path.join(backupBaseDir, "images");

  const dbFiles = fs.existsSync(dbDir)
    ? fs.readdirSync(dbDir).filter(f => f.endsWith(".sql")).map(f => {
        const full = path.join(dbDir, f);
        const stat = fs.statSync(full);
        return { name: f, sizeKb: (stat.size / 1024).toFixed(2), mtime: stat.mtime };
      })
    : [];

  const imgFiles = fs.existsSync(imgDir)
    ? fs.readdirSync(imgDir).filter(f => f.endsWith(".json")).map(f => {
        const full = path.join(imgDir, f);
        const stat = fs.statSync(full);
        return { name: f, sizeKb: (stat.size / 1024).toFixed(2), mtime: stat.mtime };
      })
    : [];

  dbFiles.sort((a, b) => b.mtime - a.mtime);
  imgFiles.sort((a, b) => b.mtime - a.mtime);

  return {
    databaseBackups: dbFiles,
    imageBackups: imgFiles
  };
}
