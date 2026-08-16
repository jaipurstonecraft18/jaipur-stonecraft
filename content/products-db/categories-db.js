/**
 * Jaipur Stonecraft — Central Product Database: Categories & Collections Store
 */

import { collectionsData } from "@/content/collections.js";
import { categoriesData } from "@/content/categories.js";

export const collectionsStore = collectionsData;
export const categoriesStore = categoriesData;

export function getCollectionFromDB(slug) {
  return collectionsStore[slug] || null;
}

export function getSubcategoryFromDB(collectionSlug, subcategorySlug) {
  const col = collectionsStore[collectionSlug];
  if (!col) return null;
  return col.subcategories.find((sub) => sub.slug === subcategorySlug) || null;
}

export function getCategoryFromDB(slug) {
  return categoriesStore[slug] || null;
}

export function getCategoriesBySubcategoryFromDB(collectionSlug, subcategorySlug) {
  return Object.values(categoriesStore).filter(
    (cat) => cat.parentCollection === collectionSlug && cat.parentSubcategory === subcategorySlug
  );
}
