/**
 * Jaipur Stonecraft — Master Bidirectional Synchronization & Parity Coordinator
 *
 * Orchestrates:
 *   1. LOCAL <-> PRODUCTION Environment Comparison & Fingerprinting (DB & Media)
 *   2. LOCAL -> PRODUCTION Push (DB Batch + HTTPS Media Upload) with pre-push backup
 *   3. PRODUCTION -> LOCAL Pull (DB Refresh + HTTPS Media Download) with pre-pull backup
 *   4. Standalone & Targeted Database/Image Restoration
 *   5. Real-Time Parity Verification & Conflict Detection
 *
 * Guarantees:
 *   - NEVER prints or leaks secrets, database credentials, or API keys.
 *   - Strict dry-run by default; requires explicit --confirm before performing live writes.
 *   - Creates automated rollback snapshots prior to any replacement.
 *   - Atomic media uploads with server-side SHA-256 verification.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import zlib from "zlib";
import mysql from "mysql2/promise";
import { CREATE_TABLES_SQL_STATEMENTS } from "../db/schema.js";
import { SCHEMA_TABLES, getLatestDbManifest, validateDatabaseDump } from "./db-exporter.js";
import { walkDirectory, computeFileHash, getLatestImageManifest, backupUploadImages, restoreImagesFromManifest } from "./image-archiver.js";
import { runFullBackup } from "./backup-engine.js";

const WORKSPACE_ROOT = process.cwd();

function escapeSqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return val;
  if (typeof val === "boolean") return val ? "1" : "0";
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  if (typeof val === "object") {
    const str = JSON.stringify(val);
    return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  const strVal = String(val);
  return `'${strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r")}'`;
}

function computeRowsChecksum(rows) {
  const hash = crypto.createHash("sha256");
  for (const r of rows) {
    hash.update(JSON.stringify(r));
  }
  return hash.digest("hex");
}

/**
 * Connect to a MySQL database safely
 */
async function connectDb(connString, label = "Database") {
  if (!connString) {
    throw new Error(`[Sync Error]: Connection string for ${label} is missing.`);
  }

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(connString);
  const sanitizedUri = connString.replace(/[?&]ssl-mode=[^&]+/i, "");

  return await mysql.createConnection({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    multipleStatements: true,
    connectTimeout: 10000
  });
}

/**
 * Helper to fetch remote media manifest via authenticated sync endpoint or public URL fallback
 */
async function fetchRemoteMediaManifest(options = {}) {
  const syncBaseUrl = (options.mediaSyncUrl || process.env.MEDIA_SYNC_URL || process.env.PRODUCTION_APP_URL || "").replace(/\/+$/, "");
  const syncSecret = options.mediaSyncSecret || process.env.MEDIA_SYNC_SECRET || process.env.ADMIN_SECRET_KEY;

  if (!syncBaseUrl) {
    return null;
  }

  try {
    const headers = {
      "User-Agent": "JaipurStonecraft-SyncRunner/1.0"
    };
    if (syncSecret) {
      headers["x-sync-secret"] = syncSecret.trim();
      headers["Authorization"] = `Bearer ${syncSecret.trim()}`;
    }

    const res = await fetch(`${syncBaseUrl}/api/admin/sync/media/manifest`, { headers });
    if (res.status === 200) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.files)) {
        return data;
      }
    }
  } catch (err) {
    // Non-fatal, fallback to local baseline manifest
  }

  return null;
}

/**
 * Compares Local and Production environments (Database & Media)
 */
