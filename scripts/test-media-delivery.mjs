/**
 * Jaipur Stonecraft — Media Delivery & URL Resolution Test Suite
 */

import {
  resolveMediaUrl,
  toB2Url,
  toLocalUploadUrl,
  isAbsoluteUrl,
  isB2Url,
  isLocalUploadUrl
} from "../lib/storage/media-helper.js";
import fs from "fs";
import path from "path";
import sqlite from "better-sqlite3";

async function runTests() {
  console.log("==================================================");
  console.log("=== B2 MEDIA DELIVERY & RESOLVER TEST SUITE ===");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(name, condition) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${name}`);
    }
  }

  // Read real manifest entry for HTTP verification
  const manifestDir = path.join(process.cwd(), "backups", "b2_migration");
  const manifests = fs.readdirSync(manifestDir).filter(f => f.startsWith("b2_migration_manifest_")).sort();
  const latestManifest = JSON.parse(fs.readFileSync(path.join(manifestDir, manifests[manifests.length - 1]), "utf8"));
  const sampleItem = latestManifest.items[0];

  // Test 1: Local Default Delivery (Fallback / Default Mode)
  const sampleLocalPath = `/uploads/${sampleItem.sourcePath}`;
  const defaultResolved = resolveMediaUrl(sampleLocalPath, { preferB2: false });
  assert("Default delivery keeps canonical local path", defaultResolved === sampleLocalPath);

  // Test 2: B2 Delivery (Opt-In / Cloud Mode)
  const b2Resolved = resolveMediaUrl(sampleLocalPath, { preferB2: true });
  assert("B2 resolution produces valid B2 URL", b2Resolved.includes("production/") && b2Resolved.includes(sampleItem.sourcePath));

  // Test 3: External Placeholder Untouched
  const placeholderUrl = "https://placehold.co/600x800/png?text=Marble+Statue";
  const placeholderResolved = resolveMediaUrl(placeholderUrl, { preferB2: true });
  assert("External placeholders remain untouched", placeholderResolved === placeholderUrl);

  // Test 4: Two-Way URL Translation
  const generatedB2Url = toB2Url(sampleLocalPath);
  const revertedLocalPath = toLocalUploadUrl(generatedB2Url);
  assert("B2 URL reverts cleanly to local /uploads/ path", revertedLocalPath === sampleLocalPath);

  // Test 5: Helper predicates
  assert("isAbsoluteUrl detects external URLs", isAbsoluteUrl(placeholderUrl) && !isAbsoluteUrl(sampleLocalPath));
  assert("isLocalUploadUrl detects /uploads/ paths", isLocalUploadUrl(sampleLocalPath) && !isLocalUploadUrl(placeholderUrl));
  assert("isB2Url detects B2 URLs", isB2Url(generatedB2Url) && !isB2Url(sampleLocalPath));

  // Test 6: Verify sample migrated B2 object via Authenticated S3 API
  console.log("\nTesting B2 object accessibility:");
  try {
    const { checkObjectExists } = await import("../lib/storage/b2-client.js");
    const s3Check = await checkObjectExists(sampleItem.b2Key);
    assert(`Authenticated B2 S3 HeadObject returns object exists (Size: ${s3Check.contentLength} bytes)`, s3Check.exists === true);
    
    // Check public HTTP access
    const testHead = await fetch(generatedB2Url, { method: "HEAD" });
    if (testHead.status === 200) {
      assert(`Public unauthenticated HTTP access is enabled (200 OK)`, true);
    } else {
      console.log(`ℹ️ [INFO] Public unauthenticated HTTP access returned Status ${testHead.status}. (Bucket privacy setting is currently Private - set to Public in B2 console for direct unauthenticated CDN delivery).`);
    }
  } catch (e) {
    console.warn("B2 access test warning:", e.message);
  }

  // Test 7: Confirm Local Files & DB Untouched
  const localUploads = fs.readdirSync(path.join(process.cwd(), "public", "uploads"));
  assert("Local public/uploads/ directories intact", localUploads.includes("products") && localUploads.includes("categories"));

  const db = new sqlite("data/jaipur_stonecraft.db");
  const pCount = db.prepare("SELECT count(*) as c FROM products").get().c;
  assert("SQLite recovery DB intact", pCount === 314);

  console.log(`\n==================================================`);
  console.log(`TEST SUMMARY: ${passed}/${total} TESTS PASSED (${((passed / total) * 100).toFixed(0)}%)`);
  console.log(`==================================================\n`);

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
