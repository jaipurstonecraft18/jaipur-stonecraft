import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDB();

  const row = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id);
  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: formatProductFromRow(row) });
}

export async function PUT(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const db = getDB();

    const existingRow = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id);
    if (!existingRow) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // STRICT RULE: Granite is strictly excluded
    const primaryMaterialId = body.primaryMaterialId || existingRow.primary_material_id;
    if (primaryMaterialId.toLowerCase().includes("granite")) {
      return NextResponse.json({ error: "Granite is strictly excluded from Jaipur Stonecraft materials." }, { status: 400 });
    }

    const name = body.name || existingRow.name;
    const slug = body.slug || existingRow.slug;

    // Check slug collision if slug changed
    if (slug !== existingRow.slug) {
      const slugCollision = db.prepare("SELECT id FROM products WHERE slug = ? AND id != ?").get(slug, existingRow.id);
      if (slugCollision) {
        return NextResponse.json({ error: "Product slug already exists. Please choose a unique slug." }, { status: 400 });
      }
    }

    const update = db.prepare(`
      UPDATE products SET
        slug = @slug,
        sku = @sku,
        name = @name,
        status = @status,
        is_featured = @is_featured,
        is_new_arrival = @is_new_arrival,
        is_custom_only = @is_custom_only,
        product_type = @product_type,
        parent_collection = @parent_collection,
        parent_subcategory = @parent_subcategory,
        parent_category = @parent_category,
        subject_id = @subject_id,
        primary_material_id = @primary_material_id,
        short_description = @short_description,
        detailed_description = @detailed_description,
        knowledge_layer = @knowledge_layer,
        attributes = @attributes,
        tags = @tags,
        variants = @variants,
        seo = @seo,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = @id OR slug = @target_slug
    `);

    update.run({
      id: existingRow.id,
      target_slug: existingRow.slug,
      slug,
      sku: body.sku || existingRow.sku,
      name,
      status: body.status || existingRow.status,
      is_featured: body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : existingRow.is_featured,
      is_new_arrival: body.isNewArrival !== undefined ? (body.isNewArrival ? 1 : 0) : existingRow.is_new_arrival,
      is_custom_only: body.isCustomOnly !== undefined ? (body.isCustomOnly ? 1 : 0) : existingRow.is_custom_only,
      product_type: body.productType || existingRow.product_type,
      parent_collection: body.parentCollection || existingRow.parent_collection,
      parent_subcategory: body.parentSubcategory || existingRow.parent_subcategory,
      parent_category: body.parentCategory || existingRow.parent_category,
      subject_id: body.subjectId !== undefined ? body.subjectId : existingRow.subject_id,
      primary_material_id: primaryMaterialId,
      short_description: body.shortDescription !== undefined ? body.shortDescription : existingRow.short_description,
      detailed_description: body.detailedDescription !== undefined ? body.detailedDescription : existingRow.detailed_description,
      knowledge_layer: JSON.stringify(body.knowledgeLayer || {}),
      attributes: JSON.stringify(body.attributes || {}),
      tags: JSON.stringify(body.tags || []),
      variants: JSON.stringify(body.variants || {}),
      seo: JSON.stringify(body.seo || {})
    });

    // Update primary cover and gallery images in product_images table
    if (body.imageSrc || Array.isArray(body.imageGallery)) {
      db.prepare("DELETE FROM product_images WHERE product_slug = ?").run(slug);
      
      if (body.imageSrc) {
        db.prepare(`
          INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
          VALUES (?, ?, ?, 'hero', 0, 1)
        `).run(slug, body.imageSrc, `${name} - Hand-carved in Jaipur`);
      }

      if (Array.isArray(body.imageGallery)) {
        const insertImg = db.prepare(`
          INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
          VALUES (?, ?, ?, 'gallery', ?, 0)
        `);
        body.imageGallery.forEach((url, idx) => {
          if (url && url !== body.imageSrc) {
            insertImg.run(slug, url, `${name} detail view ${idx + 1}`, idx + 1);
          }
        });
      }
    }

    const updatedRow = db.prepare("SELECT * FROM products WHERE slug = ?").get(slug);
    return NextResponse.json({ success: true, product: formatProductFromRow(updatedRow) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Action dispatcher (e.g. action === "duplicate")
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || "duplicate";

    const db = getDB();
    const existingRow = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id);

    if (!existingRow) {
      return NextResponse.json({ error: "Original product not found" }, { status: 404 });
    }

    if (action === "duplicate") {
      const timestamp = Date.now();
      const newName = `${existingRow.name} (Copy)`;
      let newSlug = `${existingRow.slug}-copy`;

      // Prevent duplicate slug
      const slugCollision = db.prepare("SELECT id FROM products WHERE slug = ?").get(newSlug);
      if (slugCollision) {
        newSlug = `${newSlug}-${timestamp.toString().slice(-4)}`;
      }

      const newSku = `JSC-COPY-${timestamp.toString().slice(-6)}`;

      const insert = db.prepare(`
        INSERT INTO products (
          id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
          product_type, parent_collection, parent_subcategory, parent_category,
          subject_id, primary_material_id, short_description, detailed_description,
          knowledge_layer, attributes, tags, variants, seo
        ) VALUES (
          @id, @sku, @slug, @name, 'draft', @is_featured, @is_new_arrival, @is_custom_only,
          @product_type, @parent_collection, @parent_subcategory, @parent_category,
          @subject_id, @primary_material_id, @short_description, @detailed_description,
          @knowledge_layer, @attributes, @tags, @variants, @seo
        )
      `);

      insert.run({
        id: newSlug,
        sku: newSku,
        slug: newSlug,
        name: newName,
        is_featured: 0,
        is_new_arrival: 1,
        is_custom_only: existingRow.is_custom_only,
        product_type: existingRow.product_type,
        parent_collection: existingRow.parent_collection,
        parent_subcategory: existingRow.parent_subcategory,
        parent_category: existingRow.parent_category,
        subject_id: existingRow.subject_id,
        primary_material_id: existingRow.primary_material_id,
        short_description: existingRow.short_description,
        detailed_description: existingRow.detailed_description,
        knowledge_layer: existingRow.knowledge_layer,
        attributes: existingRow.attributes,
        tags: existingRow.tags,
        variants: existingRow.variants,
        seo: existingRow.seo
      });

      // Clone images
      const existingImages = db.prepare("SELECT * FROM product_images WHERE product_slug = ?").all(existingRow.slug);
      const insertImg = db.prepare(`
        INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
        VALUES (@product_slug, @url, @alt_text, @role, @sort_order, @is_primary)
      `);

      existingImages.forEach((img) => {
        insertImg.run({
          product_slug: newSlug,
          url: img.url,
          alt_text: img.alt_text,
          role: img.role,
          sort_order: img.sort_order,
          is_primary: img.is_primary
        });
      });

      const clonedRow = db.prepare("SELECT * FROM products WHERE slug = ?").get(newSlug);
      return NextResponse.json({ success: true, product: formatProductFromRow(clonedRow) });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Action failed" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const db = getDB();

    const existingRow = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id);
    if (!existingRow) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Soft delete: update status to 'archived'
    db.prepare("UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(existingRow.id);

    return NextResponse.json({ success: true, message: "Product archived successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to archive product" }, { status: 500 });
  }
}
