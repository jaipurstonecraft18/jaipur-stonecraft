/**
 * Jaipur Stonecraft — CLI Backup Execution Script
 * 
 * Usage:
 *   node scripts/backup-runner.js
 *   npm run backup
 */

import { runFullBackup } from "../lib/backup/backup-engine.js";

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — AUTOMATED BACKUP RUNNER");
  console.log("==================================================\n");

  try {
    const report = await runFullBackup();

    console.log("✅ BACKUP COMPLETED SUCCESSFULLY");
    console.log("Timestamp:", report.timestamp);
    console.log("Execution Time:", `${report.durationMs} ms`);
    console.log("");
    console.log("--- Database Backup ---");
    console.log("SQL Dump File:", report.database.filePath);
    console.log("File Size:", `${report.database.fileSizeKb} KB`);
    console.log("Tables Exported:", Object.keys(report.database.summary.tables).join(", "));
    console.log("Total Rows Exported:", report.database.summary.totalRows);
    console.log("Google Drive Sync:", report.database.googleDriveSync.synced ? "SYNCED" : `SKIPPED (${report.database.googleDriveSync.reason})`);
    console.log("");
    console.log("--- Image Archive Backup ---");
    console.log("Archive JSON File:", report.images.filePath);
    console.log("Archive File Size:", `${report.images.fileSizeKb} KB`);
    console.log("Total Production Images:", report.images.totalImages);
    console.log("Total Image Content Size:", `${(report.images.totalSizeBytes / 1024).toFixed(2)} KB`);
    console.log("Google Drive Sync:", report.images.googleDriveSync.synced ? "SYNCED" : `SKIPPED (${report.images.googleDriveSync.reason})`);
    console.log("");
    console.log("--- Retention Pruning ---");
    console.log("Retention Limit:", `${report.retention.retentionLimit} backups`);
    console.log("Local DB Files Pruned:", report.retention.localDbFilesPruned);
    console.log("Local Image Files Pruned:", report.retention.localImgFilesPruned);
    console.log("Remote Drive Files Pruned:", report.retention.remoteDriveFilesPruned);
    console.log("--------------------------------------------------\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ BACKUP FAILED:", error);
    process.exit(1);
  }
}

main();
