import { NextResponse } from "next/server";
import { query, getOne, execute } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { safeUnlinkObsoleteUpload } from "@/lib/admin/uploads.js";

export async function GET(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const row = await getOne("SELECT * FROM products WHERE id = ? OR slug = ?", [id, id]);
  if (!row) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const product = await formatProductFromRow(row);
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existingRow = await getOne("SELECT * FROM products WHERE id = ? OR slug = ?", [id, id]);
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

    if (slug !== existingRow.slug) {
      const slugCollision = await getOne("SELECT id FROM products WHERE slug = ? AND id != ?", [slug, existingRow.id]);
      if (slugCollision) {
        return NextResponse.json({ error: "Product slug already exists. Please choose a unique slug." }, { status: 400 });
      }
    }

    await execute(`
      UPDATE products SET
        slug = ?,
        sku = ?,
        name = ?,
        status = ?,
        is_featured = ?,
        is_new_arrival = ?,
        is_custom_only = ?,
        product_type = ?,
        parent_collection = ?,
        parent_subcategory = ?,
        parent_category = ?,
        subject_id = ?,
        primary_material_id = ?,
        short_description = ?,
        detailed_description = ?,
        knowledge_layer = ?,
        attributes = ?,
        tags = ?,
        variants = ?,
        seo = ?
      WHERE id = ? OR slug = ?
    `, [
      slug,
      body.sku || existingRow.sku,
      name,
      body.status || existingRow.status,
      body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : existingRow.is_featured,
      body.isNewArrival !== undefined ? (body.isNewArrival ? 1 : 0) : existingRow.is_new_arrival,
      body.isCustomOnly !== undefined ? (body.isCustomOnly ? 1 : 0) : existingRow.is_custom_only,
      body.productType || existingRow.product_type,
      body.parentCollection || existingRow.parent_collection,
      body.parentSubcategory || existingRow.parent_subcategory,
      body.parentCategory || existingRow.parent_category,
      body.subjectId !== undefined ? body.subjectId : existingRow.subject_id,
      primaryMaterialId,
      body.shortDescription !== undefined ? body.shortDescription : existingRow.short_description,
      body.detailedDescription !== undefined ? body.detailedDescription : existingRow.detailed_description,
      JSON.stringify(body.knowledgeLayer || {}),
      JSON.stringify(body.attributes || {}),
      JSON.stringify(body.tags || []),
      JSON.stringify(body.variants || {}),
      JSON.stringify(body.seo || {}),
      existingRow.id,
      existingRow.slug
    ]);

    if (body.imageSrc || Array.isArray(body.imageGallery)) {
      const oldImages = await query("SELECT url FROM product_images WHERE product_slug = ?", [slug]);

      await execute("DELETE FROM product_images WHERE product_slug = ?", [slug]);

      const newUrls = new Set();
      if (body.imageSrc) {
        newUrls.add(body.imageSrc);
        const matchingGalleryItem = Array.isArray(body.imageGallery) 
          ? body.imageGallery.find(item => (typeof item === "object" && (item.src === body.imageSrc || item.url === body.imageSrc)))
          : null;
        const heroAlt = body.imageAlt || matchingGalleryItem?.altText || matchingGalleryItem?.alt_text || `${name} - Hand-carved in Jaipur`;

        await execute(`
          INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
          VALUES (?, ?, ?, 'hero', 0, 1)
        `, [slug, body.imageSrc, heroAlt]);
      }

      if (Array.isArray(body.imageGallery)) {
        for (let idx = 0; idx < body.imageGallery.length; idx++) {
          const item = body.imageGallery[idx];
          const url = typeof item === "string" ? item : item?.src || item?.url || "";
          const alt = typeof item === "object" ? (item.altText || item.alt_text || item.alt || `${name} detail view ${idx + 1}`) : `${name} detail view ${idx + 1}`;
          if (url && url !== body.imageSrc) {
            newUrls.add(url);
            await execute(`
              INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
              VALUES (?, ?, ?, 'gallery', ?, 0)
            `, [slug, url, alt, idx + 1]);
          }
        }
      }

      // Safe unlinking for removed/replaced images
      for (const oldImg of oldImages) {
        if (oldImg.url && !newUrls.has(oldImg.url)) {
          await safeUnlinkObsoleteUpload(oldImg.url);
        }
      }
    }

    const updatedRow = await getOne("SELECT * FROM products WHERE slug = ?", [slug]);
    const updatedProduct = await formatProductFromRow(updatedRow);
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action || "duplicate";

    const existingRow = await getOne("SELECT * FROM products WHERE id = ? OR slug = ?", [id, id]);

    if (!existingRow) {
      return NextResponse.json({ error: "Original product not found" }, { status: 404 });
    }

    if (action === "duplicate") {
      const timestamp = Date.now();
      const newName = `${existingRow.name} (Copy)`;
      let newSlug = `${existingRow.slug}-copy`;

      const slugCollision = await getOne("SELECT id FROM products WHERE slug = ?", [newSlug]);
      if (slugCollision) {
        newSlug = `${newSlug}-${timestamp.toString().slice(-4)}`;
      }

      const newSku = `JSC-COPY-${timestamp.toString().slice(-6)}`;

      await execute(`
        INSERT INTO products (
          id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
          product_type, parent_collection, parent_subcategory, parent_category,
          subject_id, primary_material_id, short_description, detailed_description,
          knowledge_layer, attributes, tags, variants, seo
        ) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newSlug,
        newSku,
        newSlug,
        newName,
        0,
        1,
        existingRow.is_custom_only,
        existingRow.product_type,
        existingRow.parent_collection,
        existingRow.parent_subcategory,
        existingRow.parent_category,
        existingRow.subject_id,
        existingRow.primary_material_id,
        existingRow.short_description,
        existingRow.detailed_description,
        existingRow.knowledge_layer,
        existingRow.attributes,
        existingRow.tags,
        existingRow.variants,
        existingRow.seo
      ]);

      const existingImages = await query("SELECT * FROM product_images WHERE product_slug = ?", [existingRow.slug]);
      for (const img of existingImages) {
        await execute(`
          INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
          VALUES (?, ?, ?, ?, ?, ?)
        `, [newSlug, img.url, img.alt_text, img.role, img.sort_order, img.is_primary]);
      }

      const clonedRow = await getOne("SELECT * FROM products WHERE slug = ?", [newSlug]);
      const clonedProduct = await formatProductFromRow(clonedRow);
      return NextResponse.json({ success: true, product: clonedProduct });
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
    const { searchParams } = new URL(request.url);
    const isPermanent = searchParams.get("permanent") === "true";

    const existingRow = await getOne("SELECT * FROM products WHERE id = ? OR slug = ?", [id, id]);
    if (!existingRow) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (isPermanent) {
      // 1. Fetch images associated with this product
      const productImages = await query("SELECT url FROM product_images WHERE product_slug = ?", [existingRow.slug]);

      // 2. Remove product and image records from DB
      await execute("DELETE FROM product_images WHERE product_slug = ?", [existingRow.slug]);
      await execute("DELETE FROM products WHERE id = ?", [existingRow.id]);

      // 3. Safe Media Pruning: Check if image URLs are used by OTHER products before removing from disk
      for (const imgRecord of productImages) {
        if (imgRecord.url) {
          await safeUnlinkObsoleteUpload(imgRecord.url);
        }
      }

      return NextResponse.json({ success: true, message: "Product permanently deleted safely." });
    }

    // Default: Safe soft archiving
    await execute("UPDATE products SET status = 'archived' WHERE id = ?", [existingRow.id]);
    return NextResponse.json({ success: true, message: "Product archived successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
