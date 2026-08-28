import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');
const db = new Database(dbPath);

const categories = db.prepare(`
  SELECT 
    c.id, c.slug, c.name, c.parent_collection_slug, c.parent_subcategory_slug,
    COUNT(p.id) as product_count
  FROM categories c
  LEFT JOIN products p ON (p.parent_category = c.slug AND p.status = 'published')
  GROUP BY c.slug
  ORDER BY c.parent_collection_slug, c.parent_subcategory_slug, c.slug
`).all();

const populated = categories.filter(c => c.product_count > 0);
const empty = categories.filter(c => c.product_count === 0);

console.log(`TOTAL CATEGORIES: ${categories.length}`);
console.log(`POPULATED (>0 PRODUCTS): ${populated.length}`);
console.log(`EMPTY (0 PRODUCTS): ${empty.length}`);

console.log("\n=== 20 EMPTY CATEGORIES IN SQLITE ===");
empty.forEach((c, idx) => {
  console.log(`${idx + 1}. [${c.slug}] ${c.name} (Parent: ${c.parent_subcategory_slug} / ${c.parent_collection_slug})`);
});

db.close();
