import { query, initDB } from "../lib/db/client.js";
import fs from "fs";

async function run() {
  await initDB();
  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, slug ASC");
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, slug ASC");
  const products = await query("SELECT id, slug, sku, name, parent_collection, parent_subcategory, parent_category, status FROM products ORDER BY id ASC");

  const sculpturesStatues = {
    collection: collections.find(c => c.slug === "sculptures-statues"),
    subcategories: subcategories.filter(s => s.parent_collection_slug === "sculptures-statues"),
    categories: categories.filter(c => c.parent_collection_slug === "sculptures-statues"),
    products: products.filter(p => p.parent_collection === "sculptures-statues")
  };

  const baseline = {
    timestamp: new Date().toISOString(),
    totalCollections: collections.length,
    totalSubcategories: subcategories.length,
    totalCategories: categories.length,
    totalProducts: products.length,
    sculpturesStatues,
    collections,
    subcategories,
    categories,
    products
  };

  fs.writeFileSync("scripts/baseline-snapshot.json", JSON.stringify(baseline, null, 2));
  console.log("=== BASELINE SNAPSHOT CAPTURED ===");
  console.log(`Total Collections: ${collections.length}`);
  console.log(`Total Subcategories: ${subcategories.length}`);
  console.log(`Total Categories: ${categories.length}`);
  console.log(`Total Products: ${products.length} (Published: ${products.filter(p => p.status === 'published').length}, Draft: ${products.filter(p => p.status === 'draft').length})`);
  console.log("\nProtected Sculptures & Statues Baseline:");
  console.log(`  Subcategories: ${sculpturesStatues.subcategories.length}`);
  console.log(`  Categories: ${sculpturesStatues.categories.length}`);
  console.log(`  Products: ${sculpturesStatues.products.length} (Published: ${sculpturesStatues.products.filter(p => p.status === 'published').length}, Draft: ${sculpturesStatues.products.filter(p => p.status === 'draft').length})`);

  process.exit(0);
}

run().catch(err => {
  console.error("Baseline capture failed:", err);
  process.exit(1);
});
