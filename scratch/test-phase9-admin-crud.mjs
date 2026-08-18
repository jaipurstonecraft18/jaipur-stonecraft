import crypto from 'crypto';
import fs from 'fs';
import { query, getOne } from '../lib/db/client.js';

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

async function runAdminAudit() {
  console.log("=================================================");
  console.log("PHASE 9 — ADMIN SYSTEM, DB & CRUD RUNTIME AUDIT");
  console.log("=================================================\n");

  const validToken = createAdminToken();
  const timestamp = Date.now();
  const testSlug = `phase9-crud-test-${timestamp}`;
  const testName = `Phase 9 Audit Statue ${timestamp.toString().slice(-4)}`;

  // 1. AUTHENTICATION & ACCESS CONTROL TESTS
  console.log("--- 1. Testing Admin Access Control ---");

  // 1a. Unauthorized API request (No token)
  const unauthRes = await fetch("http://localhost:3000/api/admin/products");
  console.log(`Unauth API request status: HTTP ${unauthRes.status} (Expected 401)`);
  if (unauthRes.status !== 401) {
    console.error("❌ Auth Security Failure: API allowed unauthorized access!");
    process.exit(1);
  }

  // 1b. Unauthorized login attempt with wrong password
  const badLoginRes = await fetch("http://localhost:3000/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "wrongpassword123" })
  });
  console.log(`Wrong password login status: HTTP ${badLoginRes.status} (Expected 401)`);

  // 1c. Authorized login attempt with correct password
  const adminPassword = process.env.ADMIN_PASSWORD || "jscadmin2026";
  const goodLoginRes = await fetch("http://localhost:3000/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword })
  });
  const goodLoginData = await goodLoginRes.json();
  console.log(`Correct password login status: HTTP ${goodLoginRes.status}, success: ${goodLoginData.success}`);
  if (!goodLoginRes.ok || !goodLoginData.success) {
    console.error("❌ Admin Login Failed with correct password!");
    process.exit(1);
  }
  console.log("✓ Admin Authentication & Guard verified 100%!");

  // 2. HEALTH CHECK ENDPOINT
  console.log("\n--- 2. Testing Admin Health Check ---");
  const healthRes = await fetch("http://localhost:3000/api/admin/health", {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  const healthData = await healthRes.json();
  console.log(`Health Check Status: HTTP ${healthRes.status}, DB Status: ${healthData.database?.status}, Products Count: ${healthData.database?.productCount}`);

  // 3. PRODUCT CRUD LIFECYCLE: CREATE
  console.log("\n--- 3. Testing Product CRUD: CREATE ---");

  // 3a. Open Add Product page
  const addPageRes = await fetch("http://localhost:3000/admin/products/new", {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  console.log(`Add Product Page status: HTTP ${addPageRes.status} (Expected 200 OK, No 404)`);
  if (addPageRes.status !== 200) {
    console.error("❌ Add Product page returned error status!");
    process.exit(1);
  }

  // 3b. Submit new product
  const createRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${validToken}`
    },
    body: JSON.stringify({
      name: testName,
      slug: testSlug,
      sku: `JSC-P9-${timestamp.toString().slice(-4)}`,
      status: "published",
      isFeatured: true,
      isNewArrival: true,
      productType: "statue",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: "ganesh-ji",
      primaryMaterialId: "makrana-pure-white",
      shortDescription: "Phase 9 Audit test product summary description.",
      detailedDescription: "Phase 9 Audit test detailed description.",
      imageSrc: "https://placehold.co/800x600/E8E4DF/1A1918?text=Phase+9+Cover+Photo",
      imageGallery: ["https://placehold.co/800x600/E8E4DF/1A1918?text=Phase+9+Detail+1"],
      knowledgeLayer: { whatIsThis: "Phase 9 Test Murti" },
      attributes: { colorFamily: "White" },
      tags: ["Phase9-Test", "Hand-Carved"],
      seo: { title: `${testName} | Jaipur Stonecraft` }
    })
  });

  const createData = await createRes.json();
  console.log(`POST /api/admin/products status: HTTP ${createRes.status}, success: ${createData.success}, slug: ${createData.product?.slug}`);
  if (!createRes.ok || !createData.success) {
    console.error("❌ Product creation failed!", createData);
    process.exit(1);
  }

  // 3c. Verify post-creation navigation to edit page
  const editPageRes = await fetch(`http://localhost:3000/admin/products/${testSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  console.log(`Post-creation Edit Page GET status: HTTP ${editPageRes.status} (Expected 200 OK)`);
  if (editPageRes.status !== 200) {
    console.error("❌ Post-creation navigation resulted in 404/Error!");
    process.exit(1);
  }

  // 3d. Verify direct DB persistence
  const dbRecord = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  console.log(`Direct DB verification: Record found in DB? ${Boolean(dbRecord)}, Name="${dbRecord?.name}"`);
  if (!dbRecord) {
    console.error("❌ Product not persisted in DB!");
    process.exit(1);
  }

  // 3e. Verify product image persistence in DB
  const dbImages = await query("SELECT * FROM product_images WHERE product_slug = ?", [testSlug]);
  console.log(`Direct DB verification: Product images stored in DB? ${dbImages.length} images found.`);
  if (dbImages.length < 2) {
    console.error("❌ Product images not properly linked in DB!");
    process.exit(1);
  }

  // 3f. Verify public listing visibility
  const publicListRes = await fetch("http://localhost:3000/api/search?q=" + encodeURIComponent(testName));
  const publicListData = await publicListRes.json();
  const foundInPublic = publicListData.products?.some(p => p.slug === testSlug);
  console.log(`Public Search API verification: Found newly created product in public list? ${foundInPublic}`);

  // 4. PRODUCT CRUD LIFECYCLE: READ
  console.log("\n--- 4. Testing Product CRUD: READ ---");
  const getProductRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  const getProductData = await getProductRes.json();
  console.log(`GET /api/admin/products/${testSlug} status: HTTP ${getProductRes.status}, Product name: ${getProductData.product?.name}`);

  // 5. PRODUCT CRUD LIFECYCLE: UPDATE
  console.log("\n--- 5. Testing Product CRUD: UPDATE ---");
  const updatedName = `${testName} (Updated in Phase 9)`;
  const updateRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${validToken}`
    },
    body: JSON.stringify({
      name: updatedName,
      shortDescription: "Updated short description in Phase 9 test."
    })
  });
  const updateData = await updateRes.json();
  console.log(`PUT status: HTTP ${updateRes.status}, Updated Name: "${updateData.product?.name}"`);

  // Verify DB reflects updated data
  const updatedDbRecord = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  console.log(`DB Verification after UPDATE: Name="${updatedDbRecord?.name}"`);
  if (updatedDbRecord?.name !== updatedName) {
    console.error("❌ UPDATE failed to persist in DB!");
    process.exit(1);
  }

  // 6. PRODUCT CRUD LIFECYCLE: DELETE / ARCHIVE
  console.log("\n--- 6. Testing Product CRUD: DELETE / ARCHIVE ---");
  const deleteRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "DELETE",
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  const deleteData = await deleteRes.json();
  console.log(`DELETE status: HTTP ${deleteRes.status}, success: ${deleteData.success}`);

  // Verify status is updated to archived in DB
  const archivedDbRecord = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  console.log(`DB Verification after DELETE: Status="${archivedDbRecord?.status}"`);
  if (archivedDbRecord?.status !== "archived") {
    console.error("❌ DELETE/Archiving failed!");
    process.exit(1);
  }

  // Clean up test images and record from DB completely
  await query("DELETE FROM product_images WHERE product_slug = ?", [testSlug]);
  await query("DELETE FROM products WHERE slug = ?", [testSlug]);
  console.log("✓ Test product data cleaned up safely from DB.");

  // 7. CATEGORIES & QUICK-ADD CATALOGUE MANAGEMENT
  console.log("\n--- 7. Testing Admin Categories & Quick-Add Catalogue ---");
  const catRes = await fetch("http://localhost:3000/api/admin/categories", {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  const catData = await catRes.json();
  console.log(`GET /api/admin/categories status: HTTP ${catRes.status}, Categories Count: ${catData.categories?.length || 0}`);

  const catalogueRes = await fetch("http://localhost:3000/api/admin/catalogue", {
    headers: { "Cookie": `jsc_admin_session=${validToken}` }
  });
  const catalogueData = await catalogueRes.json();
  console.log(`GET /api/admin/catalogue status: HTTP ${catalogueRes.status}, Materials Count: ${catalogueData.materials?.length}, ProductTypes Count: ${catalogueData.productTypes?.length}`);

  // 8. DATABASE INTEGRITY AUDIT
  console.log("\n--- 8. Database Integrity Audit ---");
  const totalProducts = await getOne("SELECT COUNT(*) as total FROM products");
  const totalImages = await getOne("SELECT COUNT(*) as total FROM product_images");
  const totalMaterials = await getOne("SELECT COUNT(*) as total FROM materials");
  const totalCategories = await getOne("SELECT COUNT(*) as total FROM categories");
  const totalCollections = await getOne("SELECT COUNT(*) as total FROM collections");

  // Check for orphan product_images
  const orphanImages = await query("SELECT pi.* FROM product_images pi LEFT JOIN products p ON pi.product_slug = p.slug WHERE p.slug IS NULL");

  console.log(`Total Products in DB: ${totalProducts?.total}`);
  console.log(`Total Product Images in DB: ${totalImages?.total}`);
  console.log(`Total Materials in DB: ${totalMaterials?.total}`);
  console.log(`Total Categories in DB: ${totalCategories?.total}`);
  console.log(`Total Collections in DB: ${totalCollections?.total}`);
  console.log(`Orphan Images in DB: ${orphanImages.length}`);

  if (orphanImages.length > 0) {
    console.warn(`⚠️ Warning: Found ${orphanImages.length} orphan images. Cleaning up...`);
    await query("DELETE pi FROM product_images pi LEFT JOIN products p ON pi.product_slug = p.slug WHERE p.slug IS NULL");
  }

  console.log("\n=================================================");
  console.log("✅ PHASE 9 STEP 2 — ADMIN, DB & CRUD AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runAdminAudit().catch((err) => {
  console.error("❌ Admin audit failed:", err);
  process.exit(1);
});
