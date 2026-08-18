import crypto from 'crypto';
import fs from 'fs';
import { getOne, query } from '../lib/db/client.js';

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

async function runStep2WorkflowTest() {
  console.log("=================================================");
  console.log("PHASE 1 STEP 2 — PRODUCT WORKFLOW & LIFECYCLE AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();
  const timestamp = Date.now();
  const testSlug = `step2-test-${timestamp}`;
  const testName = `Step 2 Workflow Statue ${timestamp.toString().slice(-4)}`;

  // 1. INLINE QUICK-ADD CREATION (Category & Material)
  console.log("--- 1. Testing Inline Quick-Add Category Creation ---");
  const quickAddRes = await fetch("http://localhost:3000/api/admin/catalogue/quick-add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      targetField: "parentCategory",
      name: `Step 2 Test Category ${timestamp.toString().slice(-4)}`,
      parentCollection: "sculptures-statues"
    })
  });
  const quickAddData = await quickAddRes.json();
  console.log(`Quick-Add Category API Status: HTTP ${quickAddRes.status}, success: ${quickAddData.success}, slug: "${quickAddData.item?.slug}"`);
  if (!quickAddRes.ok || !quickAddData.success) {
    console.error("❌ Quick Add Category failed!");
    process.exit(1);
  }
  const newlyCreatedCategorySlug = quickAddData.item.slug;

  // 2. PRODUCT CREATION WITH HUMAN-READABLE CLASSIFICATION
  console.log("\n--- 2. Testing Product Creation with Human-Readable Category ---");
  const createRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: testName,
      slug: testSlug,
      sku: `JSC-S2-${timestamp.toString().slice(-4)}`,
      status: "draft",
      isFeatured: false,
      isNewArrival: true,
      productType: "statue",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: newlyCreatedCategorySlug,
      primaryMaterialId: "makrana-pure-white",
      shortDescription: "Step 2 Workflow test summary description.",
      detailedDescription: "Step 2 Workflow test detailed description.",
      imageSrc: "https://placehold.co/800x600/E8E4DF/1A1918?text=Step+2+Cover",
      knowledgeLayer: { whatIsThis: "Step 2 Test Murti" },
      attributes: { colorFamily: "White" },
      tags: ["Step2-Test"],
      seo: { title: `${testName} | Jaipur Stonecraft` }
    })
  });
  const createData = await createRes.json();
  console.log(`POST /api/admin/products Status: HTTP ${createRes.status}, success: ${createData.success}, slug: "${createData.product?.slug}"`);
  if (!createRes.ok || !createData.success) {
    console.error("❌ Product creation failed!");
    process.exit(1);
  }

  // 3. EDIT & LIFECYCLE TRANSITIONS (Draft -> Published -> Archived)
  console.log("\n--- 3. Testing Product Lifecycle Transitions ---");

  // Publish
  const publishRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({ status: "published" })
  });
  const publishData = await publishRes.json();
  console.log(`Publish Product Status: HTTP ${publishRes.status}, status: "${publishData.product?.status}"`);

  // Archive
  const archiveRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "DELETE",
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const archiveData = await archiveRes.json();
  console.log(`Archive Product Status: HTTP ${archiveRes.status}, message: "${archiveData.message}"`);

  const dbArchived = await getOne("SELECT status FROM products WHERE slug = ?", [testSlug]);
  console.log(`DB Verification: Status = "${dbArchived?.status}"`);
  if (dbArchived?.status !== "archived") {
    console.error("❌ Archiving status update failed!");
    process.exit(1);
  }

  // 4. SAFE PERMANENT DELETION
  console.log("\n--- 4. Testing Permanent Safe Deletion ---");
  const permanentDelRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}?permanent=true`, {
    method: "DELETE",
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const permanentDelData = await permanentDelRes.json();
  console.log(`Permanent Delete Status: HTTP ${permanentDelRes.status}, message: "${permanentDelData.message}"`);

  const dbDeleted = await getOne("SELECT id FROM products WHERE slug = ?", [testSlug]);
  console.log(`DB Verification: Record still in DB? ${Boolean(dbDeleted)}`);
  if (dbDeleted) {
    console.error("❌ Permanent deletion failed!");
    process.exit(1);
  }

  // Clean up quick-added test category
  await query("DELETE FROM categories WHERE slug = ?", [newlyCreatedCategorySlug]);
  console.log("✓ Test category cleaned up safely from DB.");

  // 5. EXISTING DATA INTEGRITY AUDIT
  console.log("\n--- 5. Existing Data Integrity Audit ---");
  const totalProducts = await getOne("SELECT COUNT(*) as total FROM products");
  const totalCategories = await getOne("SELECT COUNT(*) as total FROM categories");
  console.log(`Total Existing Products in DB: ${totalProducts?.total}`);
  console.log(`Total Categories in DB: ${totalCategories?.total}`);

  console.log("\n=================================================");
  console.log("✅ PHASE 1 STEP 2 — WORKFLOW & LIFECYCLE AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runStep2WorkflowTest().catch((err) => {
  console.error("❌ Step 2 test failed:", err);
  process.exit(1);
});
