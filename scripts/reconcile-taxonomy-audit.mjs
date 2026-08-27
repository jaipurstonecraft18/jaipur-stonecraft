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

console.log(`TOTAL CATEGORIES IN SQLITE: ${categories.length}`);
console.log(JSON.stringify(categories, null, 2));

db.close();
