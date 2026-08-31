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

export async function GET(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const pool = getPool().promise();
    const tablesSummary = {};
    const globalHash = crypto.createHash("sha256");

    for (const table of SCHEMA_TABLES) {
      const [rows] = await pool.query(`SELECT * FROM \`${table}\``);
      const rowCount = Array.isArray(rows) ? rows.length : 0;
      const checksum = computeChecksum(Array.isArray(rows) ? rows : []);

      let maxUpdatedAt = null;
      if (Array.isArray(rows) && rows.length > 0) {
        for (const row of rows) {
          const t = row.updated_at || row.created_at;
          if (t) {
            const d = new Date(t).toISOString();
            if (!maxUpdatedAt || d > maxUpdatedAt) {
              maxUpdatedAt = d;
            }
          }
        }
      }

      tablesSummary[table] = {
        rowCount,
        maxUpdatedAt,
        checksum
      };

      globalHash.update(`${table}:${rowCount}:${checksum}`);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      databaseChecksum: globalHash.digest("hex"),
      tables: tablesSummary
    });
  } catch (error) {
    console.error("[DB Sync Manifest Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to generate database sync manifest" }, { status: 500 });
  }
}
