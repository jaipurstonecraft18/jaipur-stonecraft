import { NextResponse } from "next/server";
import { query, getOne, execute } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { evaluateSeoReadiness } from "@/lib/seo/readiness-checker.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "all";
  const healthFilter = searchParams.get("health") || "all";
  const issueFilter = searchParams.get("issue") || "all";
  const sortBy = searchParams.get("sort") || "health_priority";
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

  sql += " ORDER BY updated_at DESC";

  const rows = await query(sql, params);
  const allFormattedProducts = await Promise.all(rows.map(formatProductFromRow));

  let healthyCount = 0;
  let needsAttentionCount = 0;
  let incompleteCount = 0;

  const productsWithHealth = allFormattedProducts.map((p) => {
    const readiness = evaluateSeoReadiness(p);
    const statusKey = readiness.overallStatus || readiness.healthStatus || "ready";

    if (statusKey === "ready") healthyCount++;
    else if (statusKey === "needs_attention") needsAttentionCount++;
    else if (statusKey === "incomplete") incompleteCount++;

    const issueItems = readiness.items.filter((i) => i.status !== "ok");
    const primaryIssue = issueItems[0]?.message || "";
    const issueCount = issueItems.length;

    let issueSummary = "Healthy";
    if (statusKey === "incomplete") {
      issueSummary = issueCount === 1 ? primaryIssue : `${primaryIssue} (+${issueCount - 1} issue${issueCount > 2 ? 's' : ''})`;
    } else if (statusKey === "needs_attention") {
      issueSummary = issueCount === 1 ? primaryIssue : `${primaryIssue} (+${issueCount - 1} issue${issueCount > 2 ? 's' : ''})`;
    }

    return {
      ...p,
      health: {
        status: statusKey,
        issueSummary,
        issueCount,
        readiness
      }
    };
  });

  let filteredProducts = productsWithHealth;
  if (healthFilter !== "all") {
    const targetKey = healthFilter === "healthy" ? "ready" : healthFilter;
    filteredProducts = productsWithHealth.filter((p) => p.health.status === targetKey);
  }

  if (issueFilter !== "all") {
    filteredProducts = filteredProducts.filter((p) => {
      const items = p.health?.readiness?.items || [];
      return items.some((item) => item.id === issueFilter && item.status !== "ok");
    });
  }

  if (sortBy === "health_priority") {
    const healthWeight = { incomplete: 3, needs_attention: 2, ready: 1 };
    filteredProducts.sort((a, b) => {
      const weightDiff = (healthWeight[b.health.status] || 0) - (healthWeight[a.health.status] || 0);
      if (weightDiff !== 0) return weightDiff;
      return b.health.issueCount - a.health.issueCount;
    });
  }

  const totalCount = filteredProducts.length;
  const offset = (page - 1) * pageSize;
  const paginatedProducts = filteredProducts.slice(offset, offset + pageSize);

  return NextResponse.json({
    products: paginatedProducts,
    totalCount,
    healthCounts: {
      total: allFormattedProducts.length,
      healthy: healthyCount,
      needsAttention: needsAttentionCount,
      incomplete: incompleteCount
    },
    currentPage: page,
    totalPages: Math.ceil(totalCount / pageSize) || 1,
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
