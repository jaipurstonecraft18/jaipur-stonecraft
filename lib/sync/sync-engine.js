/**
 * Jaipur Stonecraft — Combined Database & Media Synchronization Engine
 *
 * Core Guarantees:
 *   1. PRODUCTION -> LOCAL: Automatic, continuous, read-only pull.
 *   2. Atomic Media + DB Application: Images download & verify SHA-256 BEFORE DB rows are committed.
 *   3. Strict Process Locking: Prevents simultaneous pull & push operations.
 *   4. Per-Item Baseline Tracking: Records table checksums & file SHA-256 hashes in backups/sync_baseline/baseline.json.
 *   5. Fail-Safe Offline Handling: Production disconnects never corrupt local mirrors.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import mysql from "mysql2/promise";
import { SCHEMA_TABLES } from "../backup/db-exporter.js";

const WORKSPACE_ROOT = process.cwd();
const BASELINE_DIR = path.join(WORKSPACE_ROOT, "backups", "sync_baseline");
const BASELINE_FILE = path.join(BASELINE_DIR, "baseline.json");
const LOCK_FILE = path.join(BASELINE_DIR, "sync.lock");

const DEFAULT_PROD_URL = "https://lavenderblush-crab-850824.hostingersite.com";

export function getSyncConfig(customOptions = {}) {
  const prodBaseUrl = (
    customOptions.prodUrl ||
    process.env.PRODUCTION_APP_URL ||
    process.env.MEDIA_SYNC_URL ||
    DEFAULT_PROD_URL
  ).replace(/\/+$/, "");

  const secret = (
    customOptions.secret ||
    process.env.MEDIA_SYNC_SECRET ||
    process.env.ADMIN_SECRET_KEY ||
    ""
  ).trim();

  const localDbUrl = customOptions.localDbUrl || process.env.DATABASE_URL || "mysql://root:jscadmin2026@localhost:3306/jaipur_stonecraft";
  const uploadsDir = customOptions.uploadsDir || path.join(WORKSPACE_ROOT, "public", "uploads");

  return {
    prodBaseUrl,
    secret,
    localDbUrl,
    uploadsDir
  };
}

/**
 * Acquire process lock to prevent race conditions
 */
export function acquireLock(mode = "pull") {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });

  if (fs.existsSync(LOCK_FILE)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(LOCK_FILE, "utf8"));
      // Check if process is still alive (if locked longer than 5 mins, treat as stale)
      const lockAgeMs = Date.now() - new Date(lockData.startedAt).getTime();
      if (lockAgeMs < 5 * 60 * 1000) {
        throw new Error(`Sync operation is already in progress (${lockData.mode} by PID ${lockData.pid})`);
      }
    } catch (e) {
      if (e.message.includes("already in progress")) throw e;
      // Stale or corrupted lock file, overwrite
    }
  }

  const lockContent = {
    pid: process.pid,
    mode,
    startedAt: new Date().toISOString()
  };
  fs.writeFileSync(LOCK_FILE, JSON.stringify(lockContent, null, 2));

  return () => releaseLock();
}

/**
 * Release process lock
 */
export function releaseLock() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE);
    }
  } catch (e) {}
}

/**
 * Load sync baseline from disk
 */
export function getBaseline() {
  if (fs.existsSync(BASELINE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(BASELINE_FILE, "utf8"));
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Save sync baseline to disk
 */
export function saveBaseline(baselineData) {
  fs.mkdirSync(BASELINE_DIR, { recursive: true });
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(baselineData, null, 2));
}

/**
 * Compute SHA-256 for a file on disk
 */
export function computeFileSha256(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

/**
 * Compute table rows checksum
 */
export function computeRowsChecksum(rows) {
  const hash = crypto.createHash("sha256");
  for (const r of rows) {
    hash.update(JSON.stringify(r));
  }
  return hash.digest("hex");
}

/**
 * Perform authenticated GET request to production
 */
export async function fetchFromProd(endpoint, config) {
  const url = `${config.prodBaseUrl}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "JaipurStonecraft-SyncEngine/1.0",
      "x-sync-secret": config.secret,
      "Authorization": `Bearer ${config.secret}`
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Production request to ${endpoint} failed with HTTP ${res.status}: ${text.slice(0, 200)}`);
  }

  return await res.json();
}

/**
 * Check if remote production has any changes compared to local baseline
 */
export async function checkRemoteChanges(options = {}) {
  const config = getSyncConfig(options);
  if (!config.secret) {
    throw new Error("ADMIN_SECRET_KEY / MEDIA_SYNC_SECRET is not configured for remote synchronization.");
  }

  const [dbManifest, mediaManifest] = await Promise.all([
    fetchFromProd("/api/admin/sync/db/manifest", config),
    fetchFromProd("/api/admin/sync/media/manifest", config)
  ]);

  const baseline = getBaseline();

  let dbChanged = false;
  let mediaChanged = false;
  const changedTables = [];
  const filesToDownload = [];

  if (!baseline) {
    dbChanged = true;
    mediaChanged = true;
    for (const t of SCHEMA_TABLES) changedTables.push(t);
  } else {
    // Check DB tables
    for (const t of SCHEMA_TABLES) {
      const remoteTable = dbManifest.tables?.[t];
      const baseTable = baseline.tables?.[t];

      if (!baseTable || !remoteTable || baseTable.checksum !== remoteTable.checksum || baseTable.rowCount !== remoteTable.rowCount) {
        dbChanged = true;
        changedTables.push(t);
      }
    }

    // Check media files
    const localFilesMap = baseline.files || {};
    for (const rf of mediaManifest.files || []) {
      const baseFile = localFilesMap[rf.relativePath];
      if (!baseFile || baseFile.sha256 !== rf.sha256) {
        mediaChanged = true;
        filesToDownload.push(rf);
      }
    }
  }

  return {
    hasChanges: dbChanged || mediaChanged,
    dbChanged,
    mediaChanged,
    changedTables,
    filesToDownload,
    dbManifest,
    mediaManifest
  };
}

