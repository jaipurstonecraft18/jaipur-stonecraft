import Database from "better-sqlite3";
import path from "path";
import mysql from "mysql2/promise";
import { initDB, getPool } from "../lib/db/client.js";

const DB_PATH = path.join(process.cwd(), "data", "jaipur_stonecraft.db");

async function migrateData() {
  console.log("=== STARTING SQLITE TO MYSQL MIGRATION ===");
  console.log(`Reading SQLite database from: ${DB_PATH}`);

  const sqlite = new Database(DB_PATH);
  await initDB();
  const pool = getPool();

  const tables = [
    "collections",
    "subcategories",
    "categories",
    "materials",
    "subjects",
    "product_types",
    "attribute_definitions",
    "products",
    "product_images"
  ];

  for (const table of tables) {
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
    console.log(`Migrating ${rows.length} rows from table '${table}'...`);

    if (rows.length === 0) continue;

    const columns = Object.keys(rows[0]);
    const placeholders = columns.map(() => "?").join(", ");
    const colNames = columns.join(", ");

    let sql = "";
    if (table === "product_images") {
      sql = `INSERT IGNORE INTO ${table} (${colNames}) VALUES (${placeholders})`;
    } else {
      const updateAssigns = columns.filter(c => c !== "id" && c !== "slug").map(c => `${c} = VALUES(${c})`).join(", ");
      sql = `INSERT INTO ${table} (${colNames}) VALUES (${placeholders}) ${updateAssigns ? `ON DUPLICATE KEY UPDATE ${updateAssigns}` : ""}`;
    }

    for (const row of rows) {
      const values = columns.map((col) => row[col]);
      await pool.query(sql, values);
    }
  }

  console.log("✅ MIGRATION COMPLETED SUCCESSFULLY! All SQLite data copied to MySQL.");
  process.exit(0);
}

migrateData().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
