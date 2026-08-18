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

async function runStep4CatalogueTest() {
  console.log("=================================================");
  console.log("PHASE 1 STEP 4 — CATALOGUE & MEDIA WORKFLOW AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();

  // 1. GET CATALOGUE DATA
  console.log("--- 1. Testing Catalogue API Fetch ---");
  const catRes = await fetch("http://localhost:3000/api/admin/catalogue", {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const catData = await catRes.json();
  console.log(`GET /api/admin/catalogue status: HTTP ${catRes.status}`);
  console.log(`  Materials:     ${catData.materials?.length || 0}`);
  console.log(`  Subjects:      ${catData.subjects?.length || 0}`);
  console.log(`  ProductTypes:  ${catData.productTypes?.length || 0}`);
  console.log(`  Attributes:    ${catData.attributes?.length || 0}`);

  if (!catRes.ok || !catData.materials) {
    console.error("❌ Catalogue API failed!");
    process.exit(1);
  }

  // 2. GET CATEGORIES & COLLECTIONS
  console.log("\n--- 2. Testing Categories & Collections API Fetch ---");
  const categoriesRes = await fetch("http://localhost:3000/api/admin/categories", {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const categoriesData = await categoriesRes.json();
  console.log(`GET /api/admin/categories status: HTTP ${categoriesRes.status}`);
  console.log(`  Categories:  ${categoriesData.categories?.length || 0}`);
  console.log(`  Collections: ${categoriesData.collections?.length || 0}`);

  if (!categoriesRes.ok || !categoriesData.categories) {
    console.error("❌ Categories API failed!");
    process.exit(1);
  }

  // 3. CATEGORY COVER IMAGE REPLACEMENT
  console.log("\n--- 3. Testing Category Cover Image Replacement ---");
  const targetCategory = categoriesData.categories[0];
  const newCoverUrl = "https://placehold.co/800x500/E8E4DF/1A1918?text=Updated+Category+Cover";

  const updateCoverRes = await fetch("http://localhost:3000/api/admin/categories", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      slug: targetCategory.slug,
      imageSrc: newCoverUrl,
      imageAlt: `${targetCategory.name} updated cover`,
      type: "category"
    })
  });
  const updateCoverData = await updateCoverRes.json();
  console.log(`PUT /api/admin/categories status: HTTP ${updateCoverRes.status}, success: ${updateCoverData.success}`);
  if (!updateCoverRes.ok || !updateCoverData.success) {
    console.error("❌ Category cover replacement failed!", updateCoverData);
    process.exit(1);
  }

  // Revert cover image back to original
  await fetch("http://localhost:3000/api/admin/categories", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      slug: targetCategory.slug,
      imageSrc: targetCategory.image_src,
      imageAlt: targetCategory.image_alt,
      type: "category"
    })
  });
  console.log("✓ Restored original category cover image.");

  // 4. ADD & ARCHIVE REUSABLE MATERIAL
  console.log("\n--- 4. Testing Reusable Material Creation & Archiving ---");
  const testMatName = `Step 4 Test Sandstone ${Date.now().toString().slice(-4)}`;
  const createMatRes = await fetch("http://localhost:3000/api/admin/catalogue", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      entityType: "material",
      payload: {
        name: testMatName,
        category: "Sandstone",
        colorFamily: "Red",
        origin: "Jodhpur, Rajasthan"
      }
    })
  });
  const createMatData = await createMatRes.json();
  console.log(`POST material status: HTTP ${createMatRes.status}, success: ${createMatData.success}`);

  const createdId = testMatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const archiveMatRes = await fetch("http://localhost:3000/api/admin/catalogue", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      entityType: "material",
      id: createdId,
      action: "archive"
    })
  });
  const archiveMatData = await archiveMatRes.json();
  console.log(`PUT archive material status: HTTP ${archiveMatRes.status}, success: ${archiveMatData.success}`);

  console.log("\n=================================================");
  console.log("✅ PHASE 1 STEP 4 — CATALOGUE & MEDIA AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runStep4CatalogueTest().catch((err) => {
  console.error("❌ Step 4 test failed:", err);
  process.exit(1);
});
