import { query, initDB } from "../lib/db/client.js";

async function main() {
  await initDB();
  const cats = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, slug");
  const subs = await query("SELECT slug, is_active FROM subcategories");
  const subMap = Object.fromEntries(subs.map(s => [s.slug, s.is_active]));
  const products = await query("SELECT parent_category, count(*) as count FROM products GROUP BY parent_category");
  const prodMap = Object.fromEntries(products.map(p => [p.parent_category, p.count]));

  console.log("Total categories in DB:", cats.length);
  const withProds = cats.filter(c => (prodMap[c.slug] || 0) > 0);
  const withoutProds = cats.filter(c => (prodMap[c.slug] || 0) === 0);
  console.log("Categories with products:", withProds.length);
  console.log("Categories without products (empty):", withoutProds.length);

  const activeEmpty = withoutProds.filter(c => c.is_active === 1);
  const inactiveEmpty = withoutProds.filter(c => c.is_active === 0);
  console.log("Empty & is_active = 1:", activeEmpty.length);
  console.log("Empty & is_active = 0:", inactiveEmpty.length);

  console.log("\n--- Details of Empty & is_active = 1 Categories ---");
  for (const c of activeEmpty) {
    const parentSubActive = subMap[c.parent_subcategory_slug];
    console.log(`[${c.parent_collection_slug}] -> [${c.parent_subcategory_slug} (sub_active:${parentSubActive})] -> ${c.slug} ("${c.name}")`);
  }

  console.log("\n--- Details of Empty & is_active = 0 Categories ---");
  for (const c of inactiveEmpty) {
    const parentSubActive = subMap[c.parent_subcategory_slug];
    console.log(`[${c.parent_collection_slug}] -> [${c.parent_subcategory_slug} (sub_active:${parentSubActive})] -> ${c.slug} ("${c.name}")`);
  }

  process.exit(0);
}

main().catch(console.error);
