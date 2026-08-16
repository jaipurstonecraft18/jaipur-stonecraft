/**
 * Jaipur Stonecraft — Central Product Database Provider API
 * 
 * Delegates query operations directly to the persistent SQLite database engine.
 * STRICT RULE: Granite is strictly excluded.
 */

import {
  getProductBySlug as getProductFromDB,
  getProductsByCategory as getProductsByCategoryFromDB,
  getAllProducts as getAllProductsFromDB,
  getRelatedProductsFromDB,
  queryProductsDB,
  productsDatabaseStore
} from "@/lib/db/products.js";

export {
  getProductFromDB,
  getProductsByCategoryFromDB,
  getAllProductsFromDB,
  getRelatedProductsFromDB,
  queryProductsDB,
  productsDatabaseStore
};
