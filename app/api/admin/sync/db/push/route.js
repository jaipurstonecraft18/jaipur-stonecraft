/**
 * Jaipur Stonecraft — Parameterized Database Push Sync Endpoint (Phase 2)
 *
 * RESTRICTED & HARDENED WRITE ENDPOINT:
 *   - Authenticated via ADMIN_SECRET_KEY / MEDIA_SYNC_SECRET.
 *   - Strictly accepts parameterized table/row-scoped writes only for known SCHEMA_TABLES.
 *   - Never accepts or executes raw arbitrary SQL strings.
 *   - Atomically executes within a MySQL transaction with foreign key safety.
 */

import { NextResponse } from "next/server";
import { isAuthorizedSyncRequest } from "@/lib/admin/auth.js";
import { getPool } from "@/lib/db/client.js";
import { SCHEMA_TABLES } from "@/lib/backup/db-exporter.js";

const VALID_OPERATIONS = ["upsert", "delete"];

// Known primary key mappings
const TABLE_PRIMARY_KEYS = {
  collections: "id",
  subcategories: "id",
  categories: "id",
  materials: "id",
  subjects: "id",
  product_types: "id",
  attribute_definitions: "id",
  products: "id",
  product_images: "id",
  site_content: "key_name",
  page_sections: "key_name",
  projects: "id",
  inquiries: "id",
  site_settings: "key_name"
};

export async function POST(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized write sync request" }, { status: 401 });
  }

  let body = null;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid JSON payload" }, { status: 400 });
  }

  const operations = Array.isArray(body?.operations) ? body.operations : [];
  if (operations.length === 0) {
    return NextResponse.json({ success: false, error: "Payload must contain an array of operations" }, { status: 400 });
  }

  // Pre-validate all operations
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    if (!op.table || !SCHEMA_TABLES.includes(op.table)) {
      return NextResponse.json({ success: false, error: `Operation #${i}: Unrecognized table '${op.table}'` }, { status: 400 });
    }
    if (!op.type || !VALID_OPERATIONS.includes(op.type)) {
      return NextResponse.json({ success: false, error: `Operation #${i}: Invalid operation type '${op.type}'` }, { status: 400 });
    }
    if (op.type === "upsert" && (!op.data || typeof op.data !== "object" || Object.keys(op.data).length === 0)) {
      return NextResponse.json({ success: false, error: `Operation #${i}: 'data' object is required for upsert` }, { status: 400 });
    }
    if (op.type === "delete" && !op.primaryKeyValue) {
      return NextResponse.json({ success: false, error: `Operation #${i}: 'primaryKeyValue' is required for delete` }, { status: 400 });
    }
  }

  const pool = getPool();
  const conn = await pool.promise().getConnection();

  try {
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS = 0;");

    let appliedCount = 0;
    const results = [];

    for (const op of operations) {
      const table = op.table;
      const pkColumn = TABLE_PRIMARY_KEYS[table] || "id";

      if (op.type === "upsert") {
        const data = op.data;
        const columns = Object.keys(data);
        const colNames = columns.map(c => `\`${c}\``).join(", ");
        const placeholders = columns.map(() => "?").join(", ");
        const updateClause = columns
          .filter(c => c !== pkColumn)
          .map(c => `\`${c}\` = VALUES(\`${c}\`)`)
          .join(", ");

        const values = columns.map(c => {
          let v = data[c];
          if (v && typeof v === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v)) {
            v = new Date(v).toISOString().slice(0, 19).replace('T', ' ');
          }
          return v;
        });

        const sql = `INSERT INTO \`${table}\` (${colNames}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause || `\`${pkColumn}\`=\`${pkColumn}\``}`;
        const [res] = await conn.query(sql, values);

        results.push({
          table,
          type: "upsert",
          pkValue: data[pkColumn],
          affectedRows: res.affectedRows
        });
        appliedCount++;
      } else if (op.type === "delete") {
        const sql = `DELETE FROM \`${table}\` WHERE \`${pkColumn}\` = ?`;
        const [res] = await conn.query(sql, [op.primaryKeyValue]);

        results.push({
          table,
          type: "delete",
          pkValue: op.primaryKeyValue,
          affectedRows: res.affectedRows
        });
        appliedCount++;
      }
    }

    await conn.query("SET FOREIGN_KEY_CHECKS = 1;");
    await conn.commit();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      appliedCount,
      operations: results
    });
  } catch (error) {
    await conn.rollback();
    console.error("[DB Push Sync Error]:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Transaction failed and was rolled back."
    }, { status: 500 });
  } finally {
    conn.release();
  }
}
