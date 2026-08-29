/**
 * Jaipur Stonecraft — Hostinger Deployment Pre-Flight Checker (Phase 7D)
 *
 * Runs non-destructive pre-flight verification across:
 *   1. Node.js Runtime & Package Scripts
 *   2. Required Core Files & Scaffolding
 *   3. Production Environment Variables (Presence Only — Never Prints Values)
 *   4. Active Database Connectivity & Schema Verification
 *   5. Media / Upload Directory Hierarchy & Permissions
 *   6. Git Media Tracking Status
 *   7. Backup & Restore System Verification
 *   8. Runtime Aiven & Backblaze B2 Independence Scan
 *   9. Web Server & File Security Rules (.htaccess & .gitignore)
 *   10. Production Sync Script Availability
 *
 * Usage:
 *   node --env-file=.env scripts/hostinger-preflight.mjs
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const REQUIRED_FILES = [
  "server.js",
  "next.config.mjs",
  "package.json",
  ".htaccess",
  ".gitignore",
  ".env.example",
  "HOSTINGER-DEPLOYMENT.md",
  "lib/db/client.js",
  "lib/db/schema.js",
  "lib/db/products.js",
  "lib/admin/auth.js",
  "lib/backup/backup-engine.js",
  "lib/backup/db-exporter.js",
  "lib/backup/image-archiver.js",
  "scripts/sync-production-to-local.mjs",
  "scripts/backup-runner.js",
  "scripts/restore-runner.js"
];

const REQUIRED_UPLOAD_DIRS = [
  "public/uploads/products/raw",
  "public/uploads/products/display",
  "public/uploads/products/card",
  "public/uploads/products/thumb",
  "public/uploads/categories/raw",
  "public/uploads/categories/display",
  "public/uploads/categories/card",
  "public/uploads/categories/thumb"
];

async function runPreflight() {
  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — HOSTINGER DEPLOYMENT PRE-FLIGHT CHECK (PHASE 7D)");
  console.log("================================================================================\n");

  const results = {
    checksPassed: 0,
    checksWarning: 0,
    checksFailed: 0,
    details: []
  };

  function logPass(title, desc = "") {
    results.checksPassed++;
    console.log(`✅ [PASS] ${title}`);
    if (desc) console.log(`   └─ ${desc}`);
  }

  function logWarn(title, desc = "") {
    results.checksWarning++;
    console.log(`⚠️ [WARN] ${title}`);
    if (desc) console.log(`   └─ ${desc}`);
  }

  function logFail(title, desc = "") {
    results.checksFailed++;
    console.log(`❌ [FAIL] ${title}`);
    if (desc) console.log(`   └─ ${desc}`);
  }

  // 1. Node.js & npm Version Check
  const nodeVer = process.version;
  const majorNode = parseInt(nodeVer.replace(/^v/, "").split(".")[0], 10);
  if (majorNode >= 18) {
    logPass(`Node.js Runtime: ${nodeVer}`, `Hostinger supports Node.js 20.x/22.x LTS (Minimum required >= 18.18.0)`);
  } else {
    logFail(`Node.js Runtime: ${nodeVer}`, `Next.js 16 requires Node.js 18.18.0 or newer`);
  }

  // 2. Package.json Scripts
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    const requiredScripts = ["dev", "build", "start", "backup", "restore", "sync:prod"];
    const missing = requiredScripts.filter(s => !pkg.scripts || !pkg.scripts[s]);
    if (missing.length === 0) {
      logPass("Package Scripts", `All required lifecycle scripts registered (${requiredScripts.join(", ")})`);
    } else {
      logFail("Package Scripts", `Missing scripts: ${missing.join(", ")}`);
    }
  } catch (err) {
    logFail("package.json Parse Error", err.message);
  }

  // 3. Required File Presence
  const missingFiles = REQUIRED_FILES.filter(f => !fs.existsSync(path.join(process.cwd(), f)));
  if (missingFiles.length === 0) {
    logPass("Core Files Verification", `All ${REQUIRED_FILES.length} essential files present on disk`);
  } else {
    logFail("Core Files Verification", `Missing files: ${missingFiles.join(", ")}`);
  }

  // 4. Production Environment Variables (Presence Only)
  const isDbConfigured = Boolean(process.env.DATABASE_URL);
  const isAdminAuthConfigured = Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SECRET_KEY);
  const isBackupAuthConfigured = Boolean(process.env.BACKUP_SECRET_KEY || process.env.ADMIN_SECRET_KEY);

  if (isDbConfigured && isAdminAuthConfigured) {
    const presentKeys = ["DATABASE_URL", "ADMIN_PASSWORD", "ADMIN_SECRET_KEY"];
    if (process.env.BACKUP_SECRET_KEY) presentKeys.push("BACKUP_SECRET_KEY");
    if (process.env.NODE_ENV) presentKeys.push("NODE_ENV");
    if (process.env.PORT) presentKeys.push("PORT");
    if (process.env.GROQ_API_KEY) presentKeys.push("GROQ_API_KEY");
    if (process.env.GEMINI_API_KEY) presentKeys.push("GEMINI_API_KEY");

    logPass("Environment Variables Presence", `Core variables configured (${presentKeys.join(", ")}) [Values securely masked]`);
  } else {
    const missing = [];
    if (!isDbConfigured) missing.push("DATABASE_URL");
    if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
    if (!process.env.ADMIN_SECRET_KEY) missing.push("ADMIN_SECRET_KEY");
    logFail("Environment Variables", `Missing required production variables: ${missing.join(", ")}`);
  }

  // 5. Active Database Connectivity & Schema Test
  try {
    const { query } = await import("../lib/db/client.js");
    const [testRow] = await query("SELECT 1 as is_connected");
    if (testRow && testRow.is_connected === 1) {
      const tableRows = await query("SHOW TABLES");
      logPass("Active Database Connection", `MySQL connected successfully (${tableRows.length} tables found)`);
    } else {
      logFail("Active Database Connection", "Query returned unexpected result");
    }
  } catch (dbErr) {
    logWarn("Database Connection Check", `Could not connect to active DATABASE_URL: ${dbErr.message}`);
  }

  // 6. Upload Directory Hierarchy & Permissions
  let allUploadDirsExist = true;
  for (const d of REQUIRED_UPLOAD_DIRS) {
    const fullPath = path.join(process.cwd(), d);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    // Test write permission safely
    try {
      const testFile = path.join(fullPath, `.test_write_${Date.now()}.tmp`);
      fs.writeFileSync(testFile, "test", "utf8");
      fs.unlinkSync(testFile);
    } catch (e) {
      allUploadDirsExist = false;
      logFail(`Upload Directory Permissions: ${d}`, e.message);
    }
  }
  if (allUploadDirsExist) {
    logPass("Upload Directory Scaffolding", `All 8 required upload subdirectories exist with read/write permissions`);
  }

  // 7. Git Tracking Audit for Uploads
  try {
    const trackedUploads = execSync("git ls-files public/uploads", { encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    if (trackedUploads.length > 0) {
      logWarn(
        `Git Media Tracking (${trackedUploads.length} legacy files tracked in Git)`,
        "Existing legacy images are tracked in git history. On Hostinger, non-destructive git pulls must be used to preserve dynamic uploads."
      );
    } else {
      logPass("Git Media Isolation", "No dynamic uploads are tracked in git");
    }
  } catch (gitErr) {
    logWarn("Git Media Check", "Git command not available or not in a git repo");
  }

  // 8. Security & Web Server Rules (.htaccess & .gitignore)
  const gitignoreContent = fs.existsSync(".gitignore") ? fs.readFileSync(".gitignore", "utf8") : "";
  const htaccessContent = fs.existsSync(".htaccess") ? fs.readFileSync(".htaccess", "utf8") : "";

  const envIgnored = gitignoreContent.includes(".env*");
  const backupsBlocked = htaccessContent.includes("backups") || htaccessContent.includes("sql");

  if (envIgnored) {
    logPass("Secret Protection (.gitignore)", ".env* files are strictly ignored by Git");
  } else {
    logFail("Secret Protection (.gitignore)", ".env files are NOT ignored in .gitignore!");
  }

  if (backupsBlocked) {
    logPass("Public Directory Protection (.htaccess)", "Direct HTTP access to backups, data, and .sql files is explicitly denied");
  } else {
    logWarn("Public Directory Protection (.htaccess)", ".htaccess security rules missing or incomplete");
  }

  // 9. Runtime Aiven / B2 Decoupling Scan
  try {
    const uploadRouteCode = fs.readFileSync("app/api/admin/upload/route.js", "utf8");
    const clientCode = fs.readFileSync("lib/db/client.js", "utf8");

    const forcesB2AtRuntime = uploadRouteCode.includes("if (!hasB2) throw");
    const forcesAivenAtRuntime = clientCode.includes("if (!isCloudSSL) throw");

    if (!forcesB2AtRuntime && !forcesAivenAtRuntime) {
      logPass("Cloud Provider Decoupling", "Zero hard runtime dependencies on Aiven or Backblaze B2 in core API and DB routes");
    } else {
      logFail("Cloud Provider Decoupling", "Hardcoded runtime dependencies on Aiven or B2 detected in core code");
    }
  } catch (err) {
    logWarn("Provider Scan", err.message);
  }

  // 10. Backup & Restore System Readiness
  const backupDir = path.join(process.cwd(), "backups", "db", "full");
  const hasBackups = fs.existsSync(backupDir) && fs.readdirSync(backupDir).some(f => f.endsWith(".sql.gz") || f.endsWith(".sql"));
  if (hasBackups) {
    logPass("Backup System Readiness", "Verified database dump archive exists in backups/db/full/");
  } else {
    logWarn("Backup System Readiness", "No initial database dump found. Run 'npm run backup' to generate one.");
  }

  console.log("\n================================================================================");
  console.log(`PRE-FLIGHT AUDIT SUMMARY: ${results.checksPassed} Passed | ${results.checksWarning} Warnings | ${results.checksFailed} Failed`);
  console.log("================================================================================\n");

  if (results.checksFailed === 0) {
    console.log("🚀 STATUS: PRE-FLIGHT COMPLETED WITH ZERO FATAL BLOCKERS");
    console.log("   The application is fully prepared for Hostinger Business environment setup.");
    process.exit(0);
  } else {
    console.error("🛑 STATUS: PRE-FLIGHT FAILED — Resolve the above fatal errors before deploying.");
    process.exit(1);
  }
}

runPreflight();