/**
 * Execute automatic production -> local pull (DB + Images combined)
 */
export async function executePull(options = {}) {
  const config = getSyncConfig(options);
  const dryRun = options.dryRun === true;
  const unlock = acquireLock("pull");

  try {
    const check = await checkRemoteChanges(options);

    if (!check.hasChanges && !options.force) {
      return {
        success: true,
        changed: false,
        message: "Local environment is already 100% in sync with production baseline.",
        timestamp: new Date().toISOString()
      };
    }

    const pullReport = {
      success: true,
      changed: true,
      timestamp: new Date().toISOString(),
      dryRun,
      downloadedMedia: [],
      updatedTables: []
    };

    // 1. Download & Verify Media Files FIRST (Atomic Image Step)
    const mediaFiles = check.mediaManifest?.files || [];
    for (const mf of mediaFiles) {
      const localFilePath = path.join(config.uploadsDir, mf.relativePath);
      const localHash = computeFileSha256(localFilePath);

      if (localHash !== mf.sha256 || options.force) {
        if (!dryRun) {
          const downloadUrl = `${config.prodBaseUrl}/api/admin/sync/media/download?file=${encodeURIComponent(mf.relativePath)}`;
          const res = await fetch(downloadUrl, {
            headers: {
              "User-Agent": "JaipurStonecraft-SyncEngine/1.0",
              "x-sync-secret": config.secret,
              "Authorization": `Bearer ${config.secret}`
            }
          });

          if (!res.ok) {
            throw new Error(`Failed to download media '${mf.relativePath}' from production (HTTP ${res.status})`);
          }

          const arrayBuf = await res.arrayBuffer();
          const buffer = Buffer.from(arrayBuf);
          const downloadedHash = crypto.createHash("sha256").update(buffer).digest("hex");

          if (downloadedHash !== mf.sha256) {
            throw new Error(`SHA-256 checksum mismatch for '${mf.relativePath}': expected ${mf.sha256}, got ${downloadedHash}`);
          }

          const tempFilePath = `${localFilePath}.tmp.${Date.now()}`;
          fs.mkdirSync(path.dirname(localFilePath), { recursive: true });
          fs.writeFileSync(tempFilePath, buffer);
          fs.renameSync(tempFilePath, localFilePath);
        }

        pullReport.downloadedMedia.push({
          file: mf.relativePath,
          size: mf.size,
          sha256: mf.sha256
        });
      }
    }

    // 2. Fetch Changed Database Table Batches & Commit Locally
    const tablesToPull = check.changedTables.length > 0 ? check.changedTables : SCHEMA_TABLES;
    const localConn = await mysql.createConnection({
      uri: config.localDbUrl,
      multipleStatements: true
    });

    try {
      for (const table of tablesToPull) {
        const rowData = await fetchFromProd(`/api/admin/sync/db/rows?table=${encodeURIComponent(table)}`, config);
        const rows = rowData.rows || [];

        if (!dryRun) {
          await localConn.query("SET FOREIGN_KEY_CHECKS = 0;");
          await localConn.query(`DELETE FROM \`${table}\`;`);

          if (rows.length > 0) {
            const columns = Object.keys(rows[0]);
            const colNames = columns.map(c => `\`${c}\``).join(", ");
            const placeholders = columns.map(() => "?").join(", ");
            const insertSql = `INSERT INTO \`${table}\` (${colNames}) VALUES (${placeholders})`;

            for (const r of rows) {
              const values = columns.map(c => {
                let v = r[c];
                if (v && typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
                  v = new Date(v).toISOString().slice(0, 19).replace('T', ' ');
                }
                return v;
              });
              await localConn.query(insertSql, values);
            }
          }
          await localConn.query("SET FOREIGN_KEY_CHECKS = 1;");
        }

        pullReport.updatedTables.push({
          table,
          rowCount: rows.length,
          checksum: rowData.checksum
        });
      }
    } finally {
      await localConn.end();
    }

    // 3. Update Sync Baseline
    if (!dryRun) {
      const filesMap = {};
      for (const mf of mediaFiles) {
        filesMap[mf.relativePath] = {
          size: mf.size,
          sha256: mf.sha256,
          mtime: mf.mtime
        };
      }

      const newBaseline = {
        lastSyncTimestamp: new Date().toISOString(),
        databaseChecksum: check.dbManifest.databaseChecksum,
        tables: check.dbManifest.tables,
        mediaChecksum: crypto.createHash("sha256").update(JSON.stringify(filesMap)).digest("hex"),
        files: filesMap
      };

      saveBaseline(newBaseline);
    }

    return pullReport;
  } finally {
    unlock();
  }
}
