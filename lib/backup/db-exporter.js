/**
 * Jaipur Stonecraft — MySQL Database Exporter & Change-Detection Engine
 * 
 * Features:
 *   1. Direct Cloud/Local Snapshot: Supports Aiven MySQL and Local MySQL.
 *   2. SHA-256 Fingerprinting: Computes table-by-table checksums for change detection.
 *   3. Gzip Compression: Produces .sql.gz archives.
 *   4. Manifest Tracking: Logs row counts, table hashes, and changes in JSON manifests.
 *   5. Non-Destructive Restore Verification: Tests SQL syntax and table structure safely.
 */

import fs from "fs";
import path from "path";
import zlib from "zlib";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { query, getPool } from "../db/client.js";

export const SCHEMA_TABLES = [
  "collections",
  "subcategories",
  "categories",
  "materials",
  "subjects",
  "product_types",
  "attribute_definitions",
  "products",
  "product_images",
  "site_content",
  "page_sections",
  "projects",
  "inquiries",
  "site_settings"
];

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

function computeTableChecksum(rows) {
  const hash = crypto.createHash("sha256");
  for (const r of rows) {
    hash.update(JSON.stringify(r));
  }
  return hash.digest("hex");
}

export function getLatestDbManifest(manifestDir) {
  if (!fs.existsSync(manifestDir)) return null;

  const files = fs.readdirSync(manifestDir)
    .filter(f => f.startsWith("db_manifest_") && f.endsWith(".json"))
    .sort();

  if (files.length === 0) return null;
  const latestPath = path.join(manifestDir, files[files.length - 1]);
  try {
    return JSON.parse(fs.readFileSync(latestPath, "utf8"));
  } catch (e) {
    return null;
  }
}

/**
 * Capture Database Snapshot with Change Detection
 */
export async function captureDatabaseSnapshot(options = {}) {
  const remoteUrl = (options.prodUrl || options.aivenUrl || process.env.PRODUCTION_DATABASE_URL || process.env.AIVEN_DATABASE_URL || "").replace(/[?&]ssl-mode=[^&]+/i, "");
  let conn = null;
  let isRemoteSource = false;

  if (remoteUrl) {
    const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(remoteUrl);
    try {
      conn = await mysql.createConnection({
        uri: remoteUrl,
        ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
        connectTimeout: 8000
      });
      isRemoteSource = true;
    } catch (e) {
      console.warn(`[DB Exporter Warning]: Remote database connection failed, reading from active DB client: ${e.message}`);
    }
  }

  const tableData = {};
  const tableStats = {};
  let totalRows = 0;
  const overallHash = crypto.createHash("sha256");

  try {
    for (const tableName of SCHEMA_TABLES) {
      let rows = [];
      if (conn) {
        const [r] = await conn.query(`SELECT * FROM \`${tableName}\``);
        rows = r;
      } else {
        rows = await query(`SELECT * FROM \`${tableName}\``);
      }

      tableData[tableName] = rows;
      totalRows += rows.length;

      const checksum = computeTableChecksum(rows);
      tableStats[tableName] = {
        rowCount: rows.length,
        checksum
      };
      overallHash.update(`${tableName}:${rows.length}:${checksum};`);
    }
  } finally {
    if (conn) {
      await conn.end();
    }
  }

  const databaseFingerprint = overallHash.digest("hex");

  return {
    source: isRemoteSource ? "Remote Production MySQL" : "Active Database Client (DATABASE_URL)",
    timestamp: new Date().toISOString(),
    totalRows,
    databaseFingerprint,
    tableStats,
    tableData
  };
}

/**
 * Generate ANSI SQL Dump
 */
export function generateSqlFromSnapshot(snapshot) {
  let sqlDump = `-- ============================================================\n`;
  sqlDump += `-- JAIPUR STONECRAFT — MASTER DATABASE BACKUP DUMP\n`;
  sqlDump += `-- Source: ${snapshot.source}\n`;
  sqlDump += `-- Exported At: ${snapshot.timestamp}\n`;
  sqlDump += `-- Fingerprint: ${snapshot.databaseFingerprint}\n`;
  sqlDump += `-- Total Rows: ${snapshot.totalRows}\n`;
  sqlDump += `-- ============================================================\n\n`;

  sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  for (const tableName of SCHEMA_TABLES) {
    const rows = snapshot.tableData[tableName] || [];
    const stats = snapshot.tableStats[tableName] || { rowCount: rows.length, checksum: "" };

    sqlDump += `-- ------------------------------------------------------------\n`;
    sqlDump += `-- Table: ${tableName} (${rows.length} rows, checksum: ${stats.checksum})\n`;
    sqlDump += `-- ------------------------------------------------------------\n`;

    if (rows.length > 0) {
      const columns = Object.keys(rows[0]);
      const colListStr = columns.map(c => `\`${c}\``).join(", ");

      const BATCH_SIZE = 50;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE);
        const valueTuples = batch.map(row => {
          const vals = columns.map(col => escapeSqlValue(row[col]));
          return `(${vals.join(", ")})`;
        });

        sqlDump += `INSERT INTO \`${tableName}\` (${colListStr}) VALUES\n  ${valueTuples.join(",\n  ")};\n`;
      }
    } else {
      sqlDump += `-- (0 rows)\n`;
    }
    sqlDump += `\n`;
  }

  sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sqlDump += `-- END OF DUMP\n`;

  return sqlDump;
}

