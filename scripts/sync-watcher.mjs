/**
 * Jaipur Stonecraft — Continuous Production -> Local Sync Watcher (Phase 1)
 *
 * Runs locally to monitor production for database and image changes.
 * Automatically pulls, verifies, and applies updates in real-time.
 *
 * Usage:
 *   node --env-file=.env scripts/sync-watcher.mjs
 *   npm run sync:watch
 */

import { executePull, checkRemoteChanges, getSyncConfig } from "../lib/sync/sync-engine.js";

const POLL_INTERVAL_MS = parseInt(process.env.SYNC_POLL_INTERVAL_MS || "8000", 10);

let isRunning = false;
let isStopping = false;

function log(msg, ...args) {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.log(`[${time}] [Sync Watcher]`, msg, ...args);
}

function logError(msg, ...args) {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  console.error(`[${time}] [Sync Watcher Error]`, msg, ...args);
}

async function pollOnce() {
  if (isRunning || isStopping) return;
  isRunning = true;

  try {
    const check = await checkRemoteChanges();

    if (check.hasChanges) {
      log(`⚡ Production change detected! (DB Changed: ${check.dbChanged}, Media Changed: ${check.mediaChanged})`);
      if (check.changedTables.length > 0) {
        log(`   Changed Tables: ${check.changedTables.join(", ")}`);
      }
      if (check.filesToDownload.length > 0) {
        log(`   New/Updated Media: ${check.filesToDownload.length} file(s)`);
      }

      log("   ⬇️ Executing atomic combined pull...");
      const result = await executePull();

      if (result.success) {
        log(`✅ Pull applied successfully!`);
        if (result.downloadedMedia.length > 0) {
          log(`   Downloaded ${result.downloadedMedia.length} media file(s)`);
        }
        if (result.updatedTables.length > 0) {
          log(`   Updated ${result.updatedTables.length} schema table(s)`);
        }
      }
    }
  } catch (error) {
    if (error.message.includes("is already in progress")) {
      // Another sync process is running, skip quietly
    } else {
      logError(`Polling warning: ${error.message} (Will retry in ${Math.round(POLL_INTERVAL_MS / 1000)}s)`);
    }
  } finally {
    isRunning = false;
  }
}

async function main() {
  const config = getSyncConfig();
  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — AUTOMATIC PRODUCTION -> LOCAL SYNC WATCHER");
  console.log("================================================================================");
  console.log(`Target Production URL: ${config.prodBaseUrl}`);
  console.log(`Polling Interval:      ${Math.round(POLL_INTERVAL_MS / 1000)}s`);
  console.log(`Local Database:        ${config.localDbUrl.replace(/:[^:@]+@/, ":***@")}`);
  console.log(`Local Uploads Dir:     ${config.uploadsDir}`);
  console.log("--------------------------------------------------------------------------------");
  console.log("Watcher is active and listening for remote production mutations...\n");

  // Initial sync check on startup
  await pollOnce();

  // Recurring polling timer
  const interval = setInterval(async () => {
    await pollOnce();
  }, POLL_INTERVAL_MS);

  const cleanup = () => {
    isStopping = true;
    clearInterval(interval);
    log("Watcher stopped cleanly.");
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

main().catch(err => {
  console.error("Fatal Watcher Error:", err);
  process.exit(1);
});
