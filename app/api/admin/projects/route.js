import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query, getOne, execute } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { seedCMSFoundation } from "@/lib/db/seeders.js";

export async function GET(request) {
  try {
    await seedCMSFoundation();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type");

    if (slug) {
      const row = await getOne("SELECT * FROM projects WHERE slug = ? OR id = ?", [slug, slug]);
      if (!row) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json({
        project: {
          ...row,
          gallery: JSON.parse(row.gallery || "[]"),
          productsUsed: JSON.parse(row.products_used || "[]")
        }
      });
    }

    let rows;
    if (type && type !== "All") {
      rows = await query("SELECT * FROM projects WHERE type = ? ORDER BY sort_order ASC, created_at DESC", [type]);
    } else {
      rows = await query("SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC");
    }

    const projects = rows.map((r) => ({
      ...r,
      gallery: JSON.parse(r.gallery || "[]"),
      productsUsed: JSON.parse(r.products_used || "[]")
    }));

    return NextResponse.json({ projects, totalCount: projects.length });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, location, year, description, materials, craftsmanship, finalResult, imageSrc, gallery, productsUsed } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const slug = body.slug ? body.slug.trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = slug;

    const existing = await getOne("SELECT id FROM projects WHERE id = ? OR slug = ?", [id, slug]);
    if (existing) {
      return NextResponse.json({ error: `Project slug "${slug}" already exists` }, { status: 400 });
    }

    await execute(`
      INSERT INTO projects (id, slug, name, type, location, year, description, materials, craftsmanship, final_result, image_src, gallery, products_used, status, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      slug,
      name.trim(),
      type || "Custom",
      location || "Jaipur / Global Site",
      year || "2024",
      description || "",
      materials || "Makrana Marble / Sandstone",
      craftsmanship || "",
      finalResult || "",
      imageSrc || "",
      JSON.stringify(gallery || []),
      JSON.stringify(productsUsed || []),
      "published",
      0
    ]);

    try {
      revalidatePath("/projects");
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, message: `Created project "${name}"`, slug });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, type, location, year, description, materials, craftsmanship, finalResult, imageSrc, gallery, productsUsed, status } = body;

    if (!slug) {
      return NextResponse.json({ error: "Project slug is required" }, { status: 400 });
    }

    const existing = await getOne("SELECT id FROM projects WHERE slug = ? OR id = ?", [slug, slug]);
    if (!existing) {
      return NextResponse.json({ error: "Project record not found" }, { status: 404 });
    }

    await execute(`
      UPDATE projects
      SET name = ?, type = ?, location = ?, year = ?, description = ?, materials = ?, craftsmanship = ?, final_result = ?, image_src = ?, gallery = ?, products_used = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? OR slug = ?
    `, [
      name || existing.name,
      type || existing.type,
      location || existing.location,
      year || existing.year,
      description || existing.description,
      materials || existing.materials,
      craftsmanship || existing.craftsmanship,
      finalResult || existing.final_result,
      imageSrc || existing.image_src,
      JSON.stringify(gallery || []),
      JSON.stringify(productsUsed || []),
      status || "published",
      existing.id,
      slug
    ]);

    try {
      revalidatePath("/projects");
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, message: `Updated project "${name || slug}"` });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Project slug is required" }, { status: 400 });
    }

    await execute("DELETE FROM projects WHERE slug = ? OR id = ?", [slug, slug]);

    try {
      revalidatePath("/projects");
    } catch (e) {
      console.error(e);
    }

    return NextResponse.json({ success: true, message: `Deleted project "${slug}"` });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 });
  }
}
