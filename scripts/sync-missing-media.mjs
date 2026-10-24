/**
 * Jaipur Stonecraft — Synchronize All Missing Local Uploads to Production
 *
 * Scans public/uploads, checks against live Hostinger production manifest,
 * and uploads every missing image variant (raw, display, card, thumb).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getSyncConfig, getAuthHeaders, fetchFromProd, walkLocalUploads, saveBaseline, getBaseline } from "../lib/sync/sync-engine.js";

async function main() {
  const config = getSyncConfig();
  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — MEDIA SYNCHRONIZATION AUDIT & UPLOAD");
  console.log("================================================================================");
  console.log(`Target: ${config.prodBaseUrl}`);
  console.log(`Uploads Directory: ${config.uploadsDir}`);
  console.log("================================================================================\n");

  console.log("1. Fetching production media manifest...");
  const remoteManifest = await fetchFromProd("/api/admin/sync/media/manifest", config);
  const remoteFiles = remoteManifest.files || [];
  console.log(`Production reports: ${remoteFiles.length} media files.`);

  const remoteFileMap = new Map();
  for (const rf of remoteFiles) {
    const norm = (rf.path || rf.relativePath || "").replace(/\\/g, "/");
    remoteFileMap.set(norm, rf);
  }

  console.log("2. Scanning local public/uploads directory...");
  const localFiles = walkLocalUploads(config.uploadsDir);
  console.log(`Local disk reports: ${localFiles.length} media files.`);

  const missingOrMismatched = [];
  for (const lf of localFiles) {
    const norm = lf.relativePath.replace(/\\/g, "/");
    const rf = remoteFileMap.get(norm);
    const sha256 = crypto.createHash("sha256").update(fs.readFileSync(lf.fullPath)).digest("hex");
    
    if (!rf) {
      missingOrMismatched.push({ ...lf, relativePath: norm, sha256, reason: "Missing on production" });
    } else if (rf.sha256 && rf.sha256 !== sha256) {
      missingOrMismatched.push({ ...lf, relativePath: norm, sha256, reason: "Checksum mismatch" });
    }
  }

  console.log(`\nFound ${missingOrMismatched.length} local files needing upload to production.`);
  if (missingOrMismatched.length === 0) {
    console.log("✅ All local media files exist on production! Nothing to upload.");
    return;
  }

  console.log("\n3. Uploading missing files to production...");
  let uploadedCount = 0;
  let failedCount = 0;
  const authHeaders = await getAuthHeaders(config);
  const uploadUrl = `${config.prodBaseUrl}/api/admin/sync/media/upload`;

  for (let i = 0; i < missingOrMismatched.length; i++) {
    const mf = missingOrMismatched[i];
    try {
      const fileBuf = fs.readFileSync(mf.fullPath);
      const formBoundary = "----WebKitFormBoundary" + crypto.randomBytes(16).toString("hex");
      const bodyChunks = [
        Buffer.from(`--${formBoundary}\r\nContent-Disposition: form-data; name="file"; filename="${path.basename(mf.relativePath)}"\r\nContent-Type: application/octet-stream\r\n\r\n`),
        fileBuf,
        Buffer.from(`\r\n--${formBoundary}\r\nContent-Disposition: form-data; name="relativePath"\r\n\r\n${mf.relativePath}\r\n--${formBoundary}\r\nContent-Disposition: form-data; name="sha256"\r\n\r\n${mf.sha256}\r\n--${formBoundary}--\r\n`)
      ];
      const combinedBody = Buffer.concat(bodyChunks);

      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          ...authHeaders,
          "Content-Type": `multipart/form-data; boundary=${formBoundary}`
        },
        body: combinedBody
      });

      if (!res.ok) {
        const text = await res.text();
        console.error(`❌ [${i + 1}/${missingOrMismatched.length}] FAILED: ${mf.relativePath} (HTTP ${res.status}): ${text.slice(0, 150)}`);
        failedCount++;
      } else {
        uploadedCount++;
        if ((i + 1) % 5 === 0 || i + 1 === missingOrMismatched.length) {
          console.log(`✅ [${i + 1}/${missingOrMismatched.length}] Uploaded: ${mf.relativePath}`);
        }
      }
    } catch (err) {
      console.error(`❌ [${i + 1}/${missingOrMismatched.length}] Error: ${mf.relativePath}:`, err.message);
      failedCount++;
    }
  }

  console.log(`\n================================================================================`);
  console.log(`Upload Complete: ${uploadedCount} uploaded successfully, ${failedCount} failures.`);
  console.log(`================================================================================\n`);

  // Refresh baseline
  console.log("4. Refreshing sync baseline...");
  const [newDbManifest, newMediaManifest] = await Promise.all([
    fetchFromProd("/api/admin/sync/db/manifest", config),
    fetchFromProd("/api/admin/sync/media/manifest", config)
  ]);

  const currentBaseline = getBaseline() || {};
  const filesMap = {};
  for (const mf of newMediaManifest.files || []) {
    const norm = (mf.path || mf.relativePath || "").replace(/\\/g, "/");
    filesMap[norm] = {
      size: mf.size,
      sha256: mf.sha256,
      mtime: mf.mtime
    };
  }

  saveBaseline({
    ...currentBaseline,
    lastSyncTimestamp: new Date().toISOString(),
    databaseChecksum: newDbManifest.databaseChecksum,
    tables: newDbManifest.tables,
    mediaChecksum: crypto.createHash("sha256").update(JSON.stringify(filesMap)).digest("hex"),
    files: filesMap
  });

  console.log(`Baseline updated with ${Object.keys(filesMap).length} total verified files.`);
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