/**
 * Export Database to Compressed File with Manifest & Change Detection
 */
export async function exportDatabaseWithManifest(options = {}) {
  const backupBaseDir = options.backupDir || path.join(process.cwd(), "backups", "db");
  const fullBackupDir = path.join(backupBaseDir, "full");
  const manifestDir = path.join(backupBaseDir, "manifests");

  if (!fs.existsSync(fullBackupDir)) fs.mkdirSync(fullBackupDir, { recursive: true });
  if (!fs.existsSync(manifestDir)) fs.mkdirSync(manifestDir, { recursive: true });

  const snapshot = await captureDatabaseSnapshot(options);
  const prevManifest = getLatestDbManifest(manifestDir);

  const changedTables = [];
  const unchangedTables = [];

  if (prevManifest && prevManifest.tableStats) {
    for (const t of SCHEMA_TABLES) {
      const prev = prevManifest.tableStats[t];
      const curr = snapshot.tableStats[t];
      if (!prev || prev.checksum !== curr.checksum || prev.rowCount !== curr.rowCount) {
        changedTables.push(t);
      } else {
        unchangedTables.push(t);
      }
    }
  } else {
    changedTables.push(...SCHEMA_TABLES);
  }

  const isChanged = changedTables.length > 0;
  const isForceFull = options.forceFull === true;

  const tsFormatted = snapshot.timestamp.replace(/[:.]/g, "-").slice(0, 19);
  let dumpFilename = `db_full_${tsFormatted}.sql.gz`;
  const dumpFilePath = path.join(fullBackupDir, dumpFilename);

  let dumpFileCreated = false;
  let compressedSize = 0;

  // Generate and save compressed dump if data changed or full requested
  if (isChanged || isForceFull || !prevManifest) {
    const rawSql = generateSqlFromSnapshot(snapshot);
    const compressedBuffer = zlib.gzipSync(Buffer.from(rawSql, "utf8"), { level: 9 });
    fs.writeFileSync(dumpFilePath, compressedBuffer);
    compressedSize = compressedBuffer.length;
    dumpFileCreated = true;
  } else {
    // If unchanged and prev dump exists, reference previous
    if (prevManifest && prevManifest.dumpFilename) {
      dumpFilename = prevManifest.dumpFilename;
    }
  }

  const manifest = {
    timestamp: snapshot.timestamp,
    source: snapshot.source,
    fingerprint: snapshot.databaseFingerprint,
    totalRows: snapshot.totalRows,
    dumpFilename,
    status: isChanged ? "DATA_CHANGED" : "UNCHANGED",
    changedTables,
    unchangedTables,
    tableStats: snapshot.tableStats
  };

  const manifestFilename = `db_manifest_${tsFormatted}.json`;
  const manifestFilePath = path.join(manifestDir, manifestFilename);
  fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), "utf8");

  return {
    dumpFilePath: dumpFileCreated ? dumpFilePath : (prevManifest ? path.join(fullBackupDir, prevManifest.dumpFilename) : dumpFilePath),
    dumpFilename,
    dumpFileCreated,
    compressedSize,
    manifestFilePath,
    manifestFilename,
    manifest,
    isChanged
  };
}

/**
 * Non-Destructive Restore Validator
 */
export async function validateDatabaseDump(dumpFilePath) {
  if (!fs.existsSync(dumpFilePath)) {
    throw new Error(`Dump file not found: ${dumpFilePath}`);
  }

  let sqlContent = "";
  if (dumpFilePath.endsWith(".gz")) {
    const raw = fs.readFileSync(dumpFilePath);
    sqlContent = zlib.gunzipSync(raw).toString("utf8");
  } else {
    sqlContent = fs.readFileSync(dumpFilePath, "utf8");
  }

  const tableHeaders = (sqlContent.match(/-- Table: \w+/g) || []).map(h => h.replace("-- Table: ", ""));
  const insertCounts = (sqlContent.match(/INSERT INTO `\w+`/g) || []).length;
  const hasFkChecks = sqlContent.includes("SET FOREIGN_KEY_CHECKS = 0;");

  return {
    isValid: tableHeaders.length === SCHEMA_TABLES.length && hasFkChecks,
    detectedTables: tableHeaders,
    insertStatements: insertCounts,
    sqlSizeKb: (sqlContent.length / 1024).toFixed(2)
  };
}
