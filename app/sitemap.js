import { query } from "@/lib/db/client.js";
import { getAllKnowledgeArticles } from "@/content/products-db";
import { projectsData } from "@/content/projects";
import { collectionsData } from "@/content/collections";
import { categoriesData } from "@/content/categories";

/**
 * Revalidate sitemap periodically in production via Next.js ISR (every 1 hour).
 * Ensures fresh data while preserving ultra-fast cache responses for search engine spiders.
 */
export const revalidate = 3600;

export default async function sitemap() {
  const baseUrl = "https://jaipurstonecraft.com";
  const staticBaselineDate = new Date("2026-10-26T00:00:00Z");

  // 1. Core Public Static Routes (Indexable & Canonical)
  const staticRoutes = [
    "",
    "/collections",
    "/products",
    "/our-world",
    "/knowledge",
    "/projects",
    "/craftsmanship",
    "/our-story",
    "/export",
    "/custom-projects",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticBaselineDate,
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : route === "/products" || route === "/collections" || route === "/our-world" ? 0.9 : 0.8,
  }));

  // 2. Knowledge Article Routes (Editorial Guides & Material Knowledge)
  const knowledgeRoutes = getAllKnowledgeArticles().map((art) => ({
    url: `${baseUrl}/knowledge/${art.slug}`,
    lastModified: art.lastUpdated ? new Date(art.lastUpdated) : staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let collectionRows = [];
  let subcategoryRows = [];
  let categoryRows = [];
  let productRows = [];

  try {
    collectionRows = await query("SELECT slug, created_at FROM collections WHERE is_active = 1");
    subcategoryRows = await query(`
      SELECT s.slug, s.parent_collection_slug, s.created_at 
      FROM subcategories s
      INNER JOIN collections col ON s.parent_collection_slug = col.slug
      WHERE s.is_active = 1 AND col.is_active = 1
    `);
    categoryRows = await query(`
      SELECT c.slug, c.parent_collection_slug, c.parent_subcategory_slug, c.created_at 
      FROM categories c
      INNER JOIN subcategories s ON c.parent_subcategory_slug = s.slug
      INNER JOIN collections col ON c.parent_collection_slug = col.slug
      WHERE c.is_active = 1 AND s.is_active = 1 AND col.is_active = 1
    `);
    productRows = await query(`
      SELECT slug, parent_category, updated_at, seo 
      FROM products 
      WHERE status = 'published' AND slug IS NOT NULL AND slug != '' AND parent_category IS NOT NULL AND parent_category != ''
    `);
  } catch (e) {
    console.error("[Sitemap DB Query Error]:", e?.message || e);
  }

  // Graceful fallback to static definitions if database queries returned empty
  if (!collectionRows || collectionRows.length === 0) {
    collectionRows = Object.values(collectionsData).map((col) => ({
      slug: col.slug,
      created_at: staticBaselineDate,
    }));
  }
  if (!subcategoryRows || subcategoryRows.length === 0) {
    subcategoryRows = [];
    for (const col of Object.values(collectionsData)) {
      for (const sub of col.subcategories || []) {
        subcategoryRows.push({
          slug: sub.slug,
          parent_collection_slug: sub.parentCollection || col.slug,
          created_at: staticBaselineDate,
        });
      }
    }
  }
  if (!categoryRows || categoryRows.length === 0) {
    categoryRows = Object.values(categoriesData).map((cat) => ({
      slug: cat.slug,
      parent_collection_slug: cat.parentCollection,
      parent_subcategory_slug: cat.parentSubcategory,
      created_at: staticBaselineDate,
    }));
  }

  // 3. Dynamic Level 1 Collections Routes
  const collectionRoutes = collectionRows.map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: col.created_at ? new Date(col.created_at) : staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 4. Dynamic Level 2 Subcategory Routes
  const subcategoryRoutes = subcategoryRows.map((sub) => ({
    url: `${baseUrl}/collections/${sub.parent_collection_slug}/${sub.slug}`,
    lastModified: sub.created_at ? new Date(sub.created_at) : staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 5. Dynamic Level 3 Category Landing Routes
  const categoryRoutes = categoryRows.map((cat) => ({
    url: `${baseUrl}/collections/${cat.parent_collection_slug}/${cat.parent_subcategory_slug}/${cat.slug}`,
    lastModified: cat.created_at ? new Date(cat.created_at) : staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 6. Dynamic Level 4 Design Detail Routes (Only eligible, published, indexable products)
  const eligibleProducts = (productRows || []).filter((p) => {
    if (!p.slug || !p.parent_category) return false;
    if (p.seo) {
      try {
        const seoObj = typeof p.seo === "string" ? JSON.parse(p.seo) : p.seo;
        if (seoObj && seoObj.indexable === false) return false;
      } catch (e) {}
    }
    return true;
  });

  const designRoutes = eligibleProducts.map((p) => ({
    url: `${baseUrl}/designs/${p.parent_category}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 7. Dynamic Projects Routes
  const projectRoutes = Object.keys(projectsData).map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: staticBaselineDate,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const rawEntries = [
    ...staticRoutes,
    ...knowledgeRoutes,
    ...collectionRoutes,
    ...subcategoryRoutes,
    ...categoryRoutes,
    ...designRoutes,
    ...projectRoutes,
  ];

  // Guaranteed deduplication
  const seenUrls = new Set();
  const uniqueEntries = [];
  for (const entry of rawEntries) {
    if (entry && entry.url && !seenUrls.has(entry.url)) {
      seenUrls.add(entry.url);
      uniqueEntries.push(entry);
    }
  }

  return uniqueEntries;
}
