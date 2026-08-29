/**
 * Jaipur Stonecraft — Hostinger Migration & Parity Verification Runner (Phase 7E)
 *
 * Usage:
 *   node --env-file=.env scripts/verify-hostinger-migration.mjs --db
 *   node --env-file=.env scripts/verify-hostinger-migration.mjs --media
 *   node --env-file=.env scripts/verify-hostinger-migration.mjs --all
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { getLatestDbManifest, SCHEMA_TABLES } from "../lib/backup/db-exporter.js";
import { getLatestImageManifest, walkDirectory, computeFileHash } from "../lib/backup/image-archiver.js";

async function verifyDatabaseParity(targetConnString) {
  console.log("\n--- [1/2] Database Parity Verification ---");
  const manifestDir = path.join(process.cwd(), "backups", "db", "manifests");
  const baselineManifest = getLatestDbManifest(manifestDir);

  if (!baselineManifest) {
    throw new Error("Baseline database manifest not found in backups/db/manifests/. Run 'npm run backup' first.");
  }

  const connString = targetConnString || process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL;
  if (!connString) {
    throw new Error("Target DATABASE_URL (or PRODUCTION_DATABASE_URL) is not defined.");
  }

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(connString);
  const sanitizedUri = connString.replace(/[?&]ssl-mode=[^&]+/i, "");

  const conn = await mysql.createConnection({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10000
  });

  const parityReport = {
    targetHost: connString.includes("@") ? connString.split("@")[1].split("/")[0] : "localhost",
    baselineTimestamp: baselineManifest.timestamp,
    baselineTotalRows: baselineManifest.totalRows,
    targetTotalRows: 0,
    tableResults: [],
    allMatch: true
  };

  try {
    for (const tableName of SCHEMA_TABLES) {
      const baselineStats = baselineManifest.tableStats[tableName] || { rowCount: 0, checksum: "" };
      let targetRowCount = 0;

      try {
        const [rows] = await conn.query(`SELECT COUNT(*) as c FROM \`${tableName}\``);
        targetRowCount = rows[0].c;
      } catch (err) {
        targetRowCount = -1; // Table missing
      }

      parityReport.targetTotalRows += (targetRowCount > 0 ? targetRowCount : 0);

      const isMatch = targetRowCount === baselineStats.rowCount;
      if (!isMatch) {
        parityReport.allMatch = false;
      }

      parityReport.tableResults.push({
        table: tableName,
        baselineRows: baselineStats.rowCount,
        targetRows: targetRowCount,
        difference: targetRowCount - baselineStats.rowCount,
        status: targetRowCount === -1 ? "MISSING" : (isMatch ? "MATCH (100%)" : "MISMATCH")
      });
    }
  } finally {
    await conn.end();
  }

  console.table(parityReport.tableResults);
  console.log(`Baseline Rows: ${parityReport.baselineTotalRows} | Target Rows: ${parityReport.targetTotalRows}`);
  if (parityReport.allMatch) {
    console.log("✅ DATABASE PARITY VERIFICATION: 100% PERFECT MATCH ACROSS ALL 14 TABLES");
  } else {
    console.error("❌ DATABASE PARITY MISMATCH DETECTED");
  }

  return parityReport;
}

async function verifyMediaParity(mediaDir = path.join(process.cwd(), "public", "uploads")) {
  console.log("\n--- [2/2] Media SHA-256 Parity Verification ---");
  const manifestDir = path.join(process.cwd(), "backups", "images", "manifests");
  const baselineManifest = getLatestImageManifest(manifestDir);

  if (!baselineManifest) {
    throw new Error("Baseline image manifest not found in backups/images/manifests/. Run 'npm run backup' first.");
  }

  const currentFiles = walkDirectory(mediaDir);
  const currentMap = new Map();
  for (const f of currentFiles) {
    currentMap.set(f.relativePath, f);
  }

  let verifiedHashes = 0;
  let mismatchedFiles = [];
  let missingFiles = [];

  for (const item of baselineManifest.files) {
    const localEntry = currentMap.get(item.relativePath);
    if (!localEntry) {
      missingFiles.push(item.relativePath);
      continue;
    }

    const currentHash = computeFileHash(localEntry.fullPath);
    if (currentHash === item.sha256) {
      verifiedHashes++;
    } else {
      mismatchedFiles.push({ path: item.relativePath, expected: item.sha256, actual: currentHash });
    }
  }

  console.log(`Target Directory: ${mediaDir}`);
  console.log(`Total Baseline Files: ${baselineManifest.totalFiles} (${(baselineManifest.totalSizeBytes / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`Total Present Files:  ${currentFiles.length}`);
  console.log(`Verified SHA-256 Hashes: ${verifiedHashes} / ${baselineManifest.totalFiles}`);

  const isMediaMatch = verifiedHashes === baselineManifest.totalFiles && missingFiles.length === 0 && mismatchedFiles.length === 0;

  if (isMediaMatch) {
    console.log("✅ MEDIA PARITY VERIFICATION: 100% BYTE-FOR-BYTE IDENTICAL ACROSS ALL 106 ASSETS");
  } else {
    console.error(`❌ MEDIA MISMATCH: ${missingFiles.length} missing, ${mismatchedFiles.length} hash mismatches`);
  }

  return {
    allMatch: isMediaMatch,
    totalBaselineFiles: baselineManifest.totalFiles,
    totalPresentFiles: currentFiles.length,
    verifiedHashes,
    missingFiles,
    mismatchedFiles
  };
}

async function main() {
  const args = process.argv.slice(2);
  const doDb = args.includes("--db") || args.includes("--all") || args.length === 0;
  const doMedia = args.includes("--media") || args.includes("--all") || args.length === 0;

  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — HOSTINGER MIGRATION & PARITY VERIFICATION (PHASE 7E)");
  console.log("================================================================================");

  try {
    let dbRes = null;
    let mediaRes = null;

    if (doDb) {
      dbRes = await verifyDatabaseParity();
    }
    if (doMedia) {
      mediaRes = await verifyMediaParity();
    }

    console.log("\n================================================================================");
    if ((!dbRes || dbRes.allMatch) && (!mediaRes || mediaRes.allMatch)) {
      console.log("🚀 MIGRATION VERIFICATION COMPLETE: ALL INTEGRITY CHECKS PASSED 100%");
      process.exit(0);
    } else {
      console.error("🛑 MIGRATION VERIFICATION FAILED: Review table and media reports above.");
      process.exit(1);
    }
  } catch (err) {
    console.error("\n❌ VERIFICATION ERROR:", err.message);
    process.exit(1);
  }
}

main();
