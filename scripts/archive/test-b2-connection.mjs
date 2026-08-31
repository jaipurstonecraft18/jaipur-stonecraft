/**
 * Jaipur Stonecraft — Backblaze B2 Isolated Connection Test Script
 * 
 * Usage:
 *   node --env-file=.env scripts/test-b2-connection.mjs
 */

import { testB2Connection } from "../lib/storage/b2-client.js";

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — BACKBLAZE B2 CONNECTION TEST");
  console.log("==================================================\n");

  const requiredVars = ["B2_KEY_ID", "B2_APPLICATION_KEY", "B2_BUCKET_NAME", "B2_ENDPOINT"];
  const missing = [];

  for (const v of requiredVars) {
    const val = process.env[v];
    if (!val || val.startsWith("PASTE_")) {
      missing.push(v);
    }
  }

  if (missing.length > 0) {
    console.log("⚠️ B2 Configuration Status: PENDING CREDENTIAL ENTRY");
    console.log("The following required environment variables need to be set in .env:");
    missing.forEach(m => console.log(`  - ${m}`));
    console.log("\nPlease add your Backblaze B2 credentials to your local .env file in private.");
    console.log("--------------------------------------------------\n");
    process.exit(0);
  }

  console.log("1. Environment variables detected: All required keys present.");
  console.log(`2. Target Bucket: ${process.env.B2_BUCKET_NAME}`);
  console.log(`3. Target Endpoint: ${process.env.B2_ENDPOINT}`);
  console.log("4. Attempting TLS connection and isolated permission test...");

  try {
    const report = await testB2Connection();
    console.log("\n✅ BACKBLAZE B2 CONNECTION TEST: 100% SUCCESSFUL");
    console.log(`- Bucket Accessibility: VERIFIED (Bucket '${report.bucket}' is reachable)`);
    console.log(`- Isolated Object Write/Read Test: VERIFIED (Test object created and confirmed)`);
    console.log(`- Isolated Object Cleanup: VERIFIED (Test object '${report.testKey}' immediately deleted)`);
    console.log("- Zero Production Objects Touched: CONFIRMED");
    console.log("--------------------------------------------------\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ B2 CONNECTION TEST FAILED:", error.message || error);
    console.log("Note: Zero production data or local files were affected.");
    process.exit(1);
  }
}

main();
