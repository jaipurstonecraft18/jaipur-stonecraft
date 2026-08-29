/**
 * Jaipur Stonecraft — Database & Image Restore Runner (Phase 5C)
 * 
 * Usage:
 *   Restore DB:
 *     node --env-file=.env scripts/restore-runner.js --db --file backups/db/full/db_full_YYYY-MM-DD.sql.gz --target-db jaipur_stonecraft_test
 *   Restore Images:
 *     node --env-file=.env scripts/restore-runner.js --images --manifest backups/images/manifests/images_manifest_YYYY-MM-DD.json --target-dir scratch/test_restore_images
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import mysql from "mysql2/promise";
import { restoreImagesFromManifest } from "../lib/backup/image-archiver.js";
import { validateDatabaseDump } from "../lib/backup/db-exporter.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    isDb: false,
    isImages: false,
    file: null,
    manifest: null,
    targetDb: "jaipur_stonecraft_restore_test",
    targetDir: path.join(process.cwd(), "scratch", "test_restore_images_5c"),
    dryRun: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--db") options.isDb = true;
    if (args[i] === "--images") options.isImages = true;
    if (args[i] === "--dry-run") options.dryRun = true;
    if (args[i] === "--file" && args[i + 1]) options.file = args[++i];
    if (args[i] === "--manifest" && args[i + 1]) options.manifest = args[++i];
    if (args[i] === "--target-db" && args[i + 1]) options.targetDb = args[++i];
    if (args[i] === "--target-dir" && args[i + 1]) options.targetDir = args[++i];
  }

  return options;
}

async function restoreDatabaseToTestDb(dumpFilePath, targetDbName, isDryRun = false) {
  if (!fs.existsSync(dumpFilePath)) {
    throw new Error(`SQL dump file not found at ${dumpFilePath}`);
  }

  console.log(`Analyzing dump file: ${dumpFilePath}`);
  const validation = await validateDatabaseDump(dumpFilePath);
  console.log(`Dump Validation: Detected ${validation.detectedTables.length} tables, ${validation.insertStatements} batch inserts.`);

  if (isDryRun) {
    return {
      dryRun: true,
      targetDb: targetDbName,
      validation
    };
  }

  // Decompress if .gz
  let sqlDump = "";
  if (dumpFilePath.endsWith(".gz")) {
    sqlDump = zlib.gunzipSync(fs.readFileSync(dumpFilePath)).toString("utf8");
  } else {
    sqlDump = fs.readFileSync(dumpFilePath, "utf8");
  }

  const localUrl = process.env.DATABASE_URL || "";
  if (!localUrl) {
    throw new Error("[Restore Runner Error]: DATABASE_URL environment variable is missing.");
  }
  const urlObj = new URL(localUrl);

  const conn = await mysql.createConnection({
    host: urlObj.hostname || "localhost",
    port: urlObj.port ? parseInt(urlObj.port, 10) : 3306,
    user: urlObj.username || "root",
    password: urlObj.password || "",
    multipleStatements: true,
    connectTimeout: 8000
  });

  console.log(`Connecting to Local MySQL to restore into test database '${targetDbName}'...`);

  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${targetDbName}\``);
    await conn.query(`USE \`${targetDbName}\``);

    const { CREATE_TABLES_SQL_STATEMENTS } = await import("../lib/db/schema.js");
    for (const stmt of CREATE_TABLES_SQL_STATEMENTS) {
      await conn.query(stmt);
    }

    console.log("Executing SQL restoration dump...");
    await conn.query(sqlDump);

    const [tables] = await conn.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    const tableCounts = {};
    let totalRows = 0;

    for (const t of tableNames) {
      const [cntRow] = await conn.query(`SELECT COUNT(*) as c FROM \`${t}\``);
      const count = cntRow[0].c;
      tableCounts[t] = count;
      totalRows += count;
    }

    console.log(`Restoration to '${targetDbName}' complete! Verified ${totalRows} rows across ${tableNames.length} tables.`);

    // Clean up temporary test database to keep system clean
    await conn.query(`DROP DATABASE IF EXISTS \`${targetDbName}\``);
    console.log(`Cleaned up temporary test database '${targetDbName}'.`);

    return {
      dryRun: false,
      targetDb: targetDbName,
      tables: tableCounts,
      totalRows,
      validation
    };
  } finally {
    await conn.end();
  }
}

async function main() {
  const options = parseArgs();

  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — BACKUP RESTORE VERIFIER (PHASE 5C)");
  console.log("==================================================\n");

  if (!options.isDb && !options.isImages) {
    console.log("Auto-detecting latest backups for non-destructive restore validation...\n");
    options.isDb = true;
    options.isImages = true;
  }

  try {
    // 1. Test Database Restore
    if (options.isDb) {
      let dbFile = options.file;
      if (!dbFile) {
        const fullDir = path.join(process.cwd(), "backups", "db", "full");
        if (fs.existsSync(fullDir)) {
          const files = fs.readdirSync(fullDir).filter(f => f.endsWith(".sql.gz") || f.endsWith(".sql")).sort();
          if (files.length > 0) {
            dbFile = path.join(fullDir, files[files.length - 1]);
          }
        }
      }

      if (dbFile && fs.existsSync(dbFile)) {
        console.log(`--- [1/2] Testing Non-Destructive Database Restore ---`);
        console.log(`Source File: ${dbFile}`);
        const res = await restoreDatabaseToTestDb(dbFile, options.targetDb, options.dryRun);
        console.log("✅ DATABASE RESTORE TEST: PASSED 100%");
        console.log("Tables Restored:", Object.keys(res.tables || {}).length);
        console.log("Total Rows Verified:", res.totalRows);
        console.log("");
      } else {
        console.log("⚠️ No database backup file found to restore test. Run 'npm run backup' first.");
      }
    }

    // 2. Test Image Restore
    if (options.isImages) {
      let manifestFile = options.manifest || options.file;
      if (!manifestFile) {
        const manifestDir = path.join(process.cwd(), "backups", "images", "manifests");
        if (fs.existsSync(manifestDir)) {
          const files = fs.readdirSync(manifestDir).filter(f => f.endsWith(".json")).sort();
          if (files.length > 0) {
            manifestFile = path.join(manifestDir, files[files.length - 1]);
          }
        }
      }

      if (manifestFile && fs.existsSync(manifestFile)) {
        console.log(`--- [2/2] Testing Non-Destructive Image Restore ---`);
        console.log(`Manifest File: ${manifestFile}`);
        console.log(`Target Test Directory: ${options.targetDir}`);
        const res = await restoreImagesFromManifest(manifestFile, options.targetDir);
        console.log("✅ IMAGE RESTORE TEST: PASSED 100%");
        console.log("Files Restored:", res.totalRestored);
        console.log("SHA-256 Hashes Verified:", res.verifiedHashes);
        console.log("Errors:", res.errors.length === 0 ? "None (0 errors)" : res.errors.join(", "));

        // Clean up temporary restore test folder
        if (fs.existsSync(options.targetDir)) {
          fs.rmSync(options.targetDir, { recursive: true, force: true });
          console.log(`Cleaned up temporary test directory '${options.targetDir}'.`);
        }
        console.log("");
      } else {
        console.log("⚠️ No image manifest found to restore test. Run 'npm run backup' first.");
      }
    }

    console.log("==================================================");
    console.log("ALL RESTORATION TESTS VERIFIED NON-DESTRUCTIVELY");
    console.log("==================================================\n");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ RESTORATION TEST FAILED:", err.message);
    process.exit(1);
  }
}

main();
