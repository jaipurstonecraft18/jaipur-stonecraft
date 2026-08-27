import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');
const db = new Database(dbPath);

const collections = db.prepare("SELECT * FROM collections ORDER BY id ASC").all();
console.log("COLLECTIONS_JSON:", JSON.stringify(collections, null, 2));

const subcategories = db.prepare("SELECT * FROM subcategories ORDER BY id ASC").all();
console.log("SUBCATEGORIES_JSON:", JSON.stringify(subcategories, null, 2));

const categories = db.prepare("SELECT * FROM categories ORDER BY id ASC").all();
console.log("CATEGORIES_JSON:", JSON.stringify(categories, null, 2));

const categoryProductCounts = db.prepare(`
  SELECT c.slug, c.name, c.parent_collection_slug, c.parent_subcategory_slug, COUNT(p.id) as count
  FROM categories c
  LEFT JOIN products p ON (p.parent_category = c.slug AND p.status = 'published')
  GROUP BY c.slug
  ORDER BY c.parent_collection_slug, c.parent_subcategory_slug, c.slug
`).all();

console.log("CATEGORY_PRODUCT_COUNTS:", JSON.stringify(categoryProductCounts, null, 2));

db.close();
