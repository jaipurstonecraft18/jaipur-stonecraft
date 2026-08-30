/**
 * Jaipur Stonecraft — 1-Command Local Production Deployment Runner
 *
 * Usage: npm run deploy:prod
 *
 * GUARANTEES:
 * 1. Uses verified local SSH key authentication to Hostinger (Port 65002).
 * 2. Deploys the exact committed & pushed Git revision to production.
 * 3. Zero database modifications, zero table drops, zero data sync.
 * 4. 100% media persistence (public/uploads preserved via hbuilds/shared/uploads).
 * 5. Atomic zero-downtime release switchover on Hostinger.
 * 6. Automated live health check verification upon completion.
 */

import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";

const SSH_HOST = process.env.HOSTINGER_SSH_HOST || "217.21.91.171";
const SSH_PORT = process.env.HOSTINGER_SSH_PORT || "65002";
const SSH_USER = process.env.HOSTINGER_SSH_USER || "u209772524";
const DEPLOY_KEY_PATH = path.join(process.cwd(), "scratch", "deploy_key");

const REMOTE_APP_DIR = "/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/hbuilds/last-source";
const LIVE_URL = "https://lavenderblush-crab-850824.hostingersite.com";

console.log("================================================================================");
console.log("JAIPUR STONECRAFT — PRODUCTION DEPLOYMENT DISPATCHER");
console.log("================================================================================");
console.log(`Target Server:   ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`);
console.log(`Timestamp:       ${new Date().toISOString()}`);
console.log("================================================================================");

// Step 1: Resolve deploy key
let deployKeyPath = process.env.DEPLOY_KEY_PATH;

if (!deployKeyPath || !fs.existsSync(deployKeyPath)) {
  const localRepoKey = path.join(process.cwd(), "scratch", "deploy_key");
  const fallbackKey = "D:\\jsc\\jsc web1\\scratch\\deploy_key";

  if (fs.existsSync(localRepoKey)) {
    deployKeyPath = localRepoKey;
  } else if (fs.existsSync(fallbackKey)) {
    deployKeyPath = fallbackKey;
  } else if (process.env.HOSTINGER_SSH_KEY) {
    const tempKeyDir = path.join(process.cwd(), ".tmp_deploy");
    if (!fs.existsSync(tempKeyDir)) fs.mkdirSync(tempKeyDir, { recursive: true });
    deployKeyPath = path.join(tempKeyDir, "id_ed25519");
    fs.writeFileSync(deployKeyPath, process.env.HOSTINGER_SSH_KEY.replace(/\r\n/g, "\n"), { mode: 0o600 });
  }
}

if (!deployKeyPath || !fs.existsSync(deployKeyPath)) {
  console.error(`\n[FATAL ERROR] Deployment key not found.`);
  console.error("Please ensure the dedicated deploy key is present or set HOSTINGER_SSH_KEY / DEPLOY_KEY_PATH.");
  process.exit(1);
}

// Step 2: Inspect local Git state & determine target commit
let localBranch = "";
let localHead = "";
let originMain = "";
let hasUncommitted = false;

try {
  localBranch = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
  localHead = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
  
  const statusOutput = execSync("git status --porcelain", { encoding: "utf-8" }).trim();
  hasUncommitted = statusOutput.length > 0;

  try {
    originMain = execSync("git rev-parse origin/main", { encoding: "utf-8" }).trim();
  } catch {
    originMain = localHead;
  }
} catch (err) {
  // If in CI detached HEAD environment, fall back to environment variable
  localHead = process.env.TARGET_COMMIT || process.env.GITHUB_SHA || "";
  originMain = localHead;
}

const targetCommit = process.env.TARGET_COMMIT || process.env.GITHUB_SHA || localHead;
const shortHead = targetCommit.substring(0, 7);
console.log(`Target Commit:   ${shortHead} (${targetCommit})`);
if (localBranch) console.log(`Local Branch:    ${localBranch}`);

if (hasUncommitted && !process.env.GITHUB_ACTIONS) {
  console.warn("\n[WARNING] You have uncommitted changes in your local workspace.");
  console.warn("Only committed and pushed changes will be deployed to Hostinger production.\n");
}

// Step 3: Construct remote execution command
const remoteCommand = [
  `cd "${REMOTE_APP_DIR}"`,
  `git fetch origin main --tags`,
  `git reset --hard "${targetCommit}"`,
  `bash scripts/deploy-hostinger.sh "${targetCommit}"`
].join(" && ");

console.log(`\n[Step 1/2] Connecting to Hostinger and executing deployment for commit ${shortHead}...`);
console.log("--------------------------------------------------------------------------------");

const startTime = Date.now();

const sshProcess = spawn("ssh", [
  "-i", deployKeyPath,
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
    console.error(`\n[DEPLOYMENT FAILED] Remote process exited with code ${code} (${durationSec}s).`);
    console.error("The previous working release on Hostinger remains active and untouched.");
    process.exit(code || 1);
  }

  console.log(`\n[Step 2/2] Remote build & release switch completed successfully in ${durationSec}s!`);
  console.log("\n[Health Check] Verifying live production endpoints...");

  const endpoints = [
    { name: "Homepage", url: `${LIVE_URL}/` },
    { name: "Products", url: `${LIVE_URL}/products` },
    { name: "API Settings", url: `${LIVE_URL}/api/settings` },
    { name: "Media Asset", url: `${LIVE_URL}/uploads/categories/card/cms-image-1787848523473-0tg7z.webp` }
  ];

  let allPassed = true;
  for (const ep of endpoints) {
    const t0 = Date.now();
    try {
      const res = await fetch(ep.url, {
        headers: { "User-Agent": "HostingerDeployVerifier/1.0" }
      });
      const ms = Date.now() - t0;
      if (res.ok) {
        console.log(`  ✓ [HTTP ${res.status}] ${ep.name} (${ms}ms) -> ${ep.url}`);
      } else {
        console.warn(`  ⚠ [HTTP ${res.status}] ${ep.name} (${ms}ms) -> ${ep.url}`);
        allPassed = false;
      }
    } catch (err) {
      console.error(`  ✗ [ERROR] ${ep.name} -> ${err.message}`);
      allPassed = false;
    }
  }

  console.log("\n================================================================================");
  if (allPassed) {
    console.log("🚀 PRODUCTION DEPLOYMENT ACTIVE & VERIFIED HEALTHY!");
    console.log(`Deployed Commit: ${shortHead} (${localHead})`);
    console.log(`Live Website:    ${LIVE_URL}`);
  } else {
    console.warn("⚠️ Deployment completed with warning: one or more health check probes returned non-200.");
  }
  console.log("================================================================================");
});