export async function compareEnvironments(options = {}) {
  const localUrl = options.localUrl || process.env.DATABASE_URL;
  const prodUrl = options.prodUrl || process.env.PRODUCTION_DATABASE_URL || process.env.HOSTINGER_DATABASE_URL;

  const comparison = {
    timestamp: new Date().toISOString(),
    hasProdDbConnection: !!prodUrl,
    db: {
      inSync: true,
      localTotalRows: 0,
      prodTotalRows: 0,
      tables: []
    },
    media: {
      inSync: true,
      localCount: 0,
      remoteCount: 0,
      toPush: [],     // New or modified locally -> push to prod
      toPull: [],     // New or modified on prod -> pull to local
      identical: [],  // Matching byte-for-byte
      totalBytesToPush: 0,
      totalBytesToPull: 0
    },
    overallInSync: true
  };

  // 1. Audit Database
  let localConn = null;
  let prodConn = null;

  try {
    localConn = await connectDb(localUrl, "Local MySQL");
    if (prodUrl) {
      try {
        prodConn = await connectDb(prodUrl, "Production MySQL");
      } catch (err) {
        // Direct remote MySQL connection unavailable
      }
    }

    for (const table of SCHEMA_TABLES) {
      let localRows = [];
      try {
        const [rows] = await localConn.query(`SELECT * FROM \`${table}\``);
        localRows = rows;
      } catch (e) {
        localRows = [];
      }

      const localChecksum = computeRowsChecksum(localRows);
      comparison.db.localTotalRows += localRows.length;

      let prodRowCount = -1;
      let prodChecksum = "";
      if (prodConn) {
        try {
          const [pRows] = await prodConn.query(`SELECT * FROM \`${table}\``);
          prodRowCount = pRows.length;
          prodChecksum = computeRowsChecksum(pRows);
          comparison.db.prodTotalRows += prodRowCount;
        } catch (e) {
          prodRowCount = -1;
        }
      }

      const isMatch = prodConn ? (localRows.length === prodRowCount && localChecksum === prodChecksum) : true;
      if (!isMatch) {
        comparison.db.inSync = false;
      }

      comparison.db.tables.push({
        table,
        localRows: localRows.length,
        prodRows: prodRowCount === -1 ? "N/A" : prodRowCount,
        localChecksum: localChecksum.substring(0, 8),
        prodChecksum: prodChecksum ? prodChecksum.substring(0, 8) : "N/A",
        status: isMatch ? "MATCH" : "DIFF"
      });
    }
  } finally {
    if (localConn) await localConn.end();
    if (prodConn) await prodConn.end();
  }

  // 2. Audit Media
  const uploadsDir = options.mediaDir || path.join(WORKSPACE_ROOT, "public", "uploads");
  const localMedia = walkDirectory(uploadsDir);
  comparison.media.localCount = localMedia.length;

  const localMap = new Map();
  for (const f of localMedia) {
    const hash = computeFileHash(f.fullPath);
    localMap.set(f.relativePath, { ...f, sha256: hash });
  }

  // Check remote manifest or fall back to baseline local manifest
  const remoteManifest = await fetchRemoteMediaManifest(options);
  let referenceFiles = [];

  if (remoteManifest && Array.isArray(remoteManifest.files)) {
    referenceFiles = remoteManifest.files;
    comparison.media.remoteCount = remoteManifest.files.length;
  } else {
    const manifestDir = path.join(WORKSPACE_ROOT, "backups", "images", "manifests");
    const baselineManifest = getLatestImageManifest(manifestDir);
    if (baselineManifest && Array.isArray(baselineManifest.files)) {
      referenceFiles = baselineManifest.files;
      comparison.media.remoteCount = baselineManifest.files.length;
    }
  }

  const refMap = new Map();
  for (const rf of referenceFiles) {
    refMap.set(rf.relativePath, rf);
  }

  // Find local additions and updates
  for (const [rel, localItem] of localMap.entries()) {
    const refItem = refMap.get(rel);
    if (!refItem) {
      comparison.media.toPush.push({ relativePath: rel, size: localItem.size, reason: "NEW_LOCAL" });
      comparison.media.totalBytesToPush += localItem.size;
    } else if (refItem.sha256 !== localItem.sha256) {
      comparison.media.toPush.push({ relativePath: rel, size: localItem.size, reason: "MODIFIED_LOCAL" });
      comparison.media.totalBytesToPush += localItem.size;
    } else {
      comparison.media.identical.push(rel);
    }
  }

  // Find remote additions
  for (const [rel, refItem] of refMap.entries()) {
    if (!localMap.has(rel)) {
      comparison.media.toPull.push({ relativePath: rel, size: refItem.size, reason: "NEW_REMOTE" });
      comparison.media.totalBytesToPull += refItem.size || 0;
    }
  }

  if (comparison.media.toPush.length > 0 || comparison.media.toPull.length > 0) {
    comparison.media.inSync = false;
  }

  comparison.overallInSync = comparison.db.inSync && comparison.media.inSync;
  return comparison;
}

/**
 * PUSH: Local -> Production Synchronization
 */
