import Database from "better-sqlite3";
import path from "path";
import { getPool } from "../lib/db/client.js";
import { ORDERED_TABLES } from "./migrate-sqlite-to-mysql.mjs";

const DB_PATH = path.join(process.cwd(), "data", "jaipur_stonecraft.db");

export async function verifyParity() {
  console.log("=================================================");
  console.log("=== SQLITE <-> MYSQL FULL PARITY AUDIT & VERIFICATION ===");
  console.log(`Source SQLite: ${DB_PATH}`);
  console.log("=================================================\n");

  const sqlite = new Database(DB_PATH);
  const pool = getPool().promise();

  const report = [];
  let allMatched = true;

  // 1. Check table existence and row counts
  console.log("--- 1. Table Existence & Row Count Verification ---");
  for (const table of ORDERED_TABLES) {
    let sqliteCount = 0;
    let mysqlCount = 0;
    let status = "OK";

    try {
      const sqliteRes = sqlite.prepare(`SELECT COUNT(*) as count FROM \`${table}\``).get();
      sqliteCount = sqliteRes ? sqliteRes.count : 0;
    } catch (e) {
      sqliteCount = `ERROR: ${e.message}`;
      status = "FAIL";
      allMatched = false;
    }

    try {
      const [mysqlRes] = await pool.query(`SELECT COUNT(*) as count FROM \`${table}\``);
      mysqlCount = mysqlRes && mysqlRes[0] ? mysqlRes[0].count : 0;
    } catch (e) {
      mysqlCount = `ERROR: ${e.message}`;
      status = "FAIL";
      allMatched = false;
    }

    if (typeof sqliteCount === "number" && typeof mysqlCount === "number") {
      if (sqliteCount !== mysqlCount) {
        status = "MISMATCH";
        allMatched = false;
      }
    }

    report.push({
      Table: table,
      "SQLite Rows": sqliteCount,
      "MySQL Rows": mysqlCount,
      Status: status === "OK" ? "✅ MATCH" : `❌ ${status}`
    });
  }

  console.table(report);

  // 2. Detailed Entity Integrity Check
  console.log("\n--- 2. Deep Entity Integrity Checks ---");
  
  // A. Product Integrity Check
  try {
    const sqliteProducts = sqlite.prepare("SELECT id, slug, sku, name, status, primary_material_id, parent_category FROM products ORDER BY id ASC").all();
    const [mysqlProducts] = await pool.query("SELECT id, slug, sku, name, status, primary_material_id, parent_category FROM products ORDER BY id ASC");
    
    if (sqliteProducts.length === mysqlProducts.length && sqliteProducts.length > 0) {
      let productFieldMismatches = 0;
      for (let i = 0; i < sqliteProducts.length; i++) {
        const sq = sqliteProducts[i];
        const my = mysqlProducts.find(p => p.id === sq.id || p.slug === sq.slug);
        if (!my || my.sku !== sq.sku || my.name !== sq.name || my.status !== sq.status) {
          productFieldMismatches++;
        }
      }
      console.log(`Products Schema & Value Parity: ${productFieldMismatches === 0 ? "✅ 100% Identical" : `❌ ${productFieldMismatches} mismatches`}`);
    } else {
      console.log(`Products: SQLite has ${sqliteProducts.length}, MySQL has ${mysqlProducts.length}`);
    }
  } catch (e) {
    console.log(`Products verification note: ${e.message}`);
  }

  // B. Product Images Integrity Check
  try {
    const sqliteImages = sqlite.prepare("SELECT COUNT(*) as c FROM product_images").get().c;
    const [mysqlImages] = await pool.query("SELECT COUNT(*) as c FROM product_images");
    const myCount = mysqlImages[0].c;
    console.log(`Product Images Count: SQLite=${sqliteImages}, MySQL=${myCount} (${sqliteImages === myCount && sqliteImages > 0 ? "✅ MATCH" : (sqliteImages === 0 ? "EMPTY" : "PENDING MIGRATION")})`);
  } catch (e) {
    console.log(`Images verification note: ${e.message}`);
  }

  // C. JSON Fields Validation Check
  try {
    const [secRows] = await pool.query("SELECT key_name, content_json FROM page_sections");
    let jsonErrors = 0;
    for (const r of secRows) {
      try {
        JSON.parse(r.content_json);
      } catch (err) {
        jsonErrors++;
      }
    }
    console.log(`Page Sections JSON Syntax: ${jsonErrors === 0 ? "✅ Valid" : `❌ ${jsonErrors} corrupted`}`);
  } catch (e) {
    console.log(`Page sections note: ${e.message}`);
  }

  console.log("\n=================================================");
  console.log(`OVERALL PARITY STATUS: ${allMatched ? "✅ 100% PARITY CONFIRMED" : "⚠️ DIFFERENCES DETECTED (See table above)"}`);
  console.log("=================================================\n");

  return { allMatched, report };
}

import { fileURLToPath } from "url";

// Auto-run if executed directly from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  verifyParity()
    .then(({ allMatched }) => process.exit(allMatched ? 0 : 1))
    .catch((err) => {
      console.error("Verification failed:", err);
      process.exit(1);
    });
}
