import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { targetField, name, category, colorFamily } = body;

    if (!targetField || !name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = getDB();
    const trimmedName = name.trim();

    // STRICT RULE: Granite is strictly excluded
    if (trimmedName.toLowerCase().includes("granite")) {
      return NextResponse.json({ error: "Granite is strictly excluded from Jaipur Stonecraft." }, { status: 400 });
    }

    const id = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (targetField === "primaryMaterialId") {
      // Check duplicate
      const existing = db.prepare("SELECT * FROM materials WHERE LOWER(name) = LOWER(?) OR id = ?").get(trimmedName, id);
      if (existing) {
        return NextResponse.json({
          success: true,
          item: { id: existing.id, name: existing.name },
          message: "Selected existing material from catalogue."
        });
      }

      db.prepare(`
        INSERT INTO materials (id, name, category, origin, color_family, durability, is_sacred_grade, description, is_active)
        VALUES (?, ?, ?, 'Rajasthan, India', ?, 'High / Millennial Grade', 1, 'Custom artisan material added via Product Studio.', 1)
      `).run(id, trimmedName, category || "Marble", colorFamily || "White");

      return NextResponse.json({
        success: true,
        item: { id, name: trimmedName },
        message: `Created new material "${trimmedName}".`
      });
    }

    if (targetField === "subjectId") {
      const existing = db.prepare("SELECT * FROM subjects WHERE LOWER(primary_name) = LOWER(?) OR id = ?").get(trimmedName, id);
      if (existing) {
        return NextResponse.json({
          success: true,
          item: { id: existing.id, name: existing.primary_name },
          message: "Selected existing subject."
        });
      }

      db.prepare(`
        INSERT INTO subjects (id, primary_name, synonyms, tradition, iconography_elements, is_active)
        VALUES (?, ?, '[]', 'Vedic / Sacred', '[]', 1)
      `).run(id, trimmedName);

      return NextResponse.json({
        success: true,
        item: { id, name: trimmedName },
        message: `Created new subject "${trimmedName}".`
      });
    }

    if (targetField === "productType") {
      const existing = db.prepare("SELECT * FROM product_types WHERE LOWER(name) = LOWER(?) OR id = ?").get(trimmedName, id);
      if (existing) {
        return NextResponse.json({
          success: true,
          item: { id: existing.id, name: existing.name }
        });
      }

      db.prepare(`
        INSERT INTO product_types (id, name, description, is_active)
        VALUES (?, ?, 'Custom product type created via Product Studio.', 1)
      `).run(id, trimmedName);

      return NextResponse.json({
        success: true,
        item: { id, name: trimmedName }
      });
    }

    return NextResponse.json({ error: "Invalid target field for Quick Add" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Quick Add failed" }, { status: 500 });
  }
}
