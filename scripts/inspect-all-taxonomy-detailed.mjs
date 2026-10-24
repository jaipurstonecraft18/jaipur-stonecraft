import { query, initDB } from "../lib/db/client.js";
import { collectionsData } from "../content/collections.js";
import { categoriesData } from "../content/categories.js";

async function main() {
  await initDB();

  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — COMPLETE TAXONOMY FORENSIC AUDIT");
  console.log("==================================================\n");

  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, slug ASC");
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, slug ASC");
  const products = await query("SELECT * FROM products");

  console.log("--- 1. COLLECTIONS (" + collections.length + ") ---");
  for (const c of collections) {
    const prods = products.filter(p => p.parent_collection === c.slug);
    const pub = prods.filter(p => p.status === 'published').length;
    const subs = subcategories.filter(s => s.parent_collection_slug === c.slug);
    const cats = categories.filter(cat => cat.parent_collection_slug === c.slug);
    console.log(`[COL] ${c.slug} | "${c.name}" | is_active: ${c.is_active} | subs: ${subs.length} | cats: ${cats.length} | prods: ${prods.length} (pub: ${pub})`);
  }

  console.log("\n--- 2. SUBCATEGORIES BY COLLECTION (" + subcategories.length + ") ---");
  for (const c of collections) {
    console.log(`\nCOLLECTION: ${c.slug} (${c.name})`);
    const subs = subcategories.filter(s => s.parent_collection_slug === c.slug);
    for (const s of subs) {
      const prods = products.filter(p => p.parent_subcategory === s.slug);
      const pub = prods.filter(p => p.status === 'published').length;
      const cats = categories.filter(cat => cat.parent_subcategory_slug === s.slug);
      console.log(`  [SUB] slug: "${s.slug}" | id: "${s.id}" | name: "${s.name}" | active: ${s.is_active} | cats: ${cats.length} | prods: ${prods.length} (pub: ${pub})`);
    }
  }

  // Check subcategories with non-existent parent collection
  const orphanSubs = subcategories.filter(s => !collections.some(c => c.slug === s.parent_collection_slug));
  if (orphanSubs.length > 0) {
    console.log("\n⚠️ ORPHAN SUBCATEGORIES (invalid parent collection):", orphanSubs);
  }

  console.log("\n--- 3. CATEGORIES BY SUBCATEGORY (" + categories.length + ") ---");
  for (const c of collections) {
    console.log(`\n========================================`);
    console.log(`COLLECTION: ${c.slug} (${c.name})`);
    console.log(`========================================`);
    const subs = subcategories.filter(s => s.parent_collection_slug === c.slug);
    for (const s of subs) {
      console.log(`\n  >> SUB: ${s.slug} (${s.name}) [active: ${s.is_active}]`);
      const cats = categories.filter(cat => cat.parent_subcategory_slug === s.slug);
      for (const cat of cats) {
        const prods = products.filter(p => p.parent_category === cat.slug);
        const pub = prods.filter(p => p.status === 'published').length;
        const draft = prods.filter(p => p.status === 'draft').length;
        console.log(`     [CAT] slug: "${cat.slug}" | id: "${cat.id}" | name: "${cat.name}" | active: ${cat.is_active} | prods: ${prods.length} (pub: ${pub}, draft: ${draft})`);
      }
    }
    // Also check categories in this collection whose parent_subcategory_slug does not match any subcategory
    const unparentedCats = categories.filter(cat => cat.parent_collection_slug === c.slug && !subs.some(s => s.slug === cat.parent_subcategory_slug));
    if (unparentedCats.length > 0) {
      console.log(`\n  ⚠️ CATEGORIES WITH UNMATCHED PARENT SUBCATEGORY in ${c.slug}:`);
      for (const cat of unparentedCats) {
        const prods = products.filter(p => p.parent_category === cat.slug);
        console.log(`     [CAT] slug: "${cat.slug}" | parent_sub: "${cat.parent_subcategory_slug}" | name: "${cat.name}" | active: ${cat.is_active} | prods: ${prods.length}`);
      }
    }
  }

  // Check categories with non-existent parent collection
  const orphanCats = categories.filter(cat => !collections.some(c => c.slug === cat.parent_collection_slug));
  if (orphanCats.length > 0) {
    console.log("\n⚠️ ORPHAN CATEGORIES (invalid parent collection):", orphanCats);
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
