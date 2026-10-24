import mysql from "mysql2/promise";
import fs from "fs";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing.");
  process.exit(1);
}

async function main() {
  console.log("==================================================");
  console.log("JAIPUR STONECRAFT — TAXONOMY CONSOLIDATION ROLLBACK");
  console.log("==================================================");

  if (!fs.existsSync("scripts/baseline-snapshot.json")) {
    console.error("Baseline snapshot file scripts/baseline-snapshot.json not found!");
    process.exit(1);
  }

  const baseline = JSON.parse(fs.readFileSync("scripts/baseline-snapshot.json", "utf8"));
  console.log(`Loaded baseline captured at ${baseline.timestamp}`);

  const isCloudSSL = /aivencloud|ssl-mode=REQUIRED/i.test(DATABASE_URL);
  const sanitizedUri = DATABASE_URL.replace(/[?&]ssl-mode=[^&]+/i, "");

  const pool = mysql.createPool({
    uri: sanitizedUri,
    ssl: isCloudSSL ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: 4
  });

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    console.log("\n[Transaction Started]");

    // 1. Restore subcategories active status and properties
    console.log("Restoring subcategories...");
    for (const sub of baseline.subcategories) {
      await conn.query(`
        UPDATE subcategories SET
          parent_collection_slug = ?,
          name = ?,
          description = ?,
          image_src = ?,
          sort_order = ?,
          is_active = ?
        WHERE slug = ?
      `, [sub.parent_collection_slug, sub.name, sub.description, sub.image_src, sub.sort_order, sub.is_active, sub.slug]);
    }

    // 2. Restore categories active status and properties
    console.log("Restoring categories...");
    for (const cat of baseline.categories) {
      await conn.query(`
        UPDATE categories SET
          parent_collection_slug = ?,
          parent_subcategory_slug = ?,
          name = ?,
          description = ?,
          image_src = ?,
          image_alt = ?,
          sort_order = ?,
          is_active = ?
        WHERE slug = ?
      `, [cat.parent_collection_slug, cat.parent_subcategory_slug, cat.name, cat.description, cat.image_src, cat.image_alt, cat.sort_order, cat.is_active, cat.slug]);
    }

    // 3. Restore product taxonomy assignments
    console.log("Restoring product taxonomy parents...");
    for (const p of baseline.products) {
      await conn.query(`
        UPDATE products SET
          parent_collection = ?,
          parent_subcategory = ?,
          parent_category = ?,
          status = ?
        WHERE id = ?
      `, [p.parent_collection, p.parent_subcategory, p.parent_category, p.status, p.id]);
    }

    await conn.commit();
    console.log("\n[Rollback Transaction Committed Successfully! ✓]");
    console.log("Database has been restored exactly to the baseline snapshot.");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ ROLLBACK FAILED:", error);
    await conn.rollback();
    process.exit(1);
  } finally {
    conn.release();
    await pool.end();
  }
}

main();
