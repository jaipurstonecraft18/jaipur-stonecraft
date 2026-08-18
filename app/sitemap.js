import { query } from "@/lib/db/client.js";
import { getAllKnowledgeArticles } from "@/content/products-db";
import { marbleHubData } from "@/content/marble";
import { projectsData } from "@/content/projects";

export default async function sitemap() {
  const baseUrl = "https://jaipurstonecraft.com";

  // 1. Core Static Routes
  const staticRoutes = [
    "",
    "/collections",
    "/products",
    "/knowledge",
    "/marble",
    "/projects",
    "/craftsmanship",
    "/our-story",
    "/export",
    "/custom-projects",
    "/contact",
    "/llms.txt",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : route === "/products" || route === "/collections" ? 0.9 : 0.8,
  }));

  // 2. Knowledge Article Routes
  const knowledgeRoutes = getAllKnowledgeArticles().map((art) => ({
    url: `${baseUrl}/knowledge/${art.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 3. Marble Hub Sub-Pages
  const marbleRoutes = Object.keys(marbleHubData).map((slug) => ({
    url: `${baseUrl}/marble/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  let collectionRows = [];
  let subcategoryRows = [];
  let categoryRows = [];
  let productRows = [];

  try {
    collectionRows = await query("SELECT slug FROM collections");
    subcategoryRows = await query("SELECT slug, parent_collection_slug FROM subcategories");
    categoryRows = await query("SELECT slug, parent_collection_slug, parent_subcategory_slug FROM categories");
    productRows = await query("SELECT slug, parent_category, updated_at FROM products WHERE status = 'published'");
  } catch (e) {
    console.error("[Sitemap DB Query Error]:", e);
  }

  // 4. Dynamic Level 1 Collections Routes
  const collectionRoutes = collectionRows.map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 5. Dynamic Level 2 Subcategory Routes
  const subcategoryRoutes = subcategoryRows.map((sub) => ({
    url: `${baseUrl}/collections/${sub.parent_collection_slug}/${sub.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 6. Dynamic Level 3 Category Landing Routes
  const categoryRoutes = categoryRows.map((cat) => ({
    url: `${baseUrl}/collections/${cat.parent_collection_slug}/${cat.parent_subcategory_slug}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 7. Dynamic Level 4 Design Detail Routes
  const designRoutes = productRows.map((p) => ({
    url: `${baseUrl}/designs/${p.parent_category}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 8. Dynamic Projects Routes
  const projectRoutes = Object.keys(projectsData).map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...knowledgeRoutes,
    ...marbleRoutes,
    ...collectionRoutes,
    ...subcategoryRoutes,
    ...categoryRoutes,
    ...designRoutes,
    ...projectRoutes,
  ];
}