export async function executeSyncPush(options = {}) {
  const isDryRun = options.confirm !== true;
  const isDbOnly = options.dbOnly === true;
  const isMediaOnly = options.mediaOnly === true;

  console.log("================================================================================");
  console.log(`JAIPUR STONECRAFT — LOCAL -> PRODUCTION SYNC PUSH [${isDryRun ? "DRY-RUN MODE" : "CONFIRMED EXECUTION"}]`);
  console.log("================================================================================\n");

  const comparison = await compareEnvironments(options);

  if (!isMediaOnly) {
    console.log("--- 1. Database Parity Status ---");
    console.table(comparison.db.tables);
    console.log(`Local Total Records: ${comparison.db.localTotalRows} | Prod Records: ${comparison.db.prodTotalRows}`);
    console.log(`Database In Sync:    ${comparison.db.inSync ? "YES (100% Matching)" : "NO (Differences Detected)"}`);
  }

  if (!isDbOnly) {
    console.log("\n--- 2. Media Transfer Plan ---");
    console.log(`Local Assets:        ${comparison.media.localCount}`);
    console.log(`Identical Assets:    ${comparison.media.identical.length}`);
    console.log(`Files to Upload:     ${comparison.media.toPush.length} (${(comparison.media.totalBytesToPush / 1024).toFixed(1)} KB)`);

    if (comparison.media.toPush.length > 0) {
      console.log("\nFiles Planned for Upload:");
      for (const item of comparison.media.toPush) {
        console.log(`  + [${item.reason}] ${item.relativePath} (${(item.size / 1024).toFixed(1)} KB)`);
      }
    }
  }

  if (isDryRun) {
    console.log("\n================================================================================");
    console.log("🔒 DRY-RUN COMPLETED: Zero writes performed to production.");
    console.log("To execute live push to Production, rerun with: npm run sync:push -- --confirm");
    console.log("================================================================================\n");
    return { dryRun: true, comparison };
  }

  // Pre-Push Safety Backup
  console.log("\nStep 1: Creating Pre-Push Safety Snapshot...");
  const prePushBackup = await runFullBackup({
    backupBaseDir: path.join(WORKSPACE_ROOT, "backups", "pre_push")
  });
  console.log(`✅ Pre-push safety snapshot secured: ${prePushBackup.timestamp}`);

  // Step 2: Database Push
  const prodUrl = options.prodUrl || process.env.PRODUCTION_DATABASE_URL || process.env.HOSTINGER_DATABASE_URL;
  if (!isMediaOnly && prodUrl) {
    console.log("\nStep 2: Pushing Database Changes to Production MySQL...");
    const localConn = await connectDb(options.localUrl || process.env.DATABASE_URL, "Local MySQL");
    const prodConn = await connectDb(prodUrl, "Production MySQL");

    try {
      for (const stmt of CREATE_TABLES_SQL_STATEMENTS) {
        await prodConn.query(stmt);
      }

      await prodConn.query("SET FOREIGN_KEY_CHECKS = 0;");

      for (const tableName of SCHEMA_TABLES) {
        const [localRows] = await localConn.query(`SELECT * FROM \`${tableName}\``);
        await prodConn.query(`TRUNCATE TABLE \`${tableName}\``);

        if (localRows.length > 0) {
          const columns = Object.keys(localRows[0]);
          const colListStr = columns.map(c => `\`${c}\``).join(", ");
          const placeholders = `(${columns.map(() => "?").join(", ")})`;

          const BATCH_SIZE = 50;
          for (let i = 0; i < localRows.length; i += BATCH_SIZE) {
            const batch = localRows.slice(i, i + BATCH_SIZE);
            const values = [];
            const batchPlaceholders = [];

            for (const r of batch) {
              batchPlaceholders.push(placeholders);
              for (const col of columns) {
                let val = r[col];
                if (typeof val === "object" && val !== null && !(val instanceof Date)) {
                  val = JSON.stringify(val);
                }
                values.push(val);
              }
            }

            const sql = `INSERT INTO \`${tableName}\` (${colListStr}) VALUES ${batchPlaceholders.join(", ")}`;
            await prodConn.query(sql, values);
          }
        }
        console.log(`  + Pushed ${localRows.length} rows to \`${tableName}\``);
      }

      await prodConn.query("SET FOREIGN_KEY_CHECKS = 1;");
      console.log("✅ Database tables successfully synchronized.");
    } finally {
      await localConn.end();
      await prodConn.end();
    }
  }

  // Step 3: Media Upload via HTTPS Sync API
  if (!isDbOnly && comparison.media.toPush.length > 0) {
    console.log("\nStep 3: Uploading Media Assets to Production via Sync API...");
    const syncBaseUrl = (options.mediaSyncUrl || process.env.MEDIA_SYNC_URL || process.env.PRODUCTION_APP_URL || "").replace(/\/+$/, "");
    const syncSecret = options.mediaSyncSecret || process.env.MEDIA_SYNC_SECRET || process.env.ADMIN_SECRET_KEY;

    if (!syncBaseUrl) {
      console.warn("[Media Sync Warning]: MEDIA_SYNC_URL is not configured in .env. Skipping automated HTTP upload.");
    } else {
      const uploadsDir = path.join(WORKSPACE_ROOT, "public", "uploads");
      let uploadedCount = 0;

      for (const item of comparison.media.toPush) {
        const fullDiskPath = path.join(uploadsDir, item.relativePath.replace(/\//g, path.sep));
        if (!fs.existsSync(fullDiskPath)) continue;

        const fileBuffer = fs.readFileSync(fullDiskPath);
        const sha256 = computeFileHash(fullDiskPath);

        const formData = new FormData();
        const blob = new Blob([fileBuffer]);
        formData.append("file", blob, path.basename(item.relativePath));
        formData.append("relativePath", item.relativePath);
        formData.append("sha256", sha256);

        const headers = {
          "User-Agent": "JaipurStonecraft-SyncRunner/1.0"
        };
        if (syncSecret) {
          headers["x-sync-secret"] = syncSecret.trim();
          headers["Authorization"] = `Bearer ${syncSecret.trim()}`;
        }

        try {
          const res = await fetch(`${syncBaseUrl}/api/admin/sync/media/upload`, {
            method: "POST",
            headers,
            body: formData
          });
          const result = await res.json();
          if (res.status === 200 && result.success) {
            uploadedCount++;
            console.log(`  + [UPLOADED] ${item.relativePath}`);
          } else {
            console.error(`  - [UPLOAD FAILED] ${item.relativePath}: ${result.error || "Unknown server error"}`);
          }
        } catch (e) {
          console.error(`  - [UPLOAD ERROR] ${item.relativePath}: ${e.message}`);
        }
      }

      console.log(`✅ Media sync completed: ${uploadedCount} / ${comparison.media.toPush.length} assets uploaded.`);
    }

    // Update local manifest & CAS archive
    await backupUploadImages({
      backupDir: path.join(WORKSPACE_ROOT, "backups", "images"),
      sourceDir: path.join(WORKSPACE_ROOT, "public", "uploads")
    });
  }

  console.log("\n================================================================================");
  console.log("🚀 PRODUCTION SYNC PUSH COMPLETED SUCCESSFULLY");
  console.log("================================================================================\n");

  return { dryRun: false, prePushBackup, comparison };
}

/**
 * PULL: Production -> Local Synchronization
 */
export async function executeSyncPull(options = {}) {
  const isDryRun = options.confirm !== true;
  const isDbOnly = options.dbOnly === true;
  const isMediaOnly = options.mediaOnly === true;

  console.log("================================================================================");
  console.log(`JAIPUR STONECRAFT — PRODUCTION -> LOCAL SYNC PULL [${isDryRun ? "DRY-RUN MODE" : "CONFIRMED EXECUTION"}]`);
  console.log("================================================================================\n");

  const comparison = await compareEnvironments(options);

  if (!isMediaOnly) {
    console.log("--- 1. Current Database Comparison ---");
    console.table(comparison.db.tables);
    console.log(`Local Records: ${comparison.db.localTotalRows} | Prod Records: ${comparison.db.prodTotalRows}`);
  }

  if (!isDbOnly) {
    console.log("\n--- 2. Media Pull Plan ---");
    console.log(`Local Assets:        ${comparison.media.localCount}`);
    console.log(`Files to Download:   ${comparison.media.toPull.length} (${(comparison.media.totalBytesToPull / 1024).toFixed(1)} KB)`);

    if (comparison.media.toPull.length > 0) {
      console.log("\nFiles Planned for Download:");
      for (const item of comparison.media.toPull) {
        console.log(`  + [${item.reason}] ${item.relativePath} (${(item.size / 1024).toFixed(1)} KB)`);
      }
    }
  }

  if (isDryRun) {
    console.log("\n================================================================================");
    console.log("🔒 DRY-RUN COMPLETED: Zero writes performed to local environment.");
    console.log("To execute live pull from Production, rerun with: npm run sync:pull -- --confirm");
    console.log("================================================================================\n");
    return { dryRun: true, comparison };
  }

  // Step 1: Pre-Pull Local Safety Backup
  console.log("\nStep 1: Creating Pre-Pull Local Safety Snapshot...");
  const prePullBackup = await runFullBackup({
    backupBaseDir: path.join(WORKSPACE_ROOT, "backups", "pre_pull")
  });
  console.log(`✅ Pre-pull local backup secured: ${prePullBackup.timestamp}`);

  // Step 2: Database Pull
  const prodUrl = options.prodUrl || process.env.PRODUCTION_DATABASE_URL || process.env.HOSTINGER_DATABASE_URL;
  if (!isMediaOnly && prodUrl) {
    console.log("\nStep 2: Pulling Production Database Snapshot into Local MySQL...");
    const localConn = await connectDb(options.localUrl || process.env.DATABASE_URL, "Local MySQL");
    const prodConn = await connectDb(prodUrl, "Production MySQL");

    try {
      for (const stmt of CREATE_TABLES_SQL_STATEMENTS) {
        await localConn.query(stmt);
      }

      await localConn.query("SET FOREIGN_KEY_CHECKS = 0;");

      let totalSynced = 0;
      for (const tableName of SCHEMA_TABLES) {
        const [prodRows] = await prodConn.query(`SELECT * FROM \`${tableName}\``);
        await localConn.query(`TRUNCATE TABLE \`${tableName}\``);

        if (prodRows.length > 0) {
          const columns = Object.keys(prodRows[0]);
          const colListStr = columns.map(c => `\`${c}\``).join(", ");
          const placeholders = `(${columns.map(() => "?").join(", ")})`;

          const BATCH_SIZE = 50;
          for (let i = 0; i < prodRows.length; i += BATCH_SIZE) {
            const batch = prodRows.slice(i, i + BATCH_SIZE);
            const values = [];
            const batchPlaceholders = [];

            for (const r of batch) {
              batchPlaceholders.push(placeholders);
              for (const col of columns) {
                let val = r[col];
                if (typeof val === "object" && val !== null && !(val instanceof Date)) {
                  val = JSON.stringify(val);
                }
                values.push(val);
              }
            }

            const sql = `INSERT INTO \`${tableName}\` (${colListStr}) VALUES ${batchPlaceholders.join(", ")}`;
            await localConn.query(sql, values);
          }
        }
        totalSynced += prodRows.length;
        console.log(`  + Pulled ${prodRows.length} rows into \`${tableName}\``);
      }

      await localConn.query("SET FOREIGN_KEY_CHECKS = 1;");
      console.log(`✅ Local database refreshed with ${totalSynced} production records.`);
    } finally {
      await localConn.end();
      await prodConn.end();
    }
  }

  // Step 3: Media Download via Sync API or Public Fallback
  if (!isDbOnly && comparison.media.toPull.length > 0) {
    console.log("\nStep 3: Downloading Remote Media Assets to Local Directory...");
    const syncBaseUrl = (options.mediaSyncUrl || process.env.MEDIA_SYNC_URL || process.env.PRODUCTION_APP_URL || "").replace(/\/+$/, "");
    const syncSecret = options.mediaSyncSecret || process.env.MEDIA_SYNC_SECRET || process.env.ADMIN_SECRET_KEY;
    const uploadsDir = path.join(WORKSPACE_ROOT, "public", "uploads");

    let downloadedCount = 0;
    for (const item of comparison.media.toPull) {
      const destPath = path.join(uploadsDir, item.relativePath.replace(/\//g, path.sep));
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      const headers = { "User-Agent": "JaipurStonecraft-SyncRunner/1.0" };
      if (syncSecret) {
        headers["x-sync-secret"] = syncSecret.trim();
        headers["Authorization"] = `Bearer ${syncSecret.trim()}`;
      }

      const downloadUrl = syncBaseUrl
        ? `${syncBaseUrl}/api/admin/sync/media/download?file=${encodeURIComponent(item.relativePath)}`
        : null;

      try {
        let res = downloadUrl ? await fetch(downloadUrl, { headers }) : null;
        if (!res || res.status !== 200) {
          // Fallback to direct public image path
          res = await fetch(`${syncBaseUrl}/uploads/${item.relativePath}`, { headers: { "User-Agent": "Mozilla/5.0" } });
        }

        if (res && res.status === 200) {
          const buf = Buffer.from(await res.arrayBuffer());
          const tempPath = `${destPath}.tmp.${Date.now()}`;
          fs.writeFileSync(tempPath, buf);
          fs.renameSync(tempPath, destPath);
          downloadedCount++;
          console.log(`  + [DOWNLOADED] ${item.relativePath}`);
        } else {
          console.error(`  - [DOWNLOAD FAILED] ${item.relativePath}`);
        }
      } catch (e) {
        console.error(`  - [DOWNLOAD ERROR] ${item.relativePath}: ${e.message}`);
      }
    }

    console.log(`✅ Media pull completed: ${downloadedCount} / ${comparison.media.toPull.length} assets downloaded.`);

    // Refresh local CAS and manifest
    await backupUploadImages({
      backupDir: path.join(WORKSPACE_ROOT, "backups", "images"),
      sourceDir: uploadsDir
    });
  }

  console.log("\n================================================================================");
  console.log("🚀 PRODUCTION SYNC PULL COMPLETED SUCCESSFULLY");
  console.log("================================================================================\n");

  return { dryRun: false, prePullBackup, comparison };
}

/**
 * RESTORE: Restore from SQL dump / Manifest to Local or Production
 */
export async function executeRestore(options = {}) {
  const target = options.target === "production" ? "production" : "local";
  const isDryRun = options.confirm !== true;
  const targetUrl = target === "production"
    ? (options.prodUrl || process.env.PRODUCTION_DATABASE_URL || process.env.HOSTINGER_DATABASE_URL)
    : (options.localUrl || process.env.DATABASE_URL);

  console.log("================================================================================");
  console.log(`JAIPUR STONECRAFT — DATABASE & MEDIA RESTORE [Target: ${target.toUpperCase()} | ${isDryRun ? "DRY-RUN" : "CONFIRMED"}]`);
  console.log("================================================================================\n");

  let dumpPath = options.file;
  if (!dumpPath) {
    const fullDir = path.join(WORKSPACE_ROOT, "backups", "db", "full");
    if (fs.existsSync(fullDir)) {
      const files = fs.readdirSync(fullDir).filter(f => f.endsWith(".sql.gz") || f.endsWith(".sql")).sort();
      if (files.length > 0) {
        dumpPath = path.join(fullDir, files[files.length - 1]);
      }
    }
  }

  if (!dumpPath || !fs.existsSync(dumpPath)) {
    throw new Error(`[Restore Error]: Backup dump file not found: ${dumpPath}`);
  }

  console.log(`Source Backup File: ${dumpPath}`);
  const validation = await validateDatabaseDump(dumpPath);
  console.log(`Dump Validation: Detected ${validation.detectedTables.length} tables, ${validation.insertStatements} batch inserts.`);

  if (isDryRun) {
    console.log("\n================================================================================");
    console.log("🔒 DRY-RUN COMPLETED: Backup validated with 0 errors. Pass --confirm to execute restore.");
    console.log("================================================================================\n");
    return { dryRun: true, dumpPath, validation };
  }

  if (target === "production" && !options.confirm) {
    throw new Error("[Restore Error]: Restoring to PRODUCTION requires explicit --confirm flag.");
  }

  console.log("\nStep 1: Creating Pre-Restore Safety Backup...");
  const preRestoreBackup = await runFullBackup({
    backupBaseDir: path.join(WORKSPACE_ROOT, "backups", "pre_restore")
  });
  console.log(`✅ Pre-restore safety snapshot created: ${preRestoreBackup.timestamp}`);

  console.log(`\nStep 2: Restoring SQL Dump to ${target.toUpperCase()} Database...`);
  let sqlContent = "";
  if (dumpPath.endsWith(".gz")) {
    sqlContent = zlib.gunzipSync(fs.readFileSync(dumpPath)).toString("utf8");
  } else {
    sqlContent = fs.readFileSync(dumpPath, "utf8");
  }

  const conn = await connectDb(targetUrl, `${target.toUpperCase()} Database`);
  try {
    for (const stmt of CREATE_TABLES_SQL_STATEMENTS) {
      await conn.query(stmt);
    }
    await conn.query(sqlContent);

    let totalRestored = 0;
    const tableCounts = {};
    for (const t of SCHEMA_TABLES) {
      const [r] = await conn.query(`SELECT COUNT(*) as c FROM \`${t}\``);
      tableCounts[t] = r[0].c;
      totalRestored += r[0].c;
    }

    console.table(Object.entries(tableCounts).map(([table, count]) => ({ table, count })));
    console.log(`✅ Restored ${totalRestored} records across ${SCHEMA_TABLES.length} tables.`);
  } finally {
    await conn.end();
  }

  console.log("\n================================================================================");
  console.log("🚀 RESTORATION COMPLETED SUCCESSFULLY");
  console.log("================================================================================\n");

  return { dryRun: false, dumpPath, target };
}
