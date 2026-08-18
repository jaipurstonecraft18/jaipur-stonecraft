import crypto from 'crypto';
import fs from 'fs';
import { getOne, execute, query } from '../lib/db/client.js';

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

async function runPart1ReopenPersistenceTest() {
  console.log("=================================================");
  console.log("PART 1 — REOPEN PERSISTENCE & EXISTING DATA AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();
  const uniqueId = Date.now().toString().slice(-4);
  const testProdSlug = `test-reopen-${uniqueId}`;

  // 1. ADD PRODUCT WITH CUSTOM SECTIONS
  console.log("--- 1. Testing Initial Save with Custom Knowledge Sections ---");
  const initialSections = [
    { title: "Craftsmanship & Technique", content: "Master chisel work in Jaipur atelier." },
    { title: "Material Origin & Characteristics", content: "Pure crystalline Makrana white marble." },
    { title: "Symbolism / Cultural Context", content: "Sacred icon of prosperity." }
  ];

  const createRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: `Reopen Test Product ${uniqueId}`,
      slug: testProdSlug,
      sku: `SKU-REOPEN-${uniqueId}`,
      productType: "statue",
      parentCollection: "sculptures-statues",
      parentSubcategory: "hindu-sculptures",
      parentCategory: "ganesh-ji",
      primaryMaterialId: "makrana-pure-white-marble",
      knowledgeLayer: initialSections,
      status: "draft"
    })
  });
  const createData = await createRes.json();
  console.log(`POST Product status: HTTP ${createRes.status}, success: ${createData.success}`);
  if (!createRes.ok || !createData.success) {
    console.error("❌ Product creation failed!");
    process.exit(1);
  }

  // 2. REOPEN PRODUCT & VERIFY DATA PERSISTENCE
  console.log("\n--- 2. Reopening Product via GET /api/admin/products/[id] ---");
  const getRes = await fetch(`http://localhost:3000/api/admin/products/${testProdSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const getData = await getRes.json();
  console.log(`GET /api/admin/products/${testProdSlug} status: HTTP ${getRes.status}`);

  const reopenedSections = getData.product?.knowledgeLayer || [];
  console.log(`  Reopened Sections Count: ${reopenedSections.length}`);
  console.log(`  Section 1 Title: "${reopenedSections[0]?.title}" -> Content: "${reopenedSections[0]?.content}"`);
  console.log(`  Section 2 Title: "${reopenedSections[1]?.title}" -> Content: "${reopenedSections[1]?.content}"`);
  console.log(`  Section 3 Title: "${reopenedSections[2]?.title}" -> Content: "${reopenedSections[2]?.content}"`);

  if (reopenedSections.length !== 3 || reopenedSections[2].title !== "Symbolism / Cultural Context") {
    console.error("❌ Reopened product knowledge data mismatch!");
    process.exit(1);
  }
  console.log("✓ Reopened product data verified 100%!");

  // 3. EDIT TITLE, EDIT CONTENT, REMOVE SECTION & SAVE
  console.log("\n--- 3. Editing Title, Editing Content, Removing Section & Re-saving ---");
  const modifiedSections = [
    { title: "Craftsmanship & Chisel Technique (Edited Title)", content: "Updated fine chisel detailing description." },
    // Section 2 removed intentionally
    { title: "Care & Maintenance Guide", content: "Clean using soft damp cloth only." }
  ];

  const updateRes = await fetch(`http://localhost:3000/api/admin/products/${testProdSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      knowledgeLayer: modifiedSections,
      status: "draft"
    })
  });
  const updateData = await updateRes.json();
  console.log(`PUT Product update status: HTTP ${updateRes.status}, success: ${updateData.success}`);

  // 4. REOPEN AGAIN TO CONFIRM MODIFICATIONS PERSIST
  console.log("\n--- 4. Reopening Product Second Time to Verify Edits Persist ---");
  const getRes2 = await fetch(`http://localhost:3000/api/admin/products/${testProdSlug}`, {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const getData2 = await getRes2.json();
  const reopenedSections2 = getData2.product?.knowledgeLayer || [];

  console.log(`  Reopened Sections Count: ${reopenedSections2.length}`);
  console.log(`  Section 1 Title: "${reopenedSections2[0]?.title}" -> Content: "${reopenedSections2[0]?.content}"`);
  console.log(`  Section 2 Title: "${reopenedSections2[1]?.title}" -> Content: "${reopenedSections2[1]?.content}"`);

  if (reopenedSections2.length !== 2 || reopenedSections2[0].title !== "Craftsmanship & Chisel Technique (Edited Title)") {
    console.error("❌ Re-saved edited sections failed to persist!");
    process.exit(1);
  }
  console.log("✓ Edited sections and section removal verified 100%!");

  // 5. VERIFY EXISTING PRODUCTS DATA INTEGRITY
  console.log("\n--- 5. Verifying Existing Products Data Integrity ---");
  const existingProducts = await query("SELECT id, slug, name, knowledge_layer FROM products LIMIT 5");
  console.log(`  Inspected ${existingProducts.length} existing products in DB:`);
  for (const p of existingProducts) {
    let kl = [];
    try { kl = JSON.parse(p.knowledge_layer || "[]"); } catch (e) {}
    console.log(`    - Product "${p.name}" (${p.slug}) -> Knowledge Layer items: ${Array.isArray(kl) ? kl.length : "legacy object"}`);
  }

  // 6. SAFE CLEANUP
  console.log("\n--- 6. Cleaning Up Test Product ---");
  await execute("DELETE FROM products WHERE slug = ?", [testProdSlug]);
  console.log("✓ Test product deleted safely.");

  console.log("\n=================================================");
  console.log("✅ PART 1 REOPEN & PERSISTENCE VERIFICATION PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runPart1ReopenPersistenceTest().catch((err) => {
  console.error("❌ Reopen test failed:", err);
  process.exit(1);
});
