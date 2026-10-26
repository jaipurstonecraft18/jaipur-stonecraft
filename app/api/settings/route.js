import { NextResponse } from "next/server";
import { query } from "@/lib/db/client.js";
import { seedCMSFoundation } from "@/lib/db/seeders.js";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    await seedCMSFoundation();
    const rows = await query("SELECT key_name, value FROM site_settings");

    // Security safeguard: explicitly whitelist public keys to guarantee sensitive or admin settings are never exposed
    const PUBLIC_SETTINGS_KEYS = new Set([
      "announcement_bar",
      "social_links",
      "studio_contact",
      "seo_audit_settings"
    ]);

    const settings = {};
    rows.forEach((r) => {
      if (!PUBLIC_SETTINGS_KEYS.has(r.key_name)) return;
      try {
        settings[r.key_name] = JSON.parse(r.value || "{}");
      } catch (e) {
        settings[r.key_name] = r.value;
      }
    });

    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300"
        }
      }
    );
  } catch (error) {
    console.error("[Public Settings API Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to load site settings" }, { status: 500 });
  }
}
