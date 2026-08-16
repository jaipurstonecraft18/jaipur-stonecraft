import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

// GET: Fetch catalogue entities with product usage counts
export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDB();

  // 1. Materials with usage counts
  const materials = db.prepare("SELECT * FROM materials ORDER BY name ASC").all().map((m) => {
    const usage = db.prepare("SELECT COUNT(*) as count FROM products WHERE primary_material_id = ?").get(m.id);
    return {
      ...m,
      isSacredGrade: Boolean(m.is_sacred_grade),
      isActive: Boolean(m.is_active ?? 1),
      usedByProductsCount: usage ? usage.count : 0
    };
  });

  // 2. Subjects with usage counts
  const subjects = db.prepare("SELECT * FROM subjects ORDER BY primary_name ASC").all().map((s) => {
    const usage = db.prepare("SELECT COUNT(*) as count FROM products WHERE subject_id = ?").get(s.id);
    let synonyms = [];
    try { synonyms = JSON.parse(s.synonyms || "[]"); } catch (e) {}
    return {
      ...s,
      synonyms,
      isActive: Boolean(s.is_active ?? 1),
      usedByProductsCount: usage ? usage.count : 0
    };
  });

  // 3. Product Types with usage counts
  const productTypes = db.prepare("SELECT * FROM product_types ORDER BY name ASC").all().map((pt) => {
    const usage = db.prepare("SELECT COUNT(*) as count FROM products WHERE product_type = ?").get(pt.id);
    return {
      ...pt,
      isActive: Boolean(pt.is_active ?? 1),
      usedByProductsCount: usage ? usage.count : 0
    };
  });

  // 4. Attribute Definitions
  const attributes = db.prepare("SELECT * FROM attribute_definitions ORDER BY name ASC").all().map((att) => {
    let options = [];
    let appliesToProductTypes = [];
    try { options = JSON.parse(att.options || "[]"); } catch (e) {}
    try { appliesToProductTypes = JSON.parse(att.applies_to_product_types || "[]"); } catch (e) {}

    return {
      id: att.id,
      name: att.name,
      dataType: att.data_type,
      options,
      appliesToProductTypes,
      isActive: Boolean(att.is_active ?? 1)
    };
  });

  return NextResponse.json({
    materials,
    subjects,
    productTypes,
    attributes
  });
}

