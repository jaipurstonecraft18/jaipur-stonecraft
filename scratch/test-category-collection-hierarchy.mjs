import crypto from 'crypto';
import fs from 'fs';
import { getCollection, getCategory, getCategoriesBySubcategory } from '../lib/db/taxonomy.js';
import { query, execute } from '../lib/db/client.js';

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

async function runCategoryCollectionHierarchyTest() {
  console.log("=================================================");
  console.log("PHASE 1 — CATEGORY & COLLECTION HIERARCHY VERIFICATION");
  console.log("=================================================\n");

  const token = createAdminToken();
  const uniqueId = Date.now().toString().slice(-4);
  const testColSlug = `test-garden-col-${uniqueId}`;
  const testCatSlug = `test-fountain-cat-${uniqueId}`;
  const testProdSlug = `test-fountain-prod-${uniqueId}`;

  // 1. CREATE COLLECTION VIA ADMIN API
  console.log("--- 1. Testing Collection Creation ---");
  const colRes = await fetch("http://localhost:3000/api/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      type: "collection",
      payload: {
        name: `Test Garden Collection ${uniqueId}`,
        slug: testColSlug,
        description: "Bespoke handcrafted garden fountains and sculptures."
      }
    })
  });
  const colData = await colRes.json();
  console.log(`POST Collection status: HTTP ${colRes.status}, success: ${colData.success}`);
  if (!colRes.ok || !colData.success) {
    console.error("❌ Collection creation failed!", colData);
    process.exit(1);
  }

  // 2. CREATE CATEGORY VIA ADMIN API UNDER NEW COLLECTION
  console.log("\n--- 2. Testing Category Creation & Hierarchy Assignment ---");
  const catRes = await fetch("http://localhost:3000/api/admin/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      type: "category",
      payload: {
        name: `Test Fountain Category ${uniqueId}`,
        slug: testCatSlug,
        parentCollection: testColSlug,
        parentSubcategory: `${testColSlug}-general`,
        description: "Hand-carved marble tiered garden fountains."
      }
    })
  });
  const catData = await catRes.json();
  console.log(`POST Category status: HTTP ${catRes.status}, success: ${catData.success}`);
  if (!catRes.ok || !catData.success) {
    console.error("❌ Category creation failed!", catData);
    process.exit(1);
  }

  // 3. PUBLIC WEBSITE CATALOGUE HIERARCHY INTEGRATION TEST
  console.log("\n--- 3. Testing Public Website Catalogue Hierarchy Integration ---");
  const publicCollection = await getCollection(testColSlug);
  console.log("  Dynamic DB Collection Fetch:", publicCollection ? `Found "${publicCollection.name}"` : "NOT FOUND");
  if (!publicCollection) {
    console.error("❌ New Collection is not accessible via public taxonomy engine!");
    process.exit(1);
  }

  const publicCategories = await getCategoriesBySubcategory(testColSlug, `${testColSlug}-general`);
  console.log("  Dynamic DB Subcategory Categories Fetch:", publicCategories.length > 0 ? `Found ${publicCategories.length} category(ies)` : "NOT FOUND");
  const foundCat = publicCategories.find(c => c.slug === testCatSlug);
  if (!foundCat) {
    console.error("❌ New Category is not accessible under public collection page!");
    process.exit(1);
  }
  console.log(`  ✓ Public Category Verified: "${foundCat.name}" under Collection "${testColSlug}"`);

  // 4. CREATE PRODUCT USING NEW COLLECTION AND CATEGORY
  console.log("\n--- 4. Testing Product Creation with New Hierarchy ---");
  const prodRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: `Test Fountain Statue ${uniqueId}`,
      slug: testProdSlug,
      sku: `SKU-FOUNTAIN-${uniqueId}`,
      productType: "statue",
      parentCollection: testColSlug,
      parentSubcategory: `${testColSlug}-general`,
      parentCategory: testCatSlug,
      primaryMaterialId: "makrana-pure-white-marble",
      shortDescription: "Hand-carved 3-tier white marble garden fountain.",
      status: "published"
    })
  });
  const prodData = await prodRes.json();
  console.log(`POST Product status: HTTP ${prodRes.status}, success: ${prodData.success}`);
  if (!prodRes.ok || !prodData.success) {
    console.error("❌ Product creation with new hierarchy failed!", prodData);
    process.exit(1);
  }

  // 5. CLEAN UP TEST DATA
  console.log("\n--- 5. Cleaning Up Test Data ---");
  await execute("DELETE FROM products WHERE slug = ?", [testProdSlug]);
  await execute("DELETE FROM categories WHERE slug = ?", [testCatSlug]);
  await execute("DELETE FROM collections WHERE slug = ?", [testColSlug]);
  await execute("DELETE FROM subcategories WHERE slug = ?", [`${testColSlug}-general`]);
  console.log("✓ Test records cleaned up safely from DB.");

  console.log("\n=================================================");
  console.log("✅ PHASE 1 — CATEGORY & COLLECTION HIERARCHY VERIFIED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runCategoryCollectionHierarchyTest().catch((err) => {
  console.error("❌ Hierarchy test failed:", err);
  process.exit(1);
});
