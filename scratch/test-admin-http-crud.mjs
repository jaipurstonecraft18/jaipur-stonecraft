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

function createToken() {
  const secret = process.env.ADMIN_SECRET_KEY || "jsc-admin-secret-key-2026-atelier";
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

async function runTest() {
  const token = createToken();
  console.log("Generated Admin Session Token:", token.slice(0, 25) + "...");

  const timestamp = Date.now();
  const testSlug = `http-test-product-${timestamp}`;
  const testName = `HTTP Test Statue ${timestamp.toString().slice(-4)}`;

  // 1. Create product via POST /api/admin/products
  console.log("\n[STEP 1] Testing POST /api/admin/products...");
  const postRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: testName,
      slug: testSlug,
      sku: `JSC-HTTP-${timestamp.toString().slice(-4)}`,
      status: "published",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: "ganesh-ji",
      primaryMaterialId: "makrana-pure-white",
      shortDescription: "Short test summary description",
      detailedDescription: "Detailed test overview description"
    })
  });

  const postData = await postRes.json();
  console.log("POST Response status:", postRes.status, "body:", postData);

  if (!postRes.ok || !postData.success) {
    console.error("❌ POST Failed!");
    process.exit(1);
  }

  // 2. Fetch the Edit Page at /admin/products/[slug] via HTTP GET
  console.log(`\n[STEP 2] Testing GET /admin/products/${testSlug}...`);
  const getPageRes = await fetch(`http://localhost:3000/admin/products/${testSlug}`, {
    headers: {
      "Cookie": `jsc_admin_session=${token}`
    }
  });
  console.log("Edit Page GET status:", getPageRes.status);
  if (getPageRes.status !== 200) {
    console.error(`❌ Edit Page returned HTTP ${getPageRes.status}! Expected 200.`);
    process.exit(1);
  } else {
    console.log("✓ Edit Page returned HTTP 200 OK without 404!");
  }

  // 3. Fetch product detail API at GET /api/admin/products/[slug]
  console.log(`\n[STEP 3] Testing GET /api/admin/products/${testSlug}...`);
  const getApiRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const getApiData = await getApiRes.json();
  console.log("API GET status:", getApiRes.status, "Product name:", getApiData.product?.name);

  // 4. Update product via PUT /api/admin/products/[slug]
  console.log(`\n[STEP 4] Testing PUT /api/admin/products/${testSlug}...`);
  const updatedName = `${testName} (Updated)`;
  const putRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({ name: updatedName })
  });
  const putData = await putRes.json();
  console.log("PUT Response status:", putRes.status, "Updated name:", putData.product?.name);

  if (putData.product?.name !== updatedName) {
    console.error("❌ PUT Failed to update product name!");
    process.exit(1);
  }

  // 5. Delete product via DELETE /api/admin/products/[slug]
  console.log(`\n[STEP 5] Testing DELETE /api/admin/products/${testSlug}...`);
  const delRes = await fetch(`http://localhost:3000/api/admin/products/${testSlug}`, {
    method: "DELETE",
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const delData = await delRes.json();
  console.log("DELETE Response status:", delRes.status, "body:", delData);

  if (!delRes.ok || !delData.success) {
    console.error("❌ DELETE Failed!");
    process.exit(1);
  }

  console.log("\n🎉 FULL END-TO-END HTTP API CRUD & NAVIGATION TEST PASSED 100%!");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test script error:", err);
  process.exit(1);
});
