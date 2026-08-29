/**
 * Jaipur Stonecraft — Master Offline <-> Production Synchronization CLI Runner
 *
 * Usage:
 *   npm run sync:status                       # Real-time environment comparison
 *   npm run sync:verify                       # Real-time parity verification
 *   npm run sync:push                         # Dry-run push to production
 *   npm run sync:push -- --confirm            # Confirmed live push
 *   npm run sync:pull                         # Dry-run pull from production
 *   npm run sync:pull -- --confirm            # Confirmed live pull
 *   npm run restore                           # Dry-run restore
 *   npm run restore -- --confirm              # Confirmed live restore to local
 */

import { compareEnvironments, executeSyncPush, executeSyncPull, executeRestore } from "../lib/backup/sync-coordinator.js";

function parseArgs() {
  const args = process.argv.slice(2);
  const command = args[0] || "status";

  const options = {
    command,
    confirm: args.includes("--confirm"),
    dryRun: args.includes("--dry-run"),
    dbOnly: args.includes("--db-only"),
    mediaOnly: args.includes("--media-only"),
    force: args.includes("--force"),
    file: null,
    target: "local"
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--file=")) {
      options.file = args[i].split("=")[1];
    } else if (args[i] === "--file" && args[i + 1]) {
      options.file = args[++i];
    }
    if (args[i].startsWith("--target=")) {
      options.target = args[i].split("=")[1];
    } else if (args[i] === "--target" && args[i + 1]) {
      options.target = args[++i];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  switch (options.command) {
    case "status":
    case "verify": {
      console.log("================================================================================");
      console.log("JAIPUR STONECRAFT — ENVIRONMENT PARITY & SYNCHRONIZATION STATUS");
      console.log("================================================================================\n");

      const comparison = await compareEnvironments(options);

      console.log("--- 1. Database Parity (14 Tables) ---");
      console.table(comparison.db.tables);
      console.log(`Local Records: ${comparison.db.localTotalRows} | Prod Records: ${comparison.db.prodTotalRows}`);
      console.log(`Database Status: ${comparison.db.inSync ? "✅ IN SYNC (100% Matching)" : "⚠️ DRIFT DETECTED"}`);

      console.log("\n--- 2. Media Parity (public/uploads/) ---");
      console.log(`Local Files:      ${comparison.media.localCount}`);
      console.log(`Remote/Manifest:  ${comparison.media.remoteCount}`);
      console.log(`Identical:        ${comparison.media.identical.length}`);
      console.log(`To Upload (Push): ${comparison.media.toPush.length} (${(comparison.media.totalBytesToPush / 1024).toFixed(1)} KB)`);
      console.log(`To Download(Pull):${comparison.media.toPull.length} (${(comparison.media.totalBytesToPull / 1024).toFixed(1)} KB)`);
      console.log(`Media Status:     ${comparison.media.inSync ? "✅ IN SYNC (100% Matching)" : "⚠️ DELTA DETECTED"}`);

      console.log("\n================================================================================");
      console.log(`OVERALL STATUS: ${comparison.overallInSync ? "🚀 ENVIRONMENTS ARE 100% IN SYNC" : "⚠️ ACTION REQUIRED: Run sync:push or sync:pull"}`);
      console.log("================================================================================\n");
      break;
    }

    case "push": {
      await executeSyncPush(options);
      break;
    }

    case "pull": {
      await executeSyncPull(options);
      break;
    }

    case "restore": {
      await executeRestore(options);
      break;
    }

    default:
      console.error(`Unknown command: "${options.command}". Available commands: status, verify, push, pull, restore.`);
      process.exit(1);
  }
}

main().catch(err => {
  console.error("\n❌ SYNCHRONIZATION ERROR:", err.message);
  process.exit(1);
});
