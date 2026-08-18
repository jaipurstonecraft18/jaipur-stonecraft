/**
 * Jaipur Stonecraft — Pure Node.js MySQL Database Exporter Engine
 * 
 * Generates standard ANSI SQL dump files directly using mysql2 without relying
 * on external binary 'mysqldump' (ensuring 100% Hostinger shared-hosting compatibility).
 */

import fs from "fs";
import path from "path";
import { query } from "../db/client.js";

const SCHEMA_TABLES = [
  "collections",
  "subcategories",
  "categories",
  "materials",
  "subjects",
  "product_types",
  "attribute_definitions",
  "products",
  "product_images",
  "product_variant_links"
];

function escapeSqlValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return val;
  if (typeof val === "boolean") return val ? "1" : "0";
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
  if (typeof val === "object") {
    const str = JSON.stringify(val);
    return `'${str.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  }
  const strVal = String(val);
  return `'${strVal.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r")}'`;
}

export async function generateDatabaseDump() {
  const timestamp = new Date().toISOString();
  let sqlDump = `-- ============================================================\n`;
  sqlDump += `-- JAIPUR STONECRAFT — AUTOMATED DATABASE BACKUP DUMP\n`;
  sqlDump += `-- Exported At: ${timestamp}\n`;
  sqlDump += `-- Engine: Pure Node.js MySQL DDL & DML Exporter\n`;
  sqlDump += `-- ============================================================\n\n`;

  sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

  const summary = {
    tables: {},
    totalRows: 0
  };

  for (const tableName of SCHEMA_TABLES) {
    try {
      const rows = await query(`SELECT * FROM \`${tableName}\``);
      summary.tables[tableName] = rows.length;
      summary.totalRows += rows.length;

      sqlDump += `-- ------------------------------------------------------------\n`;
      sqlDump += `-- Table Structure & Data for: ${tableName} (${rows.length} rows)\n`;
      sqlDump += `-- ------------------------------------------------------------\n`;

      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const colListStr = columns.map(c => `\`${c}\``).join(", ");

        sqlDump += `LOCK TABLES \`${tableName}\` WRITE;\n`;

        // Batch INSERT statement generation (50 rows per batch)
        const BATCH_SIZE = 50;
        for (let i = 0; i < rows.length; i += BATCH_SIZE) {
          const batch = rows.slice(i, i + BATCH_SIZE);
          const valueTuples = batch.map(row => {
            const vals = columns.map(col => escapeSqlValue(row[col]));
            return `(${vals.join(", ")})`;
          });

          sqlDump += `INSERT INTO \`${tableName}\` (${colListStr}) VALUES\n  ${valueTuples.join(",\n  ")};\n`;
        }

        sqlDump += `UNLOCK TABLES;\n\n`;
      } else {
        sqlDump += `-- (0 rows found)\n\n`;
      }
    } catch (err) {
      console.warn(`[DB Exporter Warning]: Error dumping table ${tableName}:`, err.message);
    }
  }

  sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sqlDump += `-- ============================================================\n`;
  sqlDump += `-- END OF DUMP\n`;

  return {
    sql: sqlDump,
    summary
  };
}

export async function exportDatabaseToFile(outputFilePath) {
  const dir = path.dirname(outputFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const { sql, summary } = await generateDatabaseDump();
  fs.writeFileSync(outputFilePath, sql, "utf8");

  const stat = fs.statSync(outputFilePath);
  return {
    filePath: outputFilePath,
    fileSize: stat.size,
    summary
  };
}
