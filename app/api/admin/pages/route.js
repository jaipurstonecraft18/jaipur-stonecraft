import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query, getOne, execute } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { seedCMSFoundation } from "@/lib/db/seeders.js";

export async function GET(request) {
  try {
    await seedCMSFoundation();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    let rows;
    if (page) {
      rows = await query("SELECT * FROM page_sections WHERE page = ? ORDER BY key_name ASC", [page]);
    } else {
      rows = await query("SELECT * FROM page_sections ORDER BY page ASC, key_name ASC");
    }

    const sections = rows.map((r) => ({
      keyName: r.key_name,
      page: r.page,
      sectionId: r.section_id,
      label: r.label,
      content: JSON.parse(r.content_json || "{}"),
      updatedAt: r.updated_at
    }));

    return NextResponse.json({ sections });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch page sections" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { keyName, content } = body;

    if (!keyName || !content) {
      return NextResponse.json({ error: "keyName and content are required" }, { status: 400 });
    }

    const existing = await getOne("SELECT * FROM page_sections WHERE key_name = ?", [keyName]);
    if (!existing) {
      return NextResponse.json({ error: "Page section slot not found" }, { status: 404 });
    }

    const contentJson = JSON.stringify(content);
    await execute(`
      UPDATE page_sections
      SET content_json = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key_name = ?
    `, [contentJson, keyName]);

    // Revalidate public page caches
    try {
      revalidatePath("/");
      revalidatePath("/our-story");
      revalidatePath("/craftsmanship");
    } catch (revalErr) {
      console.error("[Revalidate Cache Error]:", revalErr);
    }

    return NextResponse.json({
      success: true,
      message: `Updated section "${existing.label}"`,
      keyName
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update page section" }, { status: 500 });
  }
}
