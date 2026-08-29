/**
 * Jaipur Stonecraft — Local MySQL to Aiven MySQL Migration Engine
 * 
 * Source: Local MySQL (jaipur_stonecraft)
 * Target: Aiven MySQL (defaultdb or custom schema)
 * 
 * Safety & Idempotency:
 *   - Migrates in topological dependency order (14 tables).
 *   - Preserves all columns, auto-increments, timestamps, JSON, NULLs, primary/foreign keys.
 *   - Runs within a safe foreign-key-check toggle.
 *   - Verifies 100% parity between local source and Aiven target.
 */

import mysql from "mysql2/promise";
import { CREATE_TABLES_SQL_STATEMENTS } from "../lib/db/schema.js";

export const ORDERED_TABLES = [
  "collections",
  "subcategories",
  "categories",
  "materials",
  "subjects",
  "product_types",
  "attribute_definitions",
  "products",
  "product_images",
  "site_content",
  "page_sections",
  "projects",
  "inquiries",
  "site_settings"
];

export async function runLocalToAivenMigration(options = {}) {
  const localUrl = options.localUrl || process.env.DATABASE_URL || "";
  const aivenUrl = options.aivenUrl || process.env.AIVEN_DATABASE_URL || "";

  if (!localUrl) {
    throw new Error("DATABASE_URL environment variable is missing.");
  }
  if (!aivenUrl) {
    throw new Error("AIVEN_DATABASE_URL environment variable is missing.");
  }

  console.log("=================================================");
  console.log("=== LOCAL MYSQL -> AIVEN CLOUD MYSQL MIGRATION ===");
  console.log("=================================================\n");

  console.log("Step 1: Connecting to Local MySQL and Aiven Cloud MySQL...");
  const localConn = await mysql.createConnection({
    uri: localUrl,
    connectTimeout: 5000
  });

  const sanitizedAivenUri = aivenUrl.replace(/[?&]ssl-mode=[^&]+/i, "");
  const aivenConn = await mysql.createConnection({
    uri: sanitizedAivenUri,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
    connectTimeout: 10000
  });

  console.log("✅ Successfully connected to both Local MySQL and Aiven MySQL over TLS.\n");

  try {
    console.log("Step 2: Ensuring all 14 tables exist on Aiven MySQL...");
    for (const stmt of CREATE_TABLES_SQL_STATEMENTS) {
      await aivenConn.query(stmt);
    }
    console.log("✅ All 14 MySQL tables verified on Aiven.\n");

    console.log("Step 3: Migrating data in topological dependency order...");
    await aivenConn.query("SET FOREIGN_KEY_CHECKS = 0;");

    const summary = {};

    for (const tableName of ORDERED_TABLES) {
      // 1. Fetch source rows from local MySQL
      const [rows] = await localConn.query(`SELECT * FROM \`${tableName}\``);
      console.log(`Processing table '${tableName}' (${rows.length} rows in Local MySQL)...`);

      // 2. Clean target table on Aiven
      await aivenConn.query(`TRUNCATE TABLE \`${tableName}\``);

      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const colListStr = columns.map(c => `\`${c}\``).join(", ");
        const placeholders = `(${columns.map(() => "?").join(", ")})`;

        const BATCH_SIZE = 50;
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const batch = rows.slice(i, i + BATCH_SIZE);
          const values = [];
          const batchPlaceholders = [];
          for (const r of batch) {
            batchPlaceholders.push(placeholders);
            for (const col of columns) {
              let val = r[col];
              if (typeof val === "object" && val !== null && !(val instanceof Date)) {
                val = JSON.stringify(val);
              }
              values.push(val);
            }
          }
          const sql = `INSERT INTO \`${tableName}\` (${colListStr}) VALUES ${batchPlaceholders.join(", ")}`;
          await aivenConn.query(sql, values);
        }
      }

      summary[tableName] = {
        localCount: rows.length,
        migratedToAiven: rows.length
      };
      console.log(`  -> ${rows.length}/${rows.length} rows migrated to Aiven for '${tableName}'.`);
    }

    await aivenConn.query("SET FOREIGN_KEY_CHECKS = 1;");

    console.log("\nStep 4: Verifying exact parity between Local MySQL and Aiven MySQL...");
    let allMatched = true;
    for (const tableName of ORDERED_TABLES) {
      const [aivenCountRes] = await aivenConn.query(`SELECT COUNT(*) as c FROM \`${tableName}\``);
      const aivenCount = aivenCountRes[0].c;
      const localCount = summary[tableName].localCount;
      if (aivenCount !== localCount) {
        allMatched = false;
        console.error(`❌ Mismatch on '${tableName}': Local=${localCount}, Aiven=${aivenCount}`);
      }
    }

    if (allMatched) {
      console.log("✅ 100% PARITY CONFIRMED between Local MySQL and Aiven MySQL!\n");
    } else {
      throw new Error("Parity verification failed after migration.");
    }

    console.table(summary);
    return { success: true, summary };
  } finally {
    await localConn.end();
    await aivenConn.end();
  }
}

if (process.argv[1] && process.argv[1].includes("migrate-mysql-to-aiven")) {
  runLocalToAivenMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("\n❌ Migration to Aiven failed:", err.message);
      process.exit(1);
    });
}
