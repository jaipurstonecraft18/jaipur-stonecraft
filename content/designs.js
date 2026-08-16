/**
 * Jaipur Stonecraft — Designs Gateway
 * 
 * Re-exports & queries from the Central Product Database Store (/content/products-db/ products-db.js)
 * ensuring ONE SINGLE SOURCE OF TRUTH across the platform.
 */

import {
  productsDatabaseStore,
  getProductFromDB,
  getProductsByCategoryFromDB
} from "@/content/products-db/products-db.js";

export const designsData = productsDatabaseStore;

export function getDesign(categorySlug, designSlug) {
  return getProductFromDB(categorySlug, designSlug);
}

export function getDesignsByCategory(categorySlug) {
  return getProductsByCategoryFromDB(categorySlug);
}
