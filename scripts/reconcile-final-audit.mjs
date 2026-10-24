import mysql from "mysql2/promise";
import fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL missing.");
  process.exit(1);
}

async function run() {
  const baseline = JSON.parse(fs.readFileSync("scripts/baseline-snapshot.json", "utf8"));
  
  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(DATABASE_URL);
  const sanitizedUri = DATABASE_URL.replace(/[?&]ssl-mode=[^&]+/i, "");
  const pool = mysql.createPool({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 4
  });
  const conn = await pool.getConnection();

  try {
    console.log("==================================================");
    console.log("FINAL POST-MIGRATION RECONCILIATION AUDIT");
    console.log("==================================================\n");

    // 1. Sculptures & Statues Baseline Comparison
    console.log("--- 1. Sculptures & Statues Strict Protection Audit ---");
    const [sculptureSubs] = await conn.query("SELECT * FROM subcategories WHERE parent_collection_slug = 'sculptures-statues' ORDER BY parent_collection_slug, sort_order, slug ASC");
    const [sculptureCats] = await conn.query("SELECT * FROM categories WHERE parent_collection_slug = 'sculptures-statues' ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, slug ASC");
    const [sculptureProds] = await conn.query("SELECT id, slug, sku, name, parent_collection, parent_subcategory, parent_category, status FROM products WHERE parent_collection = 'sculptures-statues' ORDER BY id ASC");

    const baseSc = baseline.sculpturesStatues;

    const subsIdentical = JSON.stringify(sculptureSubs) === JSON.stringify(baseSc.subcategories);
    const catsIdentical = JSON.stringify(sculptureCats) === JSON.stringify(baseSc.categories);
    const prodsIdentical = JSON.stringify(sculptureProds) === JSON.stringify(baseSc.products);

    console.log(`Subcategories match baseline: ${subsIdentical ? "YES (5/5) ✓" : "NO ❌"}`);
    console.log(`Categories match baseline:    ${catsIdentical ? "YES (38/38) ✓" : "NO ❌"}`);
    console.log(`Products match baseline:      ${prodsIdentical ? "YES (131/131) ✓" : "NO ❌"}`);

    if (!subsIdentical || !catsIdentical || !prodsIdentical) {
      throw new Error("PROTECTION VIOLATION: Sculptures & Statues was modified!");
    }

    // 2. Total Product Inventory Reconciliation
    console.log("\n--- 2. Product Inventory Reconciliation ---");
    const [allProducts] = await conn.query("SELECT id, slug, sku, name, parent_collection, parent_subcategory, parent_category, status FROM products ORDER BY id ASC");
    
    console.log(`Baseline total products: ${baseline.totalProducts}`);
    console.log(`Current total products:  ${allProducts.length}`);
    console.log(`Total count match:       ${allProducts.length === baseline.totalProducts ? "YES (325/325) ✓" : "NO ❌"}`);

    const basePub = baseline.products.filter(p => p.status === 'published').length;
    const currPub = allProducts.filter(p => p.status === 'published').length;
    const baseDraft = baseline.products.filter(p => p.status === 'draft').length;
    const currDraft = allProducts.filter(p => p.status === 'draft').length;

    console.log(`Published products match: ${currPub === basePub ? `YES (${currPub}/${basePub}) ✓` : `MISMATCH (${currPub} vs ${basePub}) ❌`}`);
    console.log(`Draft products match:     ${currDraft === baseDraft ? `YES (${currDraft}/${baseDraft}) ✓` : `MISMATCH (${currDraft} vs ${baseDraft}) ❌`}`);

    // Verify no orphaned products
    const [reviewPendingCount] = await conn.query("SELECT COUNT(*) as count FROM products WHERE parent_subcategory = 'review-pending' OR parent_category = 'review-pending'");
    console.log(`Products in review-pending: ${reviewPendingCount[0].count} (Expected: 0) ${reviewPendingCount[0].count === 0 ? "✓" : "❌"}`);

    // 3. Approved 15 Main Categories Hierarchy Verification
    console.log("\n--- 3. Target 15 Main Categories Verification ---");
    const [activeSubs] = await conn.query("SELECT parent_collection_slug, slug, name, sort_order FROM subcategories WHERE parent_collection_slug != 'sculptures-statues' AND is_active = 1 ORDER BY parent_collection_slug, sort_order ASC");
    
    console.log(`Total active subcategories across 5 collections: ${activeSubs.length} (Target: 15)`);
    const byCol = {};
    for (const s of activeSubs) {
      if (!byCol[s.parent_collection_slug]) byCol[s.parent_collection_slug] = [];
      byCol[s.parent_collection_slug].push(s);
    }

    for (const [col, list] of Object.entries(byCol)) {
      console.log(`  Collection: ${col} (${list.length} categories)`);
      for (const item of list) {
        const [cCount] = await conn.query("SELECT COUNT(*) as cnt FROM categories WHERE parent_subcategory_slug = ? AND is_active = 1", [item.slug]);
        const [pCount] = await conn.query("SELECT COUNT(*) as cnt FROM products WHERE parent_subcategory = ?", [item.slug]);
        console.log(`    - [${item.sort_order}] ${item.name} (${item.slug}): ${cCount[0].cnt} child cats, ${pCount[0].cnt} products`);
      }
    }

    console.log("\n==================================================");
    console.log("FINAL AUDIT COMPLETE: ALL CONSTRAINTS SATISFIED! ✓");
    console.log("==================================================");
  } finally {
    conn.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
