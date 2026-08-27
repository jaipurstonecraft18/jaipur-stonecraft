import { NextResponse } from "next/server";
import { query, getOne, execute } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { seedCMSFoundation } from "@/lib/db/seeders.js";

export async function GET(request) {
  try {
    await seedCMSFoundation();
    const rows = await query("SELECT * FROM site_settings ORDER BY category ASC, key_name ASC");

    const settings = {};
    rows.forEach((r) => {
      settings[r.key_name] = {
        keyName: r.key_name,
        category: r.category,
        label: r.label,
        value: JSON.parse(r.value || "{}"),
        updatedAt: r.updated_at
      };
    });

    return NextResponse.json({ settings, raw: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch site settings" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { keyName, value } = body;

    if (!keyName || !value) {
      return NextResponse.json({ error: "keyName and value are required" }, { status: 400 });
    }

    const existing = await getOne("SELECT * FROM site_settings WHERE key_name = ?", [keyName]);
    if (!existing) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    const valueStr = JSON.stringify(value);
    await execute(`
      UPDATE site_settings
      SET value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key_name = ?
    `, [valueStr, keyName]);

    return NextResponse.json({ success: true, message: `Updated setting "${existing.label}"`, keyName });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update setting" }, { status: 500 });
  }
}
