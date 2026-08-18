import { NextResponse } from "next/server";
import { query, getOne, execute } from "@/lib/db/client.js";
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
  const countRow = await getOne(countSql, params);
  const totalCount = countRow ? countRow.total : 0;

  // Pagination & Sorting
  sql += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
  const offset = (page - 1) * pageSize;
  params.push(pageSize, offset);

  const rows = await query(sql, params);
  const products = await Promise.all(rows.map(formatProductFromRow));

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
    const timestamp = Date.now();
    const name = body.name || "Untitled Product Draft";
    
    let slug = (body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")) || `draft-${timestamp}`;
    
    const existingSlug = await getOne("SELECT id FROM products WHERE slug = ?", [slug]);
    if (existingSlug) {
      slug = `${slug}-${timestamp.toString().slice(-4)}`;
    }

    const sku = body.sku || `JSC-DRAFT-${timestamp.toString().slice(-6)}`;
    const status = body.status || "draft";
    const primaryMaterialId = body.primaryMaterialId || "makrana-pure-white";

    const result = await execute(`
      INSERT INTO products (
        id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
        product_type, parent_collection, parent_subcategory, parent_category,
        subject_id, primary_material_id, short_description, detailed_description,
        knowledge_layer, attributes, tags, variants, seo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      slug,
      sku,
      slug,
      name,
      status,
      body.isFeatured ? 1 : 0,
      body.isNewArrival ? 1 : 0,
      body.isCustomOnly ? 1 : 0,
      body.productType || "sculpture",
      body.parentCollection || "sculptures-statues",
      body.parentSubcategory || "hindu-sculptures",
      body.parentCategory || "ganesh-ji",
      body.subjectId || null,
      primaryMaterialId,
      body.shortDescription || "",
      body.detailedDescription || "",
      JSON.stringify(body.knowledgeLayer || {}),
      JSON.stringify(body.attributes || {}),
      JSON.stringify(body.tags || []),
      JSON.stringify(body.variants || {}),
      JSON.stringify(body.seo || {})
    ]);

    if (!result) {
      return NextResponse.json({ error: "Failed to save product in database." }, { status: 500 });
    }

    if (body.imageSrc) {
      await execute(`
        INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
        VALUES (?, ?, ?, 'hero', 0, 1)
      `, [slug, body.imageSrc, `${name} - Hand-carved in Jaipur`]);
    }

    if (Array.isArray(body.imageGallery)) {
      for (let idx = 0; idx < body.imageGallery.length; idx++) {
        const item = body.imageGallery[idx];
        const url = typeof item === "string" ? item : item?.src || "";
        const alt = typeof item === "object" && item?.altText ? item.altText : `${name} detail view ${idx + 1}`;
        if (url && url !== body.imageSrc) {
          await execute(`
            INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
            VALUES (?, ?, ?, 'gallery', ?, 0)
          `, [slug, url, alt, idx + 1]);
        }
      }
    }

    return NextResponse.json({ success: true, product: { slug, name, sku } });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
