/**
 * Jaipur Stonecraft — Taxonomy Engine (Dual Engine: DB + Fallbacks)
 * 
 * Preserves & extends the 5-tier architecture:
 * Collection -> Subcategory -> Category -> Design -> Variants
 */

import { query, getOne, initDB } from "./client.js";

async function getStaticCollections() {
  const { collectionsData } = await import("../../content/collections.js");
  return collectionsData;
}

async function getStaticCategories() {
  const { categoriesData } = await import("../../content/categories.js");
  return categoriesData;
}

function resolveSmartImage(dbImg, staticImg, fallback = "/images/collections/hero-sculptures-group.webp") {
  if (dbImg && typeof dbImg === "string") {
    const cleanDb = dbImg.trim().replace(/^["']|["']$/g, "");
    if (cleanDb && !cleanDb.includes("placehold.co")) {
      return cleanDb;
    }
  }
  if (staticImg && typeof staticImg === "string") {
    const cleanStatic = staticImg.trim().replace(/^["']|["']$/g, "");
    if (cleanStatic && !cleanStatic.includes("placehold.co")) {
      return cleanStatic;
    }
  }
  return (dbImg && typeof dbImg === "string" && dbImg.trim()) ? dbImg.trim().replace(/^["']|["']$/g, "") : fallback;
}

export async function getCollection(collectionSlug) {
  const collectionsData = await getStaticCollections();
  try {
    await initDB();
    const colRow = await getOne("SELECT * FROM collections WHERE slug = ? AND is_active = 1", [collectionSlug]);
    if (colRow) {
      const subRows = await query("SELECT * FROM subcategories WHERE parent_collection_slug = ? AND is_active = 1", [collectionSlug]);
      const existingStatic = collectionsData[collectionSlug] || {};
      
      const subcategories = subRows.length > 0
        ? subRows.map((sub) => {
            const staticSub = (existingStatic.subcategories || []).find(s => s.slug === sub.slug) || {};
            return {
              slug: sub.slug,
              name: sub.name,
              description: sub.description,
              parentCollection: sub.parent_collection_slug,
              imageSrc: resolveSmartImage(sub.image_src, staticSub.imageSrc, "/images/collections/hero-sculptures-group.webp")
            };
          })
        : (existingStatic.subcategories || [{
            slug: `${colRow.slug}-general`,
            name: `${colRow.name} Items`,
            description: `General ${colRow.name} collection items`,
            parentCollection: colRow.slug
          }]);

      return {
        slug: colRow.slug,
        name: colRow.name,
        description: colRow.description || existingStatic.description || `${colRow.name} collection by Jaipur Stonecraft`,
        imageSrc: resolveSmartImage(colRow.image_src, existingStatic.imageSrc, "/images/collections/hero-sculptures-group.webp"),
        subcategories
      };
    }
  } catch (e) {}

  return collectionsData[collectionSlug] || null;
}

export async function getAllCollections() {
  const collectionsData = await getStaticCollections();
  const mergedMap = new Map();

  // 1. Add static collections
  Object.values(collectionsData).forEach((col) => {
    mergedMap.set(col.slug, col);
  });

  // 2. Query DB collections
  try {
    await initDB();
    const colRows = await query("SELECT * FROM collections WHERE is_active = 1");
    for (const colRow of colRows) {
      const subRows = await query("SELECT * FROM subcategories WHERE parent_collection_slug = ? AND is_active = 1", [colRow.slug]);
      const existingStatic = mergedMap.get(colRow.slug) || {};

      const subcategories = subRows.length > 0
        ? subRows.map((sub) => {
            const staticSub = (existingStatic.subcategories || []).find(s => s.slug === sub.slug) || {};
            return {
              slug: sub.slug,
              name: sub.name,
              description: sub.description,
              parentCollection: sub.parent_collection_slug,
              imageSrc: resolveSmartImage(sub.image_src, staticSub.imageSrc, "/images/collections/hero-sculptures-group.webp")
            };
          })
        : (existingStatic.subcategories || [{
            slug: `${colRow.slug}-general`,
            name: `${colRow.name} Items`,
            description: `General ${colRow.name} collection items`,
            parentCollection: colRow.slug
          }]);

      mergedMap.set(colRow.slug, {
        slug: colRow.slug,
        name: colRow.name,
        description: colRow.description || existingStatic.description || `${colRow.name} collection by Jaipur Stonecraft`,
        imageSrc: resolveSmartImage(colRow.image_src, existingStatic.imageSrc, "/images/collections/hero-sculptures-group.webp"),
        subcategories
      });
    }
  } catch (e) {}

  return Array.from(mergedMap.values());
}

export async function getSubcategory(collectionSlug, subcategorySlug) {
  const collection = await getCollection(collectionSlug);
  if (!collection || !Array.isArray(collection.subcategories)) return null;
  return collection.subcategories.find((sub) => sub.slug === subcategorySlug) || null;
}

export async function getCategory(arg1, arg2, arg3) {
  const categoriesData = await getStaticCategories();
  const categorySlug = arg3 || arg1;

  try {
    await initDB();
    const catRow = await getOne("SELECT * FROM categories WHERE slug = ? AND is_active = 1", [categorySlug]);
    if (catRow) {
      const existingStatic = categoriesData[categorySlug] || {};
      return {
        slug: catRow.slug,
        name: catRow.name,
        parentCollection: catRow.parent_collection_slug,
        parentSubcategory: catRow.parent_subcategory_slug,
        description: catRow.description || `${catRow.name} hand-carved sculpture in Jaipur`,
        imageSrc: resolveSmartImage(catRow.image_src, existingStatic.imageSrc, "https://placehold.co/800x500/E8E4DF/1A1918?text=Category+Cover"),
        imageAlt: catRow.image_alt || `${catRow.name} hand-carved stone art`,
        featured: Boolean(catRow.featured)
      };
    }
  } catch (e) {}

  return categoriesData[categorySlug] || null;
}

export async function getCategoriesBySubcategory(collectionSlug, subcategorySlug) {
  const categoriesData = await getStaticCategories();
  const mergedMap = new Map();

  // 1. Add static categories matching parent collection & subcategory
  Object.values(categoriesData).forEach((cat) => {
    if (cat.parentCollection === collectionSlug && (!subcategorySlug || cat.parentSubcategory === subcategorySlug)) {
      mergedMap.set(cat.slug, cat);
    }
  });

  // 2. Query DB categories
  try {
    await initDB();
    const catRows = await query(`
      SELECT * FROM categories 
      WHERE parent_collection_slug = ? AND is_active = 1
    `, [collectionSlug]);

    for (const row of catRows) {
      if (!subcategorySlug || row.parent_subcategory_slug === subcategorySlug || !row.parent_subcategory_slug) {
        const existingStatic = mergedMap.get(row.slug) || {};
        mergedMap.set(row.slug, {
          slug: row.slug,
          name: row.name,
          parentCollection: row.parent_collection_slug,
          parentSubcategory: row.parent_subcategory_slug || subcategorySlug,
          description: row.description || `${row.name} collection in Jaipur Stonecraft atelier`,
          imageSrc: resolveSmartImage(row.image_src, existingStatic.imageSrc, "https://placehold.co/800x500/E8E4DF/1A1918?text=Category+Cover"),
          imageAlt: row.image_alt || `${row.name} hand-carved stone art`,
          featured: Boolean(row.featured)
        });
      }
    }
  } catch (e) {}

  return Array.from(mergedMap.values());
}

export async function getAllCategories() {
  const categoriesData = await getStaticCategories();
  const mergedMap = new Map();

  // 1. Add static categories
  Object.values(categoriesData).forEach((cat) => {
    mergedMap.set(cat.slug, cat);
  });

  // 2. Query DB categories
  try {
    await initDB();
    const catRows = await query("SELECT * FROM categories WHERE is_active = 1");
    for (const row of catRows) {
      const existingStatic = mergedMap.get(row.slug) || {};
      mergedMap.set(row.slug, {
        slug: row.slug,
        name: row.name,
        parentCollection: row.parent_collection_slug,
        parentSubcategory: row.parent_subcategory_slug,
        description: row.description || `${row.name} collection in Jaipur Stonecraft atelier`,
        imageSrc: resolveSmartImage(row.image_src, existingStatic.imageSrc, "https://placehold.co/800x500/E8E4DF/1A1918?text=Category+Cover"),
        imageAlt: row.image_alt || `${row.name} hand-carved stone art`,
        featured: Boolean(row.featured)
      });
    }
  } catch (e) {}

  return Array.from(mergedMap.values());
}
