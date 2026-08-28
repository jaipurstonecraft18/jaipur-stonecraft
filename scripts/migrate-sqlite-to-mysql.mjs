import Database from "better-sqlite3";
import path from "path";
import { CREATE_TABLES_SQL_STATEMENTS } from "../lib/db/schema.js";
import { getPool } from "../lib/db/client.js";

const DB_PATH = path.join(process.cwd(), "data", "jaipur_stonecraft.db");

// Strict dependency order: parent/reference tables first, child/dependent tables next
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

// JSON columns that must be valid JSON strings
const JSON_COLUMNS = new Set([
  "knowledge_layer",
  "attributes",
  "tags",
  "variants",
  "seo",
  "synonyms",
  "iconography_elements",
  "options",
  "applies_to_product_types",
  "content_json",
  "gallery",
  "products_used",
  "value"
]);

// Boolean columns
const BOOLEAN_COLUMNS = new Set([
  "is_active",
  "featured",
  "is_sacred_grade",
  "is_featured",
  "is_new_arrival",
  "is_custom_only",
  "is_primary"
]);

export function sanitizeValue(columnName, value) {
  if (value === null || value === undefined) {
    return null;
  }

  // Boolean normalization
  if (BOOLEAN_COLUMNS.has(columnName)) {
    return value ? 1 : 0;
  }

  // JSON normalization
  if (JSON_COLUMNS.has(columnName)) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return null;
      try {
        JSON.parse(trimmed);
        return trimmed;
      } catch (e) {
        // If not valid JSON, serialize as string or return empty JSON object/array
        return JSON.stringify(value);
      }
    } else if (typeof value === "object") {
      return JSON.stringify(value);
    }
  }

  // Date normalization: convert SQLite date string to standard format if needed
  if (columnName.endsWith("_at") && typeof value === "string") {
    // Keep standard YYYY-MM-DD HH:MM:SS or ISO
    return value.replace("T", " ").replace(/\.\d+Z?$/, "");
  }

  return value;
}

export async function runMigration({ dryRun = false } = {}) {
  console.log("=================================================");
  console.log(`=== JAIPUR STONECRAFT SQLITE -> MYSQL MIGRATION ===`);
  console.log(`Mode: ${dryRun ? "DRY RUN (Verification Only)" : "LIVE EXECUTION"}`);
  console.log(`Source SQLite Database: ${DB_PATH}`);
  console.log("=================================================\n");

  const sqlite = new Database(DB_PATH);

  // Checkpoint SQLite WAL to ensure latest data is in main db
  try {
    sqlite.pragma("wal_checkpoint(TRUNCATE)");
  } catch (e) {
    console.warn("WAL checkpoint notice:", e.message);
  }

  const pool = getPool().promise();

  // 1. Ensure all 14 tables exist in MySQL
  console.log("Step 1: Ensuring all 14 MySQL tables exist...");
  for (const statement of CREATE_TABLES_SQL_STATEMENTS) {
    if (!dryRun) {
      await pool.query(statement);
    }
  }
  console.log("✅ All 14 MySQL tables verified.\n");

  const summary = {};

  // 2. Migrate each table in dependency order
  for (const table of ORDERED_TABLES) {
    const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
    summary[table] = { sqliteCount: rows.length, migratedCount: 0 };
    console.log(`Processing table '${table}' (${rows.length} rows in SQLite)...`);

    if (rows.length === 0) {
      console.log(`  -> 0 rows to migrate. Skipping.`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const colListStr = columns.map(c => `\`${c}\``).join(", ");
    const placeholders = columns.map(() => "?").join(", ");

    let sql = "";
    if (table === "product_images") {
      // product_images uses auto-increment ID
      sql = `INSERT IGNORE INTO \`${table}\` (${colListStr}) VALUES (${placeholders})`;
    } else {
      const updateAssigns = columns
        .filter(c => c !== "id" && c !== "slug" && c !== "key_name")
        .map(c => `\`${c}\` = VALUES(\`${c}\`)`)
        .join(", ");

      sql = `INSERT INTO \`${table}\` (${colListStr}) VALUES (${placeholders}) ${
        updateAssigns ? `ON DUPLICATE KEY UPDATE ${updateAssigns}` : ""
      }`;
    }

    let successCount = 0;
    for (const row of rows) {
      const sanitizedValues = columns.map(col => sanitizeValue(col, row[col]));
      if (!dryRun) {
        await pool.query(sql, sanitizedValues);
      }
      successCount++;
    }

    summary[table].migratedCount = successCount;
    console.log(`  -> ${successCount}/${rows.length} rows processed successfully for '${table}'.`);
  }

  console.log("\n=================================================");
  console.log("=== MIGRATION PIPELINE COMPLETE ===");
  console.log("=================================================");
  console.table(summary);

  return summary;
}

import { fileURLToPath } from "url";

// Auto-run if executed directly from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const isDryRun = process.argv.includes("--dry-run");
  runMigration({ dryRun: isDryRun })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Migration failed with error:", err);
      process.exit(1);
    });
}

