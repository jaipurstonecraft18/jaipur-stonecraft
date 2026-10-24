import { query, getOne, initDB } from "../lib/db/client.js";
import { collectionsData } from "../content/collections.js";
import { categoriesData } from "../content/categories.js";

async function main() {
  await initDB();

  console.log("=== 1. DATABASE COLLECTIONS ===");
  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  console.log(`Total DB Collections: ${collections.length}`);
  for (const c of collections) {
    const [prodCount] = await query("SELECT count(*) as count FROM products WHERE parent_collection = ?", [c.slug]);
    console.log(`  - [${c.id}] slug: "${c.slug}" | name: "${c.name}" | is_active: ${c.is_active} | products: ${prodCount.count}`);
  }

  console.log("\n=== 2. DATABASE SUBCATEGORIES ===");
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, id ASC");
  console.log(`Total DB Subcategories: ${subcategories.length}`);
  for (const s of subcategories) {
    const [prodCount] = await query("SELECT count(*) as count, sum(case when status='published' then 1 else 0 end) as pub FROM products WHERE parent_subcategory = ?", [s.slug]);
    const childCats = await query("SELECT count(*) as count FROM categories WHERE parent_subcategory_slug = ?", [s.slug]);
    console.log(`  - [${s.id}] slug: "${s.slug}" | parent_col: "${s.parent_collection_slug}" | name: "${s.name}" | is_active: ${s.is_active} | child_cats: ${childCats[0].count} | prods: ${prodCount.count} (pub: ${prodCount.pub || 0})`);
  }

  console.log("\n=== 3. DATABASE CATEGORIES ===");
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, id ASC");
  console.log(`Total DB Categories: ${categories.length}`);
  for (const cat of categories) {
    const [prodCount] = await query("SELECT count(*) as count, sum(case when status='published' then 1 else 0 end) as pub, sum(case when status='draft' then 1 else 0 end) as draft FROM products WHERE parent_category = ?", [cat.slug]);
    console.log(`  - [${cat.id}] slug: "${cat.slug}" | parent_col: "${cat.parent_collection_slug}" | parent_sub: "${cat.parent_subcategory_slug}" | name: "${cat.name}" | is_active: ${cat.is_active} | prods: ${prodCount.count} (pub: ${prodCount.pub || 0}, draft: ${prodCount.draft || 0})`);
  }

  console.log("\n=== 4. PRODUCT TAXONOMY SUMMARY ===");
  const [totalProds] = await query("SELECT count(*) as count FROM products");
  const prodStatusCounts = await query("SELECT status, count(*) as count FROM products GROUP BY status");
  console.log(`Total Products: ${totalProds.count}`);
  console.log("Status Breakdown:", prodStatusCounts);

  console.log("\n=== 5. PRODUCTS WITH UNMATCHED / SUSPICIOUS TAXONOMY ===");
  const colSlugs = new Set(collections.map(c => c.slug));
  const subSlugs = new Set(subcategories.map(s => s.slug));
  const catSlugs = new Set(categories.map(c => c.slug));

  const allProducts = await query("SELECT id, sku, slug, name, status, parent_collection, parent_subcategory, parent_category FROM products");
  let invalidCol = 0, invalidSub = 0, invalidCat = 0;
  for (const p of allProducts) {
    if (!colSlugs.has(p.parent_collection)) invalidCol++;
    if (!subSlugs.has(p.parent_subcategory)) invalidSub++;
    if (!catSlugs.has(p.parent_category)) invalidCat++;
  }
  console.log(`Products with parent_collection not in DB collections: ${invalidCol}`);
  console.log(`Products with parent_subcategory not in DB subcategories: ${invalidSub}`);
  console.log(`Products with parent_category not in DB categories: ${invalidCat}`);

  console.log("\n=== 6. PROTECTED SCULPTURES & STATUES INTEGRITY BASELINE ===");
  const [sculptureProdCount] = await query("SELECT count(*) as count, sum(case when status='published' then 1 else 0 end) as pub, sum(case when status='draft' then 1 else 0 end) as draft FROM products WHERE parent_collection = 'sculptures-statues'");
  console.log(`Sculptures & Statues total products: ${sculptureProdCount.count} (published: ${sculptureProdCount.pub}, draft: ${sculptureProdCount.draft})`);

  process.exit(0);
}

main().catch(err => {
  console.error("Forensic audit error:", err);
  process.exit(1);
});
