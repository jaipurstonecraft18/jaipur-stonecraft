/**
 * Jaipur Stonecraft — Content-Addressable Image Backup & Change-Detection Engine
 * 
 * Features:
 *   1. Content-Addressable Storage: Saves unique image files keyed by SHA-256 hash.
 *   2. Deduplication: Unchanged files are NEVER re-copied or re-uploaded.
 *   3. Delta Tracking: Detects NEW, MODIFIED, UNCHANGED, and DELETED images.
 *   4. Manifests: Timestamped JSON manifests recording exact directory tree & metadata.
 *   5. Full Restoration: Reconstructs exact public/uploads/ tree from any manifest.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

export function computeFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

export function walkDirectory(dirPath, rootDir = dirPath) {
  let fileList = [];
  if (!fs.existsSync(dirPath)) return fileList;

  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fileList = fileList.concat(walkDirectory(fullPath, rootDir));
    } else if (stat.isFile()) {
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
      fileList.push({
        fullPath,
        relativePath,
        size: stat.size,
        mtime: stat.mtime.toISOString(),
        ext: path.extname(fullPath)
      });
    }
  }

  return fileList;
}

/**
 * Get latest image manifest from disk
 */
export function getLatestImageManifest(manifestDir) {
  if (!fs.existsSync(manifestDir)) return null;

  const files = fs.readdirSync(manifestDir)
    .filter(f => f.startsWith("images_manifest_") && f.endsWith(".json"))
    .sort();

  if (files.length === 0) return null;
  const latestPath = path.join(manifestDir, files[files.length - 1]);
  try {
    return JSON.parse(fs.readFileSync(latestPath, "utf8"));
  } catch (e) {
    return null;
  }
}

/**
 * Execute Content-Addressable Image Backup with Change Detection
 */
export async function backupUploadImages(options = {}) {
  const uploadsDir = options.sourceDir || path.join(process.cwd(), "public", "uploads");
  const backupBaseDir = options.backupDir || path.join(process.cwd(), "backups", "images");
  const objectsDir = path.join(backupBaseDir, "objects");
  const manifestDir = path.join(backupBaseDir, "manifests");

  if (!fs.existsSync(objectsDir)) fs.mkdirSync(objectsDir, { recursive: true });
  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

  const currentFiles = walkDirectory(uploadsDir);
  const previousManifest = getLatestImageManifest(manifestDir);
  const prevFileMap = new Map();

  if (previousManifest && Array.isArray(previousManifest.files)) {
    for (const pf of previousManifest.files) {
      prevFileMap.set(pf.relativePath, pf);
    }
  }

  const timestamp = new Date().toISOString();
  const manifest = {
    timestamp,
    sourceDirectory: "public/uploads",
    totalFiles: currentFiles.length,
    totalSizeBytes: 0,
    stats: {
      newFiles: 0,
      modifiedFiles: 0,
      unchangedFiles: 0,
      deletedFiles: 0
    },
    files: []
  };

  const newObjectsStored = [];

  for (const f of currentFiles) {
    manifest.totalSizeBytes += f.size;
    const sha256 = computeFileHash(f.fullPath);
    const prevEntry = prevFileMap.get(f.relativePath);

    let changeStatus = "NEW";
    if (prevEntry) {
      if (prevEntry.sha256 === sha256) {
        changeStatus = "UNCHANGED";
        manifest.stats.unchangedFiles++;
      } else {
        changeStatus = "MODIFIED";
        manifest.stats.modifiedFiles++;
      }
      prevFileMap.delete(f.relativePath); // Processed
    } else {
      manifest.stats.newFiles++;
    }

    // Save content-addressed object if not already present
    const objectFilename = `${sha256}${f.ext || ""}`;
    const objectPath = path.join(objectsDir, objectFilename);

    if (!fs.existsSync(objectPath)) {
      fs.copyFileSync(f.fullPath, objectPath);
      newObjectsStored.push({
        objectFilename,
        objectPath,
        size: f.size
      });
    }

    manifest.files.push({
      relativePath: f.relativePath,
      size: f.size,
      mtime: f.mtime,
      sha256,
      objectFilename,
      changeStatus
    });
  }

  // Any remaining entries in prevFileMap are DELETED from source
  manifest.deletedFromSource = [];
  for (const [delPath, delEntry] of prevFileMap.entries()) {
    manifest.stats.deletedFiles++;
    manifest.deletedFromSource.push({
      relativePath: delPath,
      lastKnownSha256: delEntry.sha256,
      objectFilename: delEntry.objectFilename
    });
  }

  // Save timestamped manifest
  const tsFormatted = timestamp.replace(/[:.]/g, "-").slice(0, 19);
  const manifestFilename = `images_manifest_${tsFormatted}.json`;
  const manifestFilePath = path.join(manifestDir, manifestFilename);

  fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), "utf8");

  return {
    manifestFilePath,
    manifestFilename,
    manifest,
    newObjectsStoredCount: newObjectsStored.length,
    newObjectsStored
  };
}

/**
 * Restore images from a manifest file to target directory
 */
export async function restoreImagesFromManifest(manifestFilePath, targetDir, options = {}) {
  if (!fs.existsSync(manifestFilePath)) {
    throw new Error(`Manifest file not found: ${manifestFilePath}`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestFilePath, "utf8"));
  const backupBaseDir = path.dirname(path.dirname(manifestFilePath));
  const objectsDir = path.join(backupBaseDir, "objects");

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const restoreReport = {
    timestamp: new Date().toISOString(),
    manifestUsed: path.basename(manifestFilePath),
    totalRestored: 0,
    verifiedHashes: 0,
    errors: []
  };

  for (const f of manifest.files) {
    const objectPath = path.join(objectsDir, f.objectFilename);
    const destPath = path.join(targetDir, f.relativePath);
    const destFolder = path.dirname(destPath);

    if (!fs.existsSync(objectPath)) {
      restoreReport.errors.push(`Missing object file: ${f.objectFilename} for ${f.relativePath}`);
      continue;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    fs.copyFileSync(objectPath, destPath);
    restoreReport.totalRestored++;

    // Verify hash integrity
    const restoredHash = computeFileHash(destPath);
    if (restoredHash === f.sha256) {
      restoreReport.verifiedHashes++;
    } else {
      restoreReport.errors.push(`Hash mismatch on restored file: ${f.relativePath}`);
    }
  }

  return restoreReport;
}
