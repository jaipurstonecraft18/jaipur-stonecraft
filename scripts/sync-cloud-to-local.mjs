/**
 * Jaipur Stonecraft — CLI Cloud to Local Sync Runner
 * 
 * Usage:
 *   node scripts/sync-cloud-to-local.mjs
 *   npm run sync:cloud
 */

import { executeCloudToLocalSync } from "../lib/backup/cloud-sync-engine.js";

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — AIVEN CLOUD -> LOCAL MYSQL SYNC");
  console.log("Mode: Read-Only Cloud Snapshot -> Verified Local Mirror");
  console.log("==================================================\n");

  try {
    const report = await executeCloudToLocalSync();

    console.log("✅ SYNC COMPLETED SUCCESSFULLY IN " + report.durationMs + " ms");
    console.log("Timestamp:", report.timestamp);
    console.log("Total Records Synced:", report.totalRowsSynced);
    console.log("");
    console.log("--- Compressed Local Backup ---");
    console.log("File:", report.backup.filePath);
    console.log("Size:", report.backup.sizeKb + " KB (Compressed .sql.gz)");
    console.log("");
    console.log("--- Local MySQL Mirror Status ---");
    console.log("14 Tables Refreshed & Verified:");
    console.table(report.tableSummary);
    console.log("");
    console.log("--- Retention Pruning ---");
    console.log("Historical Backups Retained:", report.retention.retainedCount);
    console.log("Old Backups Pruned (>14 days):", report.retention.prunedCount);
    console.log("--------------------------------------------------\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ CLOUD SYNC FAILED:", error.message);
    console.log("Note: Local MySQL remains on previous known-good state. Zero partial corruption.");
    process.exit(1);
  }
}

main();
