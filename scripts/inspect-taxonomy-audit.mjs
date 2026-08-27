import path from 'path';
import fs from 'fs';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');
const db = new Database(dbPath);

console.log("=== COLLECTIONS INVENTORY ===");
const collections = db.prepare("SELECT * FROM collections ORDER BY id ASC").all();
console.table(collections.map(c => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  cover_image: c.image_src || c.cover_image || 'None',
  status: 'active',
  route: `/collections/${c.slug}`
})));

console.log("\n=== SUBCATEGORIES INVENTORY (Sample) ===");
const subcategories = db.prepare("SELECT * FROM subcategories ORDER BY id ASC").all();
console.log(`Total Subcategories Count: ${subcategories.length}`);
console.table(subcategories.slice(0, 10).map(s => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  parent_collection: s.parent_collection_slug,
  status: 'active',
  route: `/collections/${s.parent_collection_slug}/${s.slug}`
})));

console.log("\n=== CATEGORIES INVENTORY (Sample) ===");
const categories = db.prepare("SELECT * FROM categories ORDER BY id ASC").all();
console.log(`Total Categories Count: ${categories.length}`);
console.table(categories.slice(0, 10).map(c => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  parent_collection: c.parent_collection_slug,
  parent_subcategory: c.parent_subcategory_slug,
  status: 'active',
  route: `/collections/${c.parent_collection_slug}/${c.parent_subcategory_slug}/${c.slug}`
})));

console.log("\n=== PRODUCTS COUNT BY STATUS ===");
const statusCounts = db.prepare("SELECT status, COUNT(*) as count FROM products GROUP BY status").all();
console.table(statusCounts);

console.log("\n=== PRODUCTS PER CATEGORY ===");
const catCounts = db.prepare(`
  SELECT c.slug, c.name, COUNT(p.id) as product_count 
  FROM categories c
  LEFT JOIN products p ON (p.parent_category = c.slug AND p.status = 'published')
  GROUP BY c.slug
  ORDER BY product_count DESC
`).all();

console.log(`Total Categories Audited: ${catCounts.length}`);
const emptyCats = catCounts.filter(c => c.product_count === 0);
const populatedCats = catCounts.filter(c => c.product_count > 0);
console.log(`Populated Categories: ${populatedCats.length}, Empty Categories: ${emptyCats.length}`);
console.table(populatedCats.slice(0, 15));

db.close();
