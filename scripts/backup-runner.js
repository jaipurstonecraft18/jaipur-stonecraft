/**
 * Jaipur Stonecraft — CLI Master Local Backup Execution Runner (Phase 5C)
 * 
 * Usage:
 *   npm run backup
 *   npm run backup -- --full
 */

import { runFullBackup } from "../lib/backup/backup-engine.js";

async function main() {
  const isForceFull = process.argv.includes("--full");

  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — MASTER LOCAL BACKUP SYSTEM");
  console.log(`Mode: ${isForceFull ? "Forced Full Backup" : "Change-Aware Delta Backup"}`);
  console.log("Target: Local Storage (Aiven MySQL -> Local DB & CAS Images)");
  console.log("==================================================\n");

  try {
    const report = await runFullBackup({ forceFull: isForceFull });

    console.log("✅ BACKUP COMPLETED SUCCESSFULLY");
    console.log("Timestamp:", report.timestamp);
    console.log("Execution Time:", `${report.durationMs} ms`);
    console.log("");
    console.log("--- 1. Database Backup (Aiven MySQL / Local Mirror) ---");
    console.log("Source:", report.database.source);
    console.log("Status:", report.database.status);
    console.log("Total Records:", report.database.totalRows);
    console.log("Dump File Created:", report.database.dumpFileCreated ? "YES (New compressed dump)" : "NO (Unchanged - deduplicated)");
    console.log("Compressed Dump Path:", report.database.dumpFilePath);
    console.log("Compressed Dump Size:", `${report.database.compressedSizeKb} KB (.sql.gz)`);
    console.log("Database Manifest:", report.database.manifestFilePath);
    console.log("");
    console.log("--- 2. Content-Addressable Image Backup (public/uploads) ---");
    console.log("Total Production Files:", report.images.totalImages);
    console.log("Total Size:", `${(report.images.totalSizeBytes / (1024 * 1024)).toFixed(2)} MB`);
    console.log("Change Detection Breakdown:");
    console.log(`  - New Files:       ${report.images.stats.newFiles}`);
    console.log(`  - Modified Files:  ${report.images.stats.modifiedFiles}`);
    console.log(`  - Unchanged Files: ${report.images.stats.unchangedFiles} (Skipped redundant copy)`);
    console.log(`  - Deleted Files:   ${report.images.stats.deletedFiles} (Preserved in historical CAS)`);
    console.log("New Objects Stored:", `${report.images.newObjectsStored} unique file(s)`);
    console.log("Image Manifest:", report.images.manifestFilePath);
    console.log("");
    console.log("--- 3. Retention & Pruning ---");
    console.log("Local Retention Limit:", `${report.retention.retentionLimit} backups`);
    console.log("Local DB Dumps Pruned:", report.retention.localDbDumpsPruned);
    console.log("Local DB Manifests Pruned:", report.retention.localDbManifestsPruned);
    console.log("Local Image Manifests Pruned:", report.retention.localImgManifestsPruned);
    console.log("--------------------------------------------------\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ BACKUP FAILED:", error);
    process.exit(1);
  }
}

main();
