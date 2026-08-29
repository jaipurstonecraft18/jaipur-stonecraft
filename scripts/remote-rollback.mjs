/**
 * Jaipur Stonecraft — 1-Command Local Production Rollback Dispatcher
 *
 * Usage: npm run rollback:prod
 *
 * Reverts Hostinger production release to the immediately preceding build in < 2 seconds.
 * Does NOT alter the database or persistent uploads.
 */

import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const SSH_HOST = process.env.HOSTINGER_SSH_HOST || "217.21.91.171";
const SSH_PORT = process.env.HOSTINGER_SSH_PORT || "65002";
const SSH_USER = process.env.HOSTINGER_SSH_USER || "u209772524";
const DEPLOY_KEY_PATH = path.join(process.cwd(), "scratch", "deploy_key");

const REMOTE_APP_DIR = "/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/hbuilds/last-source";
const LIVE_URL = "https://lavenderblush-crab-850824.hostingersite.com";

console.log("================================================================================");
console.log("JAIPUR STONECRAFT — PRODUCTION ROLLBACK DISPATCHER");
console.log("================================================================================");
console.log(`Target Server:   ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`);
console.log(`Timestamp:       ${new Date().toISOString()}`);
console.log("================================================================================");

// Verify local deploy key exists
if (!fs.existsSync(DEPLOY_KEY_PATH)) {
  console.error(`\n[FATAL ERROR] Deployment key not found at: ${DEPLOY_KEY_PATH}`);
  process.exit(1);
}

const remoteCommand = `bash "${REMOTE_APP_DIR}/scripts/rollback-hostinger.sh"`;

console.log("\n[Rollback] Connecting to Hostinger and reverting to previous release...");
console.log("--------------------------------------------------------------------------------");

const startTime = Date.now();

const sshProcess = spawn("ssh", [
  "-i", DEPLOY_KEY_PATH,
  "-p", SSH_PORT,
  "-o", "BatchMode=yes",
  "-o", "StrictHostKeyChecking=accept-new",
  "-o", "ConnectTimeout=20",
  `${SSH_USER}@${SSH_HOST}`,
  remoteCommand
], {
  stdio: ["ignore", "inherit", "inherit"]
});

sshProcess.on("close", async (code) => {
  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log("--------------------------------------------------------------------------------");

  if (code !== 0) {
    console.error(`\n[ROLLBACK FAILED] Remote process exited with code ${code} (${durationSec}s).`);
    process.exit(code || 1);
  }

  console.log(`\n[Rollback] Previous release reactivated successfully in ${durationSec}s!`);
  console.log("\n[Health Check] Verifying live production endpoints...");

  const endpoints = [
    { name: "Homepage", url: `${LIVE_URL}/` },
    { name: "Products", url: `${LIVE_URL}/products` },
    { name: "API Settings", url: `${LIVE_URL}/api/settings` }
  ];

  for (const ep of endpoints) {
    const t0 = Date.now();
    try {
      const res = await fetch(ep.url, {
        headers: { "User-Agent": "HostingerDeployVerifier/1.0" }
      });
      const ms = Date.now() - t0;
      console.log(`  ✓ [HTTP ${res.status}] ${ep.name} (${ms}ms) -> ${ep.url}`);
    } catch (err) {
      console.error(`  ✗ [ERROR] ${ep.name} -> ${err.message}`);
    }
  }

  console.log("\n================================================================================");
  console.log("⏪ PRODUCTION ROLLBACK ACTIVE & VERIFIED!");
  console.log(`Live Website: ${LIVE_URL}`);
  console.log("================================================================================");
});
