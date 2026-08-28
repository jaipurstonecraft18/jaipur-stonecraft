import { NextResponse } from "next/server";
import { query } from "@/lib/db/client.js";
import { seedCMSFoundation } from "@/lib/db/seeders.js";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    await seedCMSFoundation();
    const rows = await query("SELECT key_name, value FROM site_settings");

    const settings = {};
    rows.forEach((r) => {
      try {
        settings[r.key_name] = JSON.parse(r.value || "{}");
      } catch (e) {
        settings[r.key_name] = r.value;
      }
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
