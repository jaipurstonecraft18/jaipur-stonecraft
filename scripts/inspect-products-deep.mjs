import { query, initDB } from "../lib/db/client.js";
import fs from "fs";

async function run() {
  await initDB();
  const collections = ["temples-architectural-stonework", "wall-art-reliefs", "fountains-water-features", "decorative-stone-art", "custom-bespoke-creations"];

  for (const col of collections) {
    console.log(`\n======================================================`);
    console.log(`COLLECTION: ${col}`);
    console.log(`======================================================`);

    const subs = await query("SELECT * FROM subcategories WHERE parent_collection_slug = ? ORDER BY is_active DESC, sort_order ASC, slug ASC", [col]);
    console.log(`-- SUBCATEGORIES (${subs.length}) --`);
    for (const s of subs) {
      console.log(`  [SUB] ${s.slug} | "${s.name}" | active: ${s.is_active}`);
    }

    const cats = await query("SELECT * FROM categories WHERE parent_collection_slug = ? ORDER BY is_active DESC, parent_subcategory_slug ASC, sort_order ASC, slug ASC", [col]);
    console.log(`-- CATEGORIES (${cats.length}) --`);
    for (const c of cats) {
      const pCount = (await query("SELECT COUNT(*) as cnt FROM products WHERE parent_category = ?", [c.slug]))[0].cnt;
      console.log(`  [CAT] ${c.slug} (parent_sub: ${c.parent_subcategory_slug}) | "${c.name}" | active: ${c.is_active} | products: ${pCount}`);
    }

    const prods = await query("SELECT id, slug, name, parent_subcategory, parent_category, status FROM products WHERE parent_collection = ? ORDER BY parent_category ASC, id ASC", [col]);
    console.log(`-- PRODUCTS (${prods.length}) --`);
    const byCat = {};
    for (const p of prods) {
      const key = `${p.parent_subcategory} -> ${p.parent_category}`;
      if (!byCat[key]) byCat[key] = [];
      byCat[key].push(p);
    }
    for (const [key, list] of Object.entries(byCat)) {
      console.log(`  Key: ${key} (${list.length} products, pub: ${list.filter(p => p.status === 'published').length}, draft: ${list.filter(p => p.status === 'draft').length})`);
      list.forEach(p => console.log(`      ${p.id} | ${p.name} | status: ${p.status}`));
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
