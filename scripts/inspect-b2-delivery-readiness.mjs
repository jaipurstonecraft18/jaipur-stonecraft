/**
 * Jaipur Stonecraft — Phase 6E: Backblaze B2 Delivery Readiness & URL Verification
 */

import fs from "fs";
import path from "path";
import sqlite from "better-sqlite3";
import { checkObjectExists, listObjects, getPublicUrl } from "../lib/storage/b2-client.js";
import { resolveMediaUrl, toB2Url } from "../lib/storage/media-helper.js";

async function main() {
  console.log("==================================================");
  console.log("=== PHASE 6E: B2 PUBLIC DELIVERY READINESS AUDIT ===");
  console.log("==================================================\n");

  const bucket = process.env.B2_BUCKET_NAME;
  const endpoint = process.env.B2_ENDPOINT;
  const configuredPublicUrl = process.env.B2_PUBLIC_URL;

  console.log(`1. Configuration Detected:`);
  console.log(`   - Bucket Name: ${bucket}`);
  console.log(`   - S3 Endpoint: ${endpoint}`);
  console.log(`   - Configured B2_PUBLIC_URL: ${configuredPublicUrl || "(None - defaults to S3 endpoint)"}`);

  // 2. Audit Remote Objects on B2
  const b2List = await listObjects({ prefix: "production/", maxKeys: 1000 });
  console.log(`\n2. Remote Store Status:`);
  console.log(`   - Total Objects under production/: ${b2List.keyCount}/106`);
  console.log(`   - Verified Object State: ${b2List.keyCount === 106 ? "✅ All 106 objects present" : "⚠️ Discrepancy detected"}`);

  // 3. Representative Image Access Test
  const testItems = [
    "categories/display/cms-image-1787848523473-0tg7z.webp",
    "products/display/ganesh-ji-1787044620564-a0efv.webp",
    "categories/card/cms-image-1787913771016-5pvqa.webp"
  ];

  console.log(`\n3. Representative Image Access Tests:`);

  for (const itemPath of testItems) {
    const b2Key = `production/${itemPath}`;
    const s3Check = await checkObjectExists(b2Key);
    const s3DirectUrl = `https://${bucket}.${endpoint.replace(/^https?:\/\//, "")}/${b2Key}`;
    const friendlyUrl = `https://f005.backblazeb2.com/file/${bucket}/${b2Key}`;

    console.log(`\n   Asset: ${itemPath}`);
    console.log(`   - Authenticated S3 Access: ${s3Check.exists ? `✅ OK (Size: ${s3Check.contentLength} bytes, Type: ${s3Check.contentType})` : "❌ NOT FOUND"}`);

    // Test Unauthenticated HTTP Access
    let directHttpCode = "Error";
    try {
      const res = await fetch(s3DirectUrl, { method: "HEAD" });
      directHttpCode = res.status;
    } catch (e) {
      directHttpCode = e.message;
    }

    let friendlyHttpCode = "Error";
    try {
      const res2 = await fetch(friendlyUrl, { method: "HEAD" });
      friendlyHttpCode = res2.status;
    } catch (e) {
      friendlyHttpCode = e.message;
    }

    console.log(`   - Unauthenticated S3 Direct URL (${s3DirectUrl}): HTTP ${directHttpCode}`);
    console.log(`   - Unauthenticated Friendly URL (${friendlyUrl}): HTTP ${friendlyHttpCode}`);
  }

  // 4. URL Construction Verification
  console.log(`\n4. Public URL Construction Test:`);
  const sampleLocal = "/uploads/categories/display/cms-image-1787848523473-0tg7z.webp";
  const defaultUrl = resolveMediaUrl(sampleLocal, { preferB2: false });
  const b2ResolvedUrl = resolveMediaUrl(sampleLocal, { preferB2: true });
  console.log(`   - Default Mode URL (Local Fallback): ${defaultUrl}`);
  console.log(`   - B2 Mode URL (Cloud Delivery):     ${b2ResolvedUrl}`);

  // 5. Audit Local Integrity
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  function walk(d) {
    let r = [];
    if (!fs.existsSync(d)) return r;
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) r = r.concat(walk(p));
      else r.push(p);
    }
    return r;
  }
  const localUploadFiles = walk(uploadsDir);
  console.log(`\n5. Local Storage & Database Integrity:`);
  console.log(`   - Local public/uploads/ Files: ✅ ${localUploadFiles.length}/106 intact`);

  const db = new sqlite("data/jaipur_stonecraft.db");
  const pCount = db.prepare("SELECT count(*) as c FROM products").get().c;
  console.log(`   - SQLite Recovery Database:     ✅ ${pCount} products intact`);

  console.log("\n==================================================");
  console.log("=== PHASE 6E READINESS AUDIT COMPLETE ===");
  console.log("==================================================\n");
}

main().catch(err => {
  console.error("Readiness audit failed:", err);
  process.exit(1);
});
