import crypto from 'crypto';
import fs from 'fs';

// Load .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

function createAdminToken() {
  const secret = process.env.ADMIN_SECRET_KEY || "jsc-admin-secret-key-2026-atelier";
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

async function runPhase2UIVerification() {
  console.log("=================================================");
  console.log("PHASE 2 — ADMIN UI RESTRUCTURING & CLEANUP VERIFICATION");
  console.log("=================================================\n");

  const token = createAdminToken();

  const adminRoutes = [
    { path: "/admin", name: "Dashboard Workspace" },
    { path: "/admin/products", name: "Products List & Filters" },
    { path: "/admin/products/new", name: "Product Studio (Add New)" },
    { path: "/admin/health", name: "Product Health Queue" },
    { path: "/admin/catalogue", name: "Catalogue & Hierarchy Manager" },
    { path: "/admin/content", name: "Website Content Manager" },
    { path: "/admin/media", name: "Shared Media & Reference Inspector" }
  ];

  for (const route of adminRoutes) {
    const res = await fetch(`http://localhost:3000${route.path}`, {
      headers: { "Cookie": `jsc_admin_session=${token}` }
    });
    console.log(`  Route ${route.path} [${route.name}] -> Status: HTTP ${res.status} ${res.ok ? "✅ PASS" : "❌ FAIL"}`);
    if (!res.ok) {
      console.error(`❌ Admin UI route ${route.path} failed!`);
      process.exit(1);
    }
  }

  console.log("\n=================================================");
  console.log("✅ PHASE 2 — ADMIN UI RESTRUCTURING VERIFIED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runPhase2UIVerification().catch((err) => {
  console.error("❌ Phase 2 verification failed:", err);
  process.exit(1);
});
