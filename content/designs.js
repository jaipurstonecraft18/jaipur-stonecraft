/**
 * Jaipur Stonecraft — Designs Gateway
 * 
 * Re-exports & queries from the Central Product Database Store (/content/products-db/products-db.js)
 * ensuring ONE SINGLE SOURCE OF TRUTH across the platform.
 */

import {
  getProductFromDB,
  getProductsByCategoryFromDB
} from "@/content/products-db/products-db.js";

export async function getDesign(categorySlug, designSlug) {
  return await getProductFromDB(categorySlug, designSlug);
}

export async function getDesignsByCategory(categorySlug) {
  return await getProductsByCategoryFromDB(categorySlug);
}
