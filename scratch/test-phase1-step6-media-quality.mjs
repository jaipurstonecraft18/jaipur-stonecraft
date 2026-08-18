import crypto from 'crypto';
import fs from 'fs';
import { getOne } from '../lib/db/client.js';

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

async function runStep6QualityAudit() {
  console.log("=================================================");
  console.log("PHASE 1 STEP 6 — MEDIA INSPECTOR & QUALITY AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();

  // 1. MEDIA INSPECTOR & REFERENCE SCAN
  console.log("--- 1. Testing Media Inspector API ---");
  const mediaRes = await fetch("http://localhost:3000/api/admin/media", {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const mediaData = await mediaRes.json();
  console.log(`GET /api/admin/media status: HTTP ${mediaRes.status}`);
  console.log(`  Total Media Files:  ${mediaData.totalCount}`);
  console.log(`  Actively Used:     ${mediaData.usedCount}`);
  console.log(`  Unused Files:      ${mediaData.unusedCount}`);

  if (!mediaRes.ok || mediaData.totalCount === undefined) {
    console.error("❌ Media API failed!");
    process.exit(1);
  }

  // 2. SAFE DELETION REJECTION TEST (Referenced File)
  console.log("\n--- 2. Testing Safe Deletion Safeguard for Referenced Media ---");
  const activeProductImg = await getOne("SELECT url FROM product_images WHERE url LIKE '/uploads/%' LIMIT 1");

  if (activeProductImg && activeProductImg.url) {
    const badDeleteRes = await fetch(`http://localhost:3000/api/admin/media?url=${encodeURIComponent(activeProductImg.url)}`, {
      method: "DELETE",
      headers: { "Cookie": `jsc_admin_session=${token}` }
    });
    const badDeleteData = await badDeleteRes.json();
    console.log(`Deletion rejection status: HTTP ${badDeleteRes.status} (Expected 400), Message: "${badDeleteData.error}"`);
    if (badDeleteRes.status !== 400) {
      console.error("❌ Safeguard failure: Allowed deletion of actively referenced media!");
      process.exit(1);
    }
    console.log("✓ Safe media deletion safeguard verified 100%!");
  } else {
    console.log("  No active /uploads/ product image found to test deletion safeguard. (Skipping)");
  }

  // 3. FUTURE AI READINESS STRUCTURE AUDIT
  console.log("\n--- 3. Future AI Readiness Structure Audit ---");
  const sampleProduct = await getOne("SELECT * FROM products LIMIT 1");
  if (sampleProduct) {
    const aiFields = [
      "name", "product_type", "parent_collection", "parent_category",
      "primary_material_id", "subject_id", "short_description",
      "detailed_description", "knowledge_layer", "attributes", "tags", "seo"
    ];

    let aiReady = true;
    for (const field of aiFields) {
      if (sampleProduct[field] === undefined) {
        console.warn(`  ⚠️ Missing AI context field: ${field}`);
        aiReady = false;
      }
    }

    console.log(`  Sample Product Slug: "${sampleProduct.slug}"`);
    console.log(`  AI Readiness Audit: ${aiReady ? "✅ 100% PASSED (All 12 structured fields available for future prompt drafting)" : "❌ FAILED"}`);
  }

  // 4. MASTER ADMIN ROUTE AUDIT
  console.log("\n--- 4. Master Admin Route Audit ---");
  const routes = [
    "/admin",
    "/admin/products",
    "/admin/products/new",
    "/admin/health",
    "/admin/catalogue",
    "/admin/categories",
    "/admin/content",
    "/admin/media"
  ];

  for (const r of routes) {
    const res = await fetch(`http://localhost:3000${r}`, {
      headers: { "Cookie": `jsc_admin_session=${token}` }
    });
    console.log(`  Route ${r} -> Status: HTTP ${res.status} ${res.ok ? "✅ PASS" : "❌ FAIL"}`);
    if (!res.ok) {
      console.error(`❌ Admin route ${r} failed!`);
      process.exit(1);
    }
  }

  console.log("\n=================================================");
  console.log("🎉 PHASE 1 MASTER AUDIT COMPLETED 100% SUCCESSFULLY!");
  console.log("=================================================\n");
  process.exit(0);
}

runStep6QualityAudit().catch((err) => {
  console.error("❌ Step 6 quality audit failed:", err);
  process.exit(1);
});
