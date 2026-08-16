import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "16", 10);

  const db = getDB();

  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (status !== "all") {
    sql += " AND status = ?";
    params.push(status);
  }

  if (category) {
    sql += " AND (parent_category = ? OR parent_collection = ?)";
    params.push(category, category);
  }

  if (search.trim()) {
    sql += " AND (name LIKE ? OR sku LIKE ? OR slug LIKE ?)";
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  // Count total matching records
  const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
  const countRow = db.prepare(countSql).get(...params);
  const totalCount = countRow ? countRow.total : 0;

  // Pagination & Sorting
  sql += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
  const offset = (page - 1) * pageSize;
  params.push(pageSize, offset);

  const rows = db.prepare(sql).all(...params);
  const products = rows.map(formatProductFromRow);

  return NextResponse.json({
    products,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize),
    pageSize
  });
}

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const db = getDB();

    const timestamp = Date.now();
    const name = body.name || "Untitled Product Draft";
    
    // Generate clean slug
    let slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) || `draft-${timestamp}`;
    
    // Ensure slug uniqueness
    const existingSlug = db.prepare("SELECT id FROM products WHERE slug = ?").get(slug);
    if (existingSlug) {
      slug = `${slug}-${timestamp.toString().slice(-4)}`;
    }

    const sku = body.sku || `JSC-DRAFT-${timestamp.toString().slice(-6)}`;
    const status = body.status || "draft";
    const primaryMaterialId = body.primaryMaterialId || "makrana-pure-white";

    const insert = db.prepare(`
      INSERT INTO products (
        id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
        product_type, parent_collection, parent_subcategory, parent_category,
        subject_id, primary_material_id, short_description, detailed_description,
        knowledge_layer, attributes, tags, variants, seo
      ) VALUES (
        @id, @sku, @slug, @name, @status, @is_featured, @is_new_arrival, @is_custom_only,
        @product_type, @parent_collection, @parent_subcategory, @parent_category,
        @subject_id, @primary_material_id, @short_description, @detailed_description,
        @knowledge_layer, @attributes, @tags, @variants, @seo
      )
    `);

    const productRecord = {
      id: slug,
      sku,
      slug,
      name,
      status,
      is_featured: body.isFeatured ? 1 : 0,
      is_new_arrival: body.isNewArrival ? 1 : 0,
      is_custom_only: body.isCustomOnly ? 1 : 0,
      product_type: body.productType || "sculpture",
      parent_collection: body.parentCollection || "sculptures-statues",
      parent_subcategory: body.parentSubcategory || "hindu-sculptures",
      parent_category: body.parentCategory || "ganesh-ji",
      subject_id: body.subjectId || null,
      primary_material_id: primaryMaterialId,
      short_description: body.shortDescription || "",
      detailed_description: body.detailedDescription || "",
      knowledge_layer: JSON.stringify(body.knowledgeLayer || {}),
      attributes: JSON.stringify(body.attributes || {}),
      tags: JSON.stringify(body.tags || []),
      variants: JSON.stringify(body.variants || {}),
      seo: JSON.stringify(body.seo || {})
    };

    insert.run(productRecord);

    // Insert initial hero image if provided
    if (body.imageSrc) {
      db.prepare(`
        INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
        VALUES (?, ?, ?, 'hero', 0, 1)
      `).run(slug, body.imageSrc, `${name} - Hand-carved in Jaipur`);
    }

    return NextResponse.json({ success: true, product: { slug, name, sku } });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
