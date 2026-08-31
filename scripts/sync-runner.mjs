/**
 * Jaipur Stonecraft — Master Offline <-> Production Synchronization CLI Runner
 *
 * Usage:
 *   npm run sync:status                       # Real-time environment comparison
 *   npm run sync:pull                         # Run pull from production to local
 *   npm run sync:push                         # Run manual push (with pre-push conflict check)
 *   npm run sync:push -- --dry-run            # Dry-run push without mutating production
 */

import { executePull, executePush, checkRemoteChanges, getBaseline, getSyncConfig } from "../lib/sync/sync-engine.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || "status";

  return {
    command,
    confirm: args.includes("--confirm"),
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force")
  };
}

async function main() {
  const options = parseArgs();
  const config = getSyncConfig();

  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — COMBINED DB & MEDIA SYNCHRONIZATION SYSTEM");
  console.log("================================================================================");
  console.log(`Target Production URL: ${config.prodBaseUrl}`);
  console.log(`Local Database:        ${config.localDbUrl.replace(/:[^:@]+@/, ":***@")}`);
  console.log(`Command:               ${options.command.toUpperCase()} (Dry-Run: ${options.dryRun})`);
  console.log("================================================================================\n");

  switch (options.command) {
    case "status":
    case "verify": {
      const check = await checkRemoteChanges();
      const baseline = getBaseline();

      console.log("--- 1. Baseline Status ---");
      console.log(`Last Baseline Timestamp: ${baseline?.lastSyncTimestamp || "None (Initial sync required)"}`);
      console.log(`Database Baseline Hash:  ${baseline?.databaseChecksum?.substring(0, 12) || "N/A"}`);
      console.log(`Media Files Tracked:     ${Object.keys(baseline?.files || {}).length}`);

      console.log("\n--- 2. Remote Production Status ---");
      console.log(`Remote DB Changed:       ${check.dbChanged ? "⚠️ YES (New updates on production)" : "✅ NO (Matches baseline)"}`);
      console.log(`Remote Media Changed:    ${check.mediaChanged ? "⚠️ YES (New uploads on production)" : "✅ NO (Matches baseline)"}`);

      if (check.changedTables.length > 0) {
        console.log(`Changed Remote Tables:   ${check.changedTables.join(", ")}`);
      }
      if (check.filesToDownload.length > 0) {
        console.log(`Media Files to Pull:     ${check.filesToDownload.length}`);
      }

      console.log("\n================================================================================");
      if (!check.hasChanges) {
        console.log("🚀 STATUS: Local environment is 100% in sync with production!");
      } else {
        console.log("⚠️ STATUS: Production has newer updates. Watcher will pull or run 'npm run sync:pull'.");
      }
      console.log("================================================================================\n");
      break;
    }

    case "pull": {
      console.log("⬇️ Executing Production -> Local Pull...");
      const result = await executePull(options);
      if (result.changed) {
        console.log("\n✅ Pull completed successfully!");
        console.log(`Downloaded Media: ${result.downloadedMedia.length} file(s)`);
        console.log(`Updated Tables:   ${result.updatedTables.length} table(s)`);
      } else {
        console.log("\n" + result.message);
      }
      break;
    }

    case "push": {
      console.log("⬆️ Executing Manual Local -> Production Push with Conflict Preflight Check...\n");
      const result = await executePush(options);

      if (result.hasConflicts) {
        console.error("🛑 ============================================================================");
        console.error("🛑 THREE-WAY CONFLICT DETECTED: PUSH HALTED SAFELY");
        console.error("🛑 ============================================================================");
        console.error(`Total Conflicts: ${result.conflictsCount}\n`);

        for (let i = 0; i < result.conflicts.length; i++) {
          const c = result.conflicts[i];
          console.error(`--- Conflict #${i + 1} [${c.type.toUpperCase()}] ---`);
          if (c.type === "database") {
            console.error(`Table:       ${c.table}`);
            console.error(`Primary Key: ${c.primaryKey} = ${c.primaryKeyValue}`);
            console.error(`Reason:      ${c.reason}`);
            console.error("\n[Three-Way Row Comparison]:");
            console.error("1. Baseline State (at last sync):", JSON.stringify(c.local?.updated_at || "N/A"));
            console.error("2. Production NOW:                ", JSON.stringify(c.production));
            console.error("3. Local NOW:                     ", JSON.stringify(c.local));
          } else if (c.type === "media") {
            console.error(`File:           ${c.file}`);
            console.error(`Baseline SHA:   ${c.baselineSha256}`);
            console.error(`Production SHA: ${c.productionSha256}`);
            console.error(`Local SHA:      ${c.localSha256}`);
            console.error(`Reason:         ${c.reason}`);
          }
          console.error("--------------------------------------------------------------------------------\n");
        }

        console.error("ACTION REQUIRED: Resolve the conflicting items above manually before retrying.");
        console.error("Zero changes were written to production.\n");
        process.exit(1);
      } else if (result.changed === false) {
        console.log("ℹ️ " + result.message);
      } else {
        console.log("✅ ============================================================================");
        console.log("✅ PUSH COMPLETED SUCCESSFULLY!");
        console.log("✅ ============================================================================");
        console.log(`Uploaded Media Files:   ${result.uploadedMedia.length}`);
        console.log(`Committed DB Operations:${result.appliedDbOperations}`);
        console.log(`Timestamp:              ${result.timestamp}`);
        console.log("================================================================================\n");
      }
      break;
    }

    default:
      console.error(`Unknown command: "${options.command}". Available commands: status, pull, push.`);
      process.exit(1);
  }
}

main().catch(err => {
  console.error("\n❌ SYNCHRONIZATION ERROR:", err.message);
  process.exit(1);
});
