import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// simple env parser
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

async function checkDatabase() {
  const connectionString = process.env.DATABASE_URL || "mysql://root:password@localhost:3306/jaipur_stonecraft";
  console.log("Connecting to:", connectionString);
  try {
    const conn = await mysql.createConnection(connectionString);
    console.log("Connected successfully!");

    const [tables] = await conn.query("SHOW TABLES");
    console.log("Tables:", tables);

    const [productCount] = await conn.query("SELECT COUNT(*) as total FROM products");
    console.log("Total products count in MySQL:", productCount[0].total);

    const [products] = await conn.query("SELECT id, sku, slug, name, status, parent_category, parent_collection, product_type FROM products LIMIT 20");
    console.log("Sample products:", JSON.stringify(products, null, 2));

    const [statuses] = await conn.query("SELECT status, COUNT(*) as count FROM products GROUP BY status");
    console.log("Status breakdown:", statuses);

    const [imagesCount] = await conn.query("SELECT COUNT(*) as total FROM product_images");
    console.log("Total product images count:", imagesCount[0].total);

    await conn.end();
  } catch (err) {
    console.error("Database connection error:", err);
  }
}

checkDatabase();
