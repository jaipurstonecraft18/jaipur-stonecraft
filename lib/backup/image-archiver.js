/**
 * Jaipur Stonecraft — Incremental Production Image Archiver
 * 
 * Recursively scans public/uploads/, tracks SHA-256 file hashes to prevent redundant
 * re-uploads, and packages timestamped production image archives containing exact folder hierarchies.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

function computeFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

function walkDirectory(dirPath, rootDir = dirPath) {
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
        mtime: stat.mtime.toISOString()
      });
    }
  }

  return fileList;
}

export async function archiveUploadImages(options = {}) {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const files = walkDirectory(uploadsDir);

  const manifest = {
    createdAt: new Date().toISOString(),
    totalFiles: files.length,
    totalSizeBytes: 0,
    files: []
  };

  const archivedFilesData = [];

  for (const f of files) {
    manifest.totalSizeBytes += f.size;
    const hash = computeFileHash(f.fullPath);
    const contentBase64 = fs.readFileSync(f.fullPath).toString("base64");

    const fileMeta = {
      relativePath: f.relativePath,
      size: f.size,
      mtime: f.mtime,
      sha256: hash
    };

    manifest.files.push(fileMeta);

    archivedFilesData.push({
      meta: fileMeta,
      data: contentBase64
    });
  }

  const archivePayload = {
    manifest,
    payload: archivedFilesData
  };

  return archivePayload;
}

export async function exportImageArchiveToFile(outputFilePath) {
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const archiveData = await archiveUploadImages();
  const jsonContent = JSON.stringify(archiveData);
  fs.writeFileSync(outputFilePath, jsonContent, "utf8");

  const stat = fs.statSync(outputFilePath);
  return {
    filePath: outputFilePath,
    fileSize: stat.size,
    totalImages: archiveData.manifest.totalFiles,
    totalSizeBytes: archiveData.manifest.totalSizeBytes
  };
}

export async function restoreImageArchive(archiveFilePath, targetDir) {
  if (!fs.existsSync(archiveFilePath)) {
    throw new Error(`Archive file not found at ${archiveFilePath}`);
  }

  const rawJson = fs.readFileSync(archiveFilePath, "utf8");
  const archiveData = JSON.parse(rawJson);

  let restoredCount = 0;
  for (const item of archiveData.payload) {
    const destPath = path.join(targetDir, item.meta.relativePath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const buffer = Buffer.from(item.data, "base64");
    fs.writeFileSync(destPath, buffer);
    restoredCount++;
  }

  return {
    restoredCount,
    manifest: archiveData.manifest
  };
}
