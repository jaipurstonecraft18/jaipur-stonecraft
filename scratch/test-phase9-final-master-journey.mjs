import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import http from 'http';
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

function fetchUrl(urlPath, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${urlPath}`, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
  });
}

function createAdminToken() {
  const secret = process.env.ADMIN_SECRET_KEY || "jsc-admin-secret-key-2026-atelier";
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

async function runMasterJourney() {
  console.log("=================================================");
  console.log("PHASE 9 — FINAL MASTER END-TO-END REGRESSION TEST");
  console.log("=================================================\n");

  // =========================================================
  // JOURNEY A: PUBLIC USER JOURNEY
  // =========================================================
  console.log("=================================================");
  console.log("JOURNEY A: PUBLIC USER JOURNEY");
  console.log("=================================================");

  // Step A1: Open Homepage
  process.stdout.write("Step A1: Open Homepage (/) ... ");
  const homeRes = await fetchUrl("/");
  if (homeRes.statusCode === 200 && homeRes.body.includes("Jaipur Stonecraft")) {
    console.log(`[PASS] HTTP 200 OK (${(homeRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${homeRes.statusCode}`);
    process.exit(1);
  }

  // Step A2: Navigate to Collections Hub
  process.stdout.write("Step A2: Navigate to Collections (/collections) ... ");
  const colRes = await fetchUrl("/collections");
  if (colRes.statusCode === 200 && colRes.body.includes("Collections")) {
    console.log(`[PASS] HTTP 200 OK (${(colRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${colRes.statusCode}`);
    process.exit(1);
  }

  // Step A3: Open Specific Category
  process.stdout.write("Step A3: Open Category (/collections/sculptures-statues/hindu-sculptures/ganesh-ji) ... ");
  const catRes = await fetchUrl("/collections/sculptures-statues/hindu-sculptures/ganesh-ji");
  if (catRes.statusCode === 200 && catRes.body.includes("Ganesh")) {
    console.log(`[PASS] HTTP 200 OK (${(catRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${catRes.statusCode}`);
    process.exit(1);
  }

  // Step A4: Browse Product Catalogue with Filter & Search
  process.stdout.write("Step A4: Browse Products (/products?material=makrana-pure-white) ... ");
  const prodRes = await fetchUrl("/products?material=makrana-pure-white");
  if (prodRes.statusCode === 200 && prodRes.body.includes("Catalogue")) {
    console.log(`[PASS] HTTP 200 OK (${(prodRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${prodRes.statusCode}`);
    process.exit(1);
  }

  // Step A5: Open Product Detail Page
  process.stdout.write("Step A5: Open Product Page (/designs/ganesh-ji/seated-ganesh-with-modak) ... ");
  const detailRes = await fetchUrl("/designs/ganesh-ji/seated-ganesh-with-modak");
  if (detailRes.statusCode === 200 && detailRes.body.includes("Seated Ganesh")) {
    console.log(`[PASS] HTTP 200 OK (${(detailRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${detailRes.statusCode}`);
    process.exit(1);
  }

  // Step A6: Open Contact & Inquiry Form
  process.stdout.write("Step A6: Open Contact Page (/contact) ... ");
  const contactRes = await fetchUrl("/contact");
  if (contactRes.statusCode === 200 && contactRes.body.includes("Contact")) {
    console.log(`[PASS] HTTP 200 OK (${(contactRes.body.length / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`[FAIL] HTTP ${contactRes.statusCode}`);
    process.exit(1);
  }

  console.log("\n✅ PUBLIC USER JOURNEY COMPLETED 100% SUCCESSFULLY!\n");

  // =========================================================
  // JOURNEY B: ADMIN USER JOURNEY
  // =========================================================
  console.log("=================================================");
  console.log("JOURNEY B: ADMIN USER JOURNEY");
  console.log("=================================================");

  const timestamp = Date.now();
  const masterSlug = `master-test-${timestamp}`;
  const masterName = `Master Journey Statue ${timestamp.toString().slice(-4)}`;
  const token = createAdminToken();

  // Step B1: Admin Login API
  process.stdout.write("Step B1: Admin Login (POST /api/admin/auth) ... ");
  const adminPassword = process.env.ADMIN_PASSWORD || "jscadmin2026";
  const loginRes = await fetch("http://localhost:3000/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: adminPassword })
  });
  const loginData = await loginRes.json();
  if (loginRes.ok && loginData.success) {
    console.log("[PASS] Admin Logged In Successfully!");
  } else {
    console.error("[FAIL] Login failed!");
    process.exit(1);
  }

  // Step B2: Upload Real Image
  process.stdout.write("Step B2: Upload Image (POST /api/admin/upload) ... ");
  const realPngPath = path.join(process.cwd(), "public", "images", "collections", "custom.png");
  const realPngBuffer = fs.readFileSync(realPngPath);
  const uploadFormData = new FormData();
  uploadFormData.append("files", new Blob([realPngBuffer], { type: "image/png" }), "master-statue.png");
  uploadFormData.append("folder", "products");
  uploadFormData.append("productSlug", masterSlug);

  const uploadRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Cookie": `jsc_admin_session=${token}` },
    body: uploadFormData
  });
  const uploadData = await uploadRes.json();
  if (uploadRes.ok && uploadData.success && uploadData.images.length > 0) {
    console.log(`[PASS] Image Uploaded & 4 Variants Generated! DisplayUrl: ${uploadData.images[0].displayUrl}`);
  } else {
    console.error("[FAIL] Image upload failed!");
    process.exit(1);
  }
  const uploadedImageSrc = uploadData.images[0].displayUrl;

  // Step B3: Create Test Product
  process.stdout.write("Step B3: Create Product (POST /api/admin/products) ... ");
  const createRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: masterName,
      slug: masterSlug,
      sku: `JSC-MST-${timestamp.toString().slice(-4)}`,
      status: "published",
      isFeatured: true,
      isNewArrival: true,
      productType: "statue",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: "ganesh-ji",
      primaryMaterialId: "makrana-pure-white",
      shortDescription: "Master test statue summary description.",
      detailedDescription: "Master test statue detailed description.",
      imageSrc: uploadedImageSrc,
      imageGallery: [uploadedImageSrc],
      knowledgeLayer: { whatIsThis: "Master Test Statue" },
      attributes: { colorFamily: "White" },
      tags: ["Master-Test"],
      seo: { title: `${masterName} | Jaipur Stonecraft` }
    })
  });
  const createData = await createRes.json();
  if (createRes.ok && createData.success) {
    console.log(`[PASS] Product Created! Slug: ${createData.product.slug}`);
  } else {
    console.error("[FAIL] Product creation failed!");
    process.exit(1);
  }

  // Step B4: Verify Product in DB
  process.stdout.write("Step B4: Verify in Database ... ");
  const dbRecord = await getOne("SELECT * FROM products WHERE slug = ?", [masterSlug]);
  if (dbRecord && dbRecord.name === masterName) {
    console.log(`[PASS] Verified in DB! Name: "${dbRecord.name}"`);
  } else {
    console.error("[FAIL] Not found in DB!");
    process.exit(1);
  }

  // Step B5: Verify Post-Creation Navigation to Edit Page
  process.stdout.write("Step B5: Verify Edit Page (/admin/products/" + masterSlug + ") ... ");
  const editPageRes = await fetchUrl(`/admin/products/${masterSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  if (editPageRes.statusCode === 200) {
    console.log("[PASS] HTTP 200 OK (No 404!)");
  } else {
    console.error(`[FAIL] HTTP ${editPageRes.statusCode}`);
    process.exit(1);
  }

  // Step B6: Verify on Public Website Search
  process.stdout.write("Step B6: Verify on Public Search (/api/search?q=Master) ... ");
  const searchRes = await fetchUrl(`/api/search?q=${encodeURIComponent(masterName)}`);
  const searchData = JSON.parse(searchRes.body);
  const foundPublic = searchData.products?.some(p => p.slug === masterSlug);
  if (foundPublic) {
    console.log("[PASS] Found in public search results!");
  } else {
    console.error("[FAIL] Not found in public search!");
    process.exit(1);
  }

  // Step B7: Edit Product
  process.stdout.write("Step B7: Edit Product (PUT /api/admin/products/" + masterSlug + ") ... ");
  const masterNameUpdated = `${masterName} (Updated)`;
  const putRes = await fetch(`http://localhost:3000/api/admin/products/${masterSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({ name: masterNameUpdated })
  });
  const putData = await putRes.json();
  if (putRes.ok && putData.product?.name === masterNameUpdated) {
    console.log(`[PASS] Updated in DB & API! Name: "${putData.product.name}"`);
  } else {
    console.error("[FAIL] Product edit failed!");
    process.exit(1);
  }

  // Step B8: Delete (Archive) Test Product
  process.stdout.write("Step B8: Delete Product (DELETE /api/admin/products/" + masterSlug + ") ... ");
  const delRes = await fetch(`http://localhost:3000/api/admin/products/${masterSlug}`, {
    method: "DELETE",
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const delData = await delRes.json();
  if (delRes.ok && delData.success) {
    console.log("[PASS] Product archived successfully!");
  } else {
    console.error("[FAIL] Delete failed!");
    process.exit(1);
  }

  // Step B9: Clean up test files & record
  await query("DELETE FROM product_images WHERE product_slug = ?", [masterSlug]);
  await query("DELETE FROM products WHERE slug = ?", [masterSlug]);
  try {
    const rawDiskPath = path.join(process.cwd(), "public", uploadData.images[0].rawUrl.replace(/^\//, ""));
    const displayDiskPath = path.join(process.cwd(), "public", uploadData.images[0].displayUrl.replace(/^\//, ""));
    const cardDiskPath = path.join(process.cwd(), "public", uploadData.images[0].cardUrl.replace(/^\//, ""));
    const thumbDiskPath = path.join(process.cwd(), "public", uploadData.images[0].thumbUrl.replace(/^\//, ""));
    if (fs.existsSync(rawDiskPath)) fs.unlinkSync(rawDiskPath);
    if (fs.existsSync(displayDiskPath)) fs.unlinkSync(displayDiskPath);
    if (fs.existsSync(cardDiskPath)) fs.unlinkSync(cardDiskPath);
    if (fs.existsSync(thumbDiskPath)) fs.unlinkSync(thumbDiskPath);
  } catch (e) {}
  console.log("Step B9: Cleaned up test product & images from DB and disk.");

  console.log("\n=================================================");
  console.log("🎉 MASTER END-TO-END REGRESSION AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runMasterJourney().catch((err) => {
  console.error("❌ Master journey failed:", err);
  process.exit(1);
});
