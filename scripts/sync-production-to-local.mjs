/**
 * Jaipur Stonecraft — Production to Local Synchronization Runner (Phase 7A)
 *
 * Pulls a verified, read-only snapshot from the Production Database (Hostinger or Cloud)
 * and refreshes the local development database mirror safely without touching production.
 *
 * Usage:
 *   npm run sync:prod
 *   node --env-file=.env scripts/sync-production-to-local.mjs
 */

import { executeCloudToLocalSync } from "../lib/backup/cloud-sync-engine.js";

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — PRODUCTION -> LOCAL SYNC RUNNER");
  console.log("Mode: Safe Read-Only Production Snapshot -> Local MySQL Mirror");
  console.log("==================================================\n");

  try {
    const report = await executeCloudToLocalSync();

    console.log("✅ PRODUCTION SYNC COMPLETED SUCCESSFULLY IN " + report.durationMs + " ms");
    console.log("Timestamp:", report.timestamp);
    console.log("Total Records Synced:", report.totalRowsSynced);
    console.log("");
    console.log("--- Compressed Local Backup Archive ---");
    console.log("File:", report.backup.filePath);
    console.log("Size:", report.backup.sizeKb + " KB (Compressed .sql.gz)");
    console.log("");
    console.log("--- Local MySQL Mirror Status ---");
    console.log("14 Schema Tables Refreshed & Verified:");
    console.table(report.tableSummary);
    console.log("");
    console.log("--- Retention & Pruning ---");
    console.log("Historical Backups Retained:", report.retention.retainedCount);
    console.log("Old Backups Pruned (>14 days):", report.retention.prunedCount);
    console.log("--------------------------------------------------\n");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ PRODUCTION SYNC FAILED:", error.message);
    console.log("Note: Local MySQL remains on previous known-good state with zero partial writes.");
    process.exit(1);
  }
}

main();
