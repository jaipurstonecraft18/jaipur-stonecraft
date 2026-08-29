import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { isAuthorizedSyncRequest } from "@/lib/admin/auth.js";

function walkDirectory(dir, baseDir = dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDirectory(filePath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
      results.push({ fullPath: filePath, relativePath, size: stat.size, mtime: stat.mtime });
    }
  }
  return results;
}

function computeFileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

export async function GET(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const rawFiles = walkDirectory(uploadsDir);

    let totalBytes = 0;
    const files = rawFiles.map((f) => {
      totalBytes += f.size;
      const sha256 = computeFileHash(f.fullPath);
      return {
        relativePath: f.relativePath,
        size: f.size,
        sha256,
        mtime: f.mtime.toISOString()
      };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalFiles: files.length,
      totalBytes,
      files
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Failed to generate media manifest" }, { status: 500 });
  }
}
