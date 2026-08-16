/**
 * Jaipur Stonecraft — Taxonomy Engine (SQLite-Backed)
 * 
 * Preserves & extends the 5-tier architecture:
 * Collection -> Subcategory -> Category -> Design -> Variants
 */

import getDB from "./client.js";
import { collectionsData } from "@/content/collections.js";
import { categoriesData } from "@/content/categories.js";

export const taxonomy = {
  collections: collectionsData,
  categories: categoriesData
};

export function getCollection(collectionSlug) {
  try {
    const db = getDB();
    const colRow = db.prepare("SELECT * FROM collections WHERE slug = ?").get(collectionSlug);
    if (colRow) {
      const subRows = db.prepare("SELECT * FROM subcategories WHERE parent_collection_slug = ?").all(collectionSlug);
      return {
        slug: colRow.slug,
        name: colRow.name,
        description: colRow.description,
        imageSrc: colRow.image_src,
        subcategories: subRows.map((sub) => ({
          slug: sub.slug,
          name: sub.name,
          description: sub.description,
          parentCollection: sub.parent_collection_slug,
          imageSrc: sub.image_src
        }))
      };
    }
  } catch (e) {}

  return collectionsData[collectionSlug] || null;
}

export function getAllCollections() {
  try {
    const db = getDB();
    const colRows = db.prepare("SELECT * FROM collections").all();
    if (colRows && colRows.length > 0) {
      return colRows.map((colRow) => {
        const subRows = db.prepare("SELECT * FROM subcategories WHERE parent_collection_slug = ?").all(colRow.slug);
        return {
          slug: colRow.slug,
          name: colRow.name,
          description: colRow.description,
          imageSrc: colRow.image_src,
          subcategories: subRows.map((sub) => ({
            slug: sub.slug,
            name: sub.name,
            description: sub.description,
            parentCollection: sub.parent_collection_slug,
            imageSrc: sub.image_src
          }))
        };
      });
    }
  } catch (e) {}

  return Object.values(collectionsData);
}

export function getSubcategory(collectionSlug, subcategorySlug) {
  const collection = getCollection(collectionSlug);
  if (!collection || !Array.isArray(collection.subcategories)) return null;
  return collection.subcategories.find((sub) => sub.slug === subcategorySlug) || null;
}

export function getCategory(categorySlug) {
  try {
    const db = getDB();
    const catRow = db.prepare("SELECT * FROM categories WHERE slug = ?").get(categorySlug);
    if (catRow) {
      return {
        slug: catRow.slug,
        name: catRow.name,
        parentCollection: catRow.parent_collection_slug,
        parentSubcategory: catRow.parent_subcategory_slug,
        description: catRow.description,
        imageSrc: catRow.image_src,
        imageAlt: catRow.image_alt,
        featured: Boolean(catRow.featured)
      };
    }
  } catch (e) {}

  return categoriesData[categorySlug] || null;
}

export function getCategoriesBySubcategory(collectionSlug, subcategorySlug) {
  try {
    const db = getDB();
    const catRows = db.prepare("SELECT * FROM categories WHERE parent_collection_slug = ? AND parent_subcategory_slug = ?").all(collectionSlug, subcategorySlug);
    if (catRows && catRows.length > 0) {
      return catRows.map((catRow) => ({
        slug: catRow.slug,
        name: catRow.name,
        parentCollection: catRow.parent_collection_slug,
        parentSubcategory: catRow.parent_subcategory_slug,
        description: catRow.description,
        imageSrc: catRow.image_src,
        imageAlt: catRow.image_alt,
        featured: Boolean(catRow.featured)
      }));
    }
  } catch (e) {}

  return Object.values(categoriesData).filter(
    (cat) => cat.parentCollection === collectionSlug && cat.parentSubcategory === subcategorySlug
  );
}

export function getAllCategories() {
  try {
    const db = getDB();
    const catRows = db.prepare("SELECT * FROM categories").all();
    if (catRows && catRows.length > 0) {
      return catRows.map((catRow) => ({
        slug: catRow.slug,
        name: catRow.name,
        parentCollection: catRow.parent_collection_slug,
        parentSubcategory: catRow.parent_subcategory_slug,
        description: catRow.description,
        imageSrc: catRow.image_src,
        imageAlt: catRow.image_alt,
        featured: Boolean(catRow.featured)
      }));
    }
  } catch (e) {}

  return Object.values(categoriesData);
}
