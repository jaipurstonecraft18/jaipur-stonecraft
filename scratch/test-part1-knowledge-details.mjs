import crypto from 'crypto';
import fs from 'fs';
import { getOne, execute } from '../lib/db/client.js';

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

async function runPart1KnowledgeTest() {
  console.log("=================================================");
  console.log("PART 1 — PRODUCT KNOWLEDGE & DETAILS SYSTEM AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();
  const uniqueId = Date.now().toString().slice(-4);
  const testProdSlug = `test-part1-knowledge-${uniqueId}`;

  // 1. CREATE PRODUCT WITH DYNAMIC KNOWLEDGE SECTIONS
  console.log("--- 1. Testing Product Creation with Dynamic Knowledge Sections ---");
  const initialSections = [
    { title: "Craftsmanship & Technique", content: "Hand-carved using traditional chisel techniques in Jaipur." },
    { title: "Material Origin & Characteristics", content: "Makrana pure white marble quarried in Rajasthan." },
    { title: "Symbolism / Cultural Context", content: "Represents wisdom and obstacle removal." }
  ];

  const createRes = await fetch("http://localhost:3000/api/admin/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      name: `Knowledge Test Statue ${uniqueId}`,
      slug: testProdSlug,
      sku: `SKU-KNOW-${uniqueId}`,
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
    console.error("❌ Product creation with dynamic knowledge sections failed!");
    process.exit(1);
  }

  // Verify stored JSON array in DB
  const dbRow1 = await getOne("SELECT knowledge_layer FROM products WHERE slug = ?", [testProdSlug]);
  let storedSections1 = [];
  try { storedSections1 = JSON.parse(dbRow1.knowledge_layer); } catch (e) {}

  console.log(`  Stored sections count in DB: ${storedSections1.length}`);
  if (storedSections1.length !== 3 || storedSections1[0].title !== "Craftsmanship & Technique") {
    console.error("❌ DB storage mismatch for dynamic knowledge sections!");
    process.exit(1);
  }
  console.log("✓ Dynamic Knowledge Sections saved to DB cleanly!");

  // 2. EDIT / ADD / REMOVE SECTIONS
  console.log("\n--- 2. Testing Section Add, Edit & Removal ---");
  const updatedSections = [
    { title: "Craftsmanship & Technique", content: "Hand-carved with high-precision fine detail." },
    { title: "Care & Maintenance", content: "Clean gently with soft cloth and natural water." }
  ];

  const updateRes = await fetch(`http://localhost:3000/api/admin/products/${testProdSlug}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      knowledgeLayer: updatedSections,
      status: "draft"
    })
  });
  const updateData = await updateRes.json();
  console.log(`PUT Product status: HTTP ${updateRes.status}, success: ${updateData.success}`);

  const dbRow2 = await getOne("SELECT knowledge_layer FROM products WHERE slug = ?", [testProdSlug]);
  let storedSections2 = [];
  try { storedSections2 = JSON.parse(dbRow2.knowledge_layer); } catch (e) {}

  console.log(`  Updated stored sections count in DB: ${storedSections2.length}`);
  console.log(`  Section 1 Title: "${storedSections2[0]?.title}"`);
  console.log(`  Section 2 Title: "${storedSections2[1]?.title}"`);

  if (storedSections2.length !== 2 || storedSections2[1].title !== "Care & Maintenance") {
    console.error("❌ Section update/removal verification failed!");
    process.exit(1);
  }

  // 3. SAFE CLEANUP
  console.log("\n--- 3. Cleaning Up Test Data ---");
  await execute("DELETE FROM products WHERE slug = ?", [testProdSlug]);
  console.log("✓ Test product deleted safely.");

  console.log("\n=================================================");
  console.log("✅ PART 1 — PRODUCT KNOWLEDGE & DETAILS VERIFIED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runPart1KnowledgeTest().catch((err) => {
  console.error("❌ Part 1 test failed:", err);
  process.exit(1);
});