// POST: Add or Edit Catalogue Entity
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { entityType, payload } = body; // entityType: 'material' | 'subject' | 'product_type' | 'attribute'

    if (!entityType || !payload || !payload.name) {
      return NextResponse.json({ error: "Entity type and valid payload name are required" }, { status: 400 });
    }

    const db = getDB();
    const trimmedName = payload.name.trim();

    // STRICT RULE: Granite is strictly excluded
    if (trimmedName.toLowerCase().includes("granite")) {
      return NextResponse.json({ error: "Granite is strictly excluded from Jaipur Stonecraft catalogue." }, { status: 400 });
    }

    if (entityType === "material") {
      const id = payload.id || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      
      // Check duplicate
      const existing = db.prepare("SELECT * FROM materials WHERE (LOWER(name) = LOWER(?) OR id = ?) AND id != ?").get(trimmedName, id, payload.id || "");
      if (existing) {
        return NextResponse.json({ error: `Material "${trimmedName}" already exists in catalogue.` }, { status: 400 });
      }

      db.prepare(`
        INSERT INTO materials (id, name, category, origin, color_family, durability, is_sacred_grade, description, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          category = excluded.category,
          origin = excluded.origin,
          color_family = excluded.color_family,
          durability = excluded.durability,
          is_sacred_grade = excluded.is_sacred_grade,
          description = excluded.description,
          is_active = excluded.is_active
      `).run(
        id,
        trimmedName,
        payload.category || "Marble",
        payload.origin || "Rajasthan, India",
        payload.colorFamily || "White",
        payload.durability || "High / Millennial Grade",
        payload.isSacredGrade ? 1 : 0,
        payload.description || "",
      );

      return NextResponse.json({ success: true, message: `Material "${trimmedName}" saved successfully.`, item: { id, name: trimmedName } });
    }

    if (entityType === "subject") {
      const id = payload.id || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      const existing = db.prepare("SELECT * FROM subjects WHERE (LOWER(primary_name) = LOWER(?) OR id = ?) AND id != ?").get(trimmedName, id, payload.id || "");
      if (existing) {
        return NextResponse.json({ error: `Subject "${trimmedName}" already exists.` }, { status: 400 });
      }

      db.prepare(`
        INSERT INTO subjects (id, primary_name, synonyms, tradition, iconography_elements, default_category_slug, is_active)
        VALUES (?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          primary_name = excluded.primary_name,
          synonyms = excluded.synonyms,
          tradition = excluded.tradition,
          iconography_elements = excluded.iconography_elements,
          default_category_slug = excluded.default_category_slug,
          is_active = excluded.is_active
      `).run(
        id,
        trimmedName,
        JSON.stringify(payload.synonyms || []),
        payload.tradition || "Vedic / Masonic",
        JSON.stringify(payload.iconographyElements || []),
        payload.defaultCategorySlug || "",
      );

      return NextResponse.json({ success: true, message: `Subject "${trimmedName}" saved successfully.`, item: { id, primaryName: trimmedName } });
    }

    if (entityType === "product_type") {
      const id = payload.id || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

      db.prepare(`
        INSERT INTO product_types (id, name, description, is_active)
        VALUES (?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          description = excluded.description,
          is_active = excluded.is_active
      `).run(id, trimmedName, payload.description || "");

      return NextResponse.json({ success: true, message: `Product type "${trimmedName}" saved.`, item: { id, name: trimmedName } });
    }

    if (entityType === "attribute") {
      const id = payload.id || trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^|_$/g, "");

      db.prepare(`
        INSERT INTO attribute_definitions (id, name, data_type, options, applies_to_product_types, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          data_type = excluded.data_type,
          options = excluded.options,
          applies_to_product_types = excluded.applies_to_product_types,
          is_active = excluded.is_active
      `).run(
        id,
        trimmedName,
        payload.dataType || "text",
        JSON.stringify(payload.options || []),
        JSON.stringify(payload.appliesToProductTypes || [])
      );

      return NextResponse.json({ success: true, message: `Attribute "${trimmedName}" saved.`, item: { id, name: trimmedName } });
    }

    return NextResponse.json({ error: "Unsupported entity type" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to save entity" }, { status: 500 });
  }
}

// PUT / DELETE: Toggle Active / Archive Status safely
export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { entityType, id, action } = body; // action: 'archive' | 'restore'

    if (!entityType || !id) {
      return NextResponse.json({ error: "Entity type and ID required" }, { status: 400 });
    }

    const db = getDB();
    const newStatus = action === "archive" ? 0 : 1;
    const tableMap = {
      material: { table: "materials", fkCol: "primary_material_id" },
      subject: { table: "subjects", fkCol: "subject_id" },
      product_type: { table: "product_types", fkCol: "product_type" },
      attribute: { table: "attribute_definitions", fkCol: null }
    };

    const target = tableMap[entityType];
    if (!target) return NextResponse.json({ error: "Invalid entity type" }, { status: 400 });

    let usageCount = 0;
    if (target.fkCol) {
      const usage = db.prepare(`SELECT COUNT(*) as count FROM products WHERE ${target.fkCol} = ?`).get(id);
      usageCount = usage ? usage.count : 0;
    }

    db.prepare(`UPDATE ${target.table} SET is_active = ? WHERE id = ?`).run(newStatus, id);

    return NextResponse.json({
      success: true,
      message: action === "archive"
        ? `Item archived safely. (Referenced by ${usageCount} existing product(s))`
        : "Item restored to active catalogue.",
      usageCount
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Operation failed" }, { status: 500 });
  }
}
