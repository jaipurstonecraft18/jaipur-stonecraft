/**
 * Jaipur Stonecraft — Products Data Provider
 * 
 * Re-exports & queries from the Central Product Database Store (/content/products-db/)
 */

import { categoriesData } from "./categories.js";
import { getProductFromDB, getProductsByCategoryFromDB } from "@/content/products-db/products-db.js";

export const productsData = categoriesData;

export function getProductsBySubcategory(collectionSlug, subcategorySlug) {
  return Object.values(categoriesData).filter(
    (cat) => cat.parentCollection === collectionSlug && cat.parentSubcategory === subcategorySlug
  );
}

export function getProduct(collectionSlug, subcategorySlug, categorySlug) {
  const item = categoriesData[categorySlug];
  if (item && item.parentCollection === collectionSlug && item.parentSubcategory === subcategorySlug) {
    return item;
  }
  return null;
}

export { getProductFromDB, getProductsByCategoryFromDB };
