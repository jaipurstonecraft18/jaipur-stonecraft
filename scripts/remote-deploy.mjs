/**
 * Jaipur Stonecraft — 1-Command Production Deployment Runner
 *
 * Usage:
 * - Local CLI: npm run deploy:prod
 * - CI/CD: Dispatched by GitHub Actions Self-Hosted Runner
 *
 * GUARANTEES:
 * 1. Resilient Credential Resolution:
 *    - Priority 1: GitHub Secret / Environment variable `HOSTINGER_SSH_KEY`
 *    - Priority 2: Custom path in `DEPLOY_KEY_PATH`
 *    - Priority 3: Local workspace fallback at `scratch/deploy_key`
 * 2. Automatic Secure Ephemeral Key Management:
 *    - Temporary keys in OS tmpdir are automatically wiped upon process completion.
 * 3. 100% Media & Database Safety:
 *    - Zero database migrations/writes.
 *    - Persistent uploads symlinked from `hbuilds/shared/uploads`.
 * 4. Atomic Release Switchover:
 *    - Zero downtime release activation and LiteSpeed Passenger worker reload.
 * 5. Automated Health Verification Probes.
 */

import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

const SSH_HOST = process.env.HOSTINGER_SSH_HOST || "217.21.91.171";
const SSH_PORT = process.env.HOSTINGER_SSH_PORT || "65002";
const SSH_USER = process.env.HOSTINGER_SSH_USER || "u209772524";

const REMOTE_APP_DIR = "/home/u209772524/domains/lavenderblush-crab-850824.hostingersite.com/hbuilds/last-source";
const LIVE_URL = "https://lavenderblush-crab-850824.hostingersite.com";

console.log("================================================================================");
console.log("JAIPUR STONECRAFT — PRODUCTION DEPLOYMENT DISPATCHER");
console.log("================================================================================");
console.log(`Target Server:   ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`);
console.log(`Timestamp:       ${new Date().toISOString()}`);
console.log("================================================================================");

// Step 1: Secure Credential Resolution
let deployKeyPath = "";
let isEphemeralKey = false;

if (process.env.HOSTINGER_SSH_KEY && process.env.HOSTINGER_SSH_KEY.trim().length > 0) {
  const randomSuffix = crypto.randomBytes(6).toString("hex");
  const tempKeyPath = path.join(os.tmpdir(), `jsc_deploy_key_${randomSuffix}`);
  const normalizedKey = process.env.HOSTINGER_SSH_KEY.replace(/\r\n/g, "\n").trim() + "\n";
  
  fs.writeFileSync(tempKeyPath, normalizedKey, { mode: 0o600 });
  deployKeyPath = tempKeyPath;
  isEphemeralKey = true;
  console.log("Credential Source: GitHub Secret (HOSTINGER_SSH_KEY, ephemeral)");
} else if (process.env.DEPLOY_KEY_PATH && fs.existsSync(process.env.DEPLOY_KEY_PATH)) {
  deployKeyPath = process.env.DEPLOY_KEY_PATH;
  console.log(`Credential Source: DEPLOY_KEY_PATH environment variable (${deployKeyPath})`);
} else {
  const localKey = path.join(process.cwd(), "scratch", "deploy_key");
  const fallbackKey = "D:\\jsc\\jsc web1\\scratch\\deploy_key";

  if (fs.existsSync(localKey)) {
    deployKeyPath = localKey;
    console.log("Credential Source: Local workspace key (scratch/deploy_key)");
  } else if (fs.existsSync(fallbackKey)) {
    deployKeyPath = fallbackKey;
    console.log(`Credential Source: Fallback workspace key (${fallbackKey})`);
  }
}

function cleanupEphemeralKey() {
  if (isEphemeralKey && deployKeyPath && fs.existsSync(deployKeyPath)) {
    try {
      fs.unlinkSync(deployKeyPath);
    } catch {
      // Ignore cleanup error
    }
  }
}

process.on("exit", cleanupEphemeralKey);
process.on("SIGINT", () => { cleanupEphemeralKey(); process.exit(130); });
process.on("SIGTERM", () => { cleanupEphemeralKey(); process.exit(143); });

if (!deployKeyPath || !fs.existsSync(deployKeyPath)) {
  console.error("\n[FATAL ERROR] Deployment private key could not be resolved.");
  console.error("Please ensure HOSTINGER_SSH_KEY secret is configured or scratch/deploy_key exists.");
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
} catch {
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
  cleanupEphemeralKey();
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
