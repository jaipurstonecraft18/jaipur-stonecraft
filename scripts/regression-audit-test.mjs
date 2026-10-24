import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

async function runRegressionTests() {
  console.log("==========================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY MIGRATION REGRESSION SUITE");
  console.log("==========================================================\n");

  const connectionString = process.env.DATABASE_URL || "";
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing.");
  }

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(connectionString);
  const sanitizedUri = connectionString.replace(/[?&]ssl-mode=[^&]+/i, "");

  const conn = await mysql.createConnection({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    connectTimeout: 10000
  });

  const mapping = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "migration-mapping.json"), "utf8"));
  const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

  let passed = 0;
  let failed = 0;
  const failureLog = [];

  function assert(condition, testName, details = "") {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
      failureLog.push({ testName, details });
    }
  }

  console.log("--- TEST GROUP 1: Product Inventory Parity & Counts ---");
  const [prodCountRes] = await conn.query("SELECT COUNT(*) as cnt FROM products");
  assert(prodCountRes[0].cnt === 320, "Total product count matches baseline exactly (320)");

  const [sculptCountRes] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE parent_collection = 'sculptures-statues'");
  assert(sculptCountRes[0].cnt === 127, "Protected Sculptures & Statues count remains 127");

  const [nonSculptCountRes] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE parent_collection != 'sculptures-statues'");
  assert(nonSculptCountRes[0].cnt === 193, "Total Non-Sculptures count remains 193");

  const [dupIdRes] = await conn.query("SELECT id, COUNT(*) as cnt FROM products GROUP BY id HAVING cnt > 1");
  assert(dupIdRes.length === 0, "Zero duplicate product IDs created in database");

  const [dupSlugRes] = await conn.query("SELECT slug, COUNT(*) as cnt FROM products GROUP BY slug HAVING cnt > 1");
  assert(dupSlugRes.length === 0, "Zero duplicate product slugs in database");

  console.log("\n--- TEST GROUP 2: Protected Sculptures & Statues Taxonomy Integrity ---");
  const [sculptProds] = await conn.query("SELECT id, parent_collection, parent_subcategory, parent_category FROM products WHERE parent_collection = 'sculptures-statues'");
  let sculptMismatches = 0;
  for (const sp of sculptProds) {
    const baseP = baseline.products.find(p => p.id === sp.id);
    if (!baseP || baseP.parent_collection !== sp.parent_collection || baseP.parent_subcategory !== sp.parent_subcategory || baseP.parent_category !== sp.parent_category) {
      sculptMismatches++;
    }
  }
  assert(sculptMismatches === 0, "100% of protected sculpture product category assignments remain untouched");

  console.log("\n--- TEST GROUP 3: Target Category Mapping Parity ---");
  const [allDbProds] = await conn.query("SELECT id, parent_collection, parent_subcategory, parent_category FROM products");
  const dbProdMap = new Map(allDbProds.map(p => [p.id, p]));
  let mappingMismatches = 0;
  for (const m of mapping) {
    const dbP = dbProdMap.get(m.productId);
    if (!dbP) {
      mappingMismatches++;
      continue;
    }
    if (dbP.parent_collection !== m.targetCollection || dbP.parent_category !== m.targetCategory) {
      mappingMismatches++;
    }
  }
  assert(mappingMismatches === 0, "All 320 products in DB match target mapping specification 1:1");

  console.log("\n--- TEST GROUP 4: Category Boundaries & No Category Mixing ---");
  // 4A: Jali isolation
  const [jaliProds] = await conn.query("SELECT id, name, parent_collection, parent_subcategory, parent_category FROM products WHERE parent_category IN ('marble-jali-designs', 'balcony-staircase-jali', 'jali-for-partitions', 'window-jali')");
  assert(jaliProds.length === 5, "Exactly 5 Jali products found in Jali categories");
  const nonArchJali = jaliProds.filter(p => p.parent_collection !== "temples-architectural-stonework" || p.parent_subcategory !== "jali");
  assert(nonArchJali.length === 0, "All Jali products exclusively live in temples-architectural-stonework -> jali");

  // 4B: Mandir vs Architectural Parts
  const [mandirProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'small-marble-mandir-for-home'");
  assert(mandirProds.length === 4, "Small marble mandirs for home segregated into dedicated category (4 items)");

  const [templePartsProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'temple-parts-designs'");
  assert(templePartsProds.length === 16, "Temple architectural parts (shikharas, mandapas, garbhagriha, pooja panels) in Temple Parts & Designs (16 items)");

  // 4C: Pillars & Arches
  const [archProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'stone-arches-door-frames'");
  assert(archProds.length === 8, "Torans and portico carvings classified into Stone Arches & Door Frames (8 items)");

  // 4D: Fountains isolation
  const [fountainProds] = await conn.query("SELECT id FROM products WHERE parent_collection = 'fountains-water-features'");
  assert(fountainProds.length === 36, "All 36 fountain products isolated in Fountains collection");
  const [tieredFountainProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'tiered-fountains'");
  assert(tieredFountainProds.length === 4, "Multi-tiered fountains in Tiered Fountains (4 items)");
  const [gardenFountainProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'garden-fountains'");
  assert(gardenFountainProds.length === 20, "Garden and courtyard fountains in Garden Fountains (20 items)");
  const [wallFountainProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'wall-fountains'");
  assert(wallFountainProds.length === 12, "Wall fountains, cascades, and spouts in Wall Fountains (12 items)");

  // 4E: Planters & Pedestals
  const [planterProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'marble-stone-planters'");
  assert(planterProds.length === 4, "Verified stone planters in Marble & Stone Planters (4 items)");
  const [pedestalProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'marble-pedestals-stands'");
  assert(pedestalProds.length === 4, "Verified display pedestals in Marble Pedestals & Stands (4 items)");

  // 4F: Wall Art & Reliefs
  const [wallMuralProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'religious-wall-murals'");
  assert(wallMuralProds.length === 4, "Spiritual wall murals in Religious Wall Murals (4 items)");
  const [floralPanelProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'floral-nature-wall-panels'");
  assert(floralPanelProds.length === 12, "Floral, botanical, and Tree of Life in Floral & Nature Wall Panels (12 items)");
  const [reliefPanelProds] = await conn.query("SELECT id FROM products WHERE parent_category = 'stone-relief-panels'");
  assert(reliefPanelProds.length === 36, "Carved relief panels in Stone Relief Panels (36 items)");

  console.log("\n--- TEST GROUP 5: Strict Material Compliance (No Granite) ---");
  const [graniteMatRes] = await conn.query("SELECT * FROM materials WHERE LOWER(name) LIKE '%granite%' OR LOWER(id) LIKE '%granite%'");
  assert(graniteMatRes.length === 0, "No granite materials present in materials table");

  const [graniteProdRes] = await conn.query("SELECT id FROM products WHERE LOWER(name) LIKE '%granite%' OR LOWER(short_description) LIKE '%granite%' OR LOWER(primary_material_id) LIKE '%granite%'");
  assert(graniteProdRes.length === 0, "Zero products contain granite references");

  console.log("\n--- TEST GROUP 6: Image Relationships & Asset Integrity ---");
  const [imgCountRes] = await conn.query("SELECT COUNT(*) as cnt FROM product_images");
  assert(imgCountRes[0].cnt >= baseline.totalProducts, `All product images intact (Total images in DB: ${imgCountRes[0].cnt})`);

  console.log("\n==========================================================");
  console.log(`REGRESSION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================================");

  await conn.end();

  if (failed > 0) {
    console.error("Test failures:", failureLog);
    process.exit(1);
  } else {
    console.log("✅ All Regression Tests Completed Successfully!");
    process.exit(0);
  }
}

runRegressionTests().catch(err => {
  console.error("Test suite runner error:", err);
  process.exit(1);
});
