import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');
console.log("Checking SQLite DB at:", dbPath);

try {
  const db = new Database(dbPath);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables in SQLite:", tables.map(t => t.name));

  const count = db.prepare("SELECT COUNT(*) as total FROM products").all();
  console.log("Total products in SQLite:", count[0].total);

  const products = db.prepare("SELECT id, sku, slug, name, status, parent_category, parent_collection, product_type FROM products LIMIT 10").all();
  console.log("Sample SQLite products:", JSON.stringify(products, null, 2));

  const statusCount = db.prepare("SELECT status, COUNT(*) as count FROM products GROUP BY status").all();
  console.log("SQLite status breakdown:", statusCount);

  db.close();
} catch (err) {
  console.error("Error reading SQLite DB:", err);
}
