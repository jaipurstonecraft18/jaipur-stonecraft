import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthorizedSyncRequest } from "@/lib/admin/auth.js";
import { getPool } from "@/lib/db/client.js";
import { SCHEMA_TABLES } from "@/lib/backup/db-exporter.js";

function computeChecksum(rows) {
  const hash = crypto.createHash("sha256");
  for (const r of rows) {
    hash.update(JSON.stringify(r));
  }
  return hash.digest("hex");
}

async function fetchTableData(pool, table) {
  if (!SCHEMA_TABLES.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
  const safeRows = Array.isArray(rows) ? rows : [];
  const checksum = computeChecksum(safeRows);

  return {
    table,
    rowCount: safeRows.length,
    checksum,
    rows: safeRows
  };
}

export async function GET(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");

    if (!table) {
      return NextResponse.json({ success: false, error: "Parameter 'table' is required" }, { status: 400 });
    }

    if (!SCHEMA_TABLES.includes(table)) {
      return NextResponse.json({ success: false, error: `Table '${table}' is not recognized` }, { status: 400 });
    }

    const pool = getPool().promise();
    const data = await fetchTableData(pool, table);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...data
    });
  } catch (error) {
    console.error("[DB Sync Rows Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch table rows" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const requestedTables = Array.isArray(body?.tables) ? body.tables : [];

    if (requestedTables.length === 0) {
      return NextResponse.json({ success: false, error: "Array of 'tables' is required in request body" }, { status: 400 });
    }

    for (const t of requestedTables) {
      if (!SCHEMA_TABLES.includes(t)) {
        return NextResponse.json({ success: false, error: `Table '${t}' is not recognized` }, { status: 400 });
      }
    }

    const pool = getPool().promise();
    const result = {};

    for (const t of requestedTables) {
      result[t] = await fetchTableData(pool, t);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      tables: result
    });
  } catch (error) {
    console.error("[DB Sync Rows Batch Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch tables batch" }, { status: 500 });
  }
}
