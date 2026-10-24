import { query, getOne, initDB } from "../lib/db/client.js";
import { collectionsData } from "../content/collections.js";
import { categoriesData } from "../content/categories.js";
import fs from "fs";

async function main() {
  await initDB();

  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, id ASC");
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, id ASC");
  const products = await query("SELECT * FROM products ORDER BY id ASC");

  const colSlugs = new Set(collections.map(c => c.slug));
  const subSlugs = new Set(subcategories.map(s => s.slug));
  const catSlugs = new Set(categories.map(c => c.slug));

  // Find products whose subcategory or category is not in DB
  const unlinkedProducts = products.filter(p => !subSlugs.has(p.parent_subcategory) || !catSlugs.has(p.parent_category));

  // Count products by parent_collection, parent_subcategory, parent_category
  const productTaxonomyCounts = {};
  for (const p of products) {
    const key = `${p.parent_collection} -> ${p.parent_subcategory} -> ${p.parent_category}`;
    if (!productTaxonomyCounts[key]) {
      productTaxonomyCounts[key] = { total: 0, published: 0, draft: 0, archived: 0, under_review: 0, products: [] };
    }
    productTaxonomyCounts[key].total++;
    productTaxonomyCounts[key][p.status] = (productTaxonomyCounts[key][p.status] || 0) + 1;
    productTaxonomyCounts[key].products.push({ id: p.id, slug: p.slug, name: p.name, status: p.status });
  }

  // Check categories with 0 products
  const emptyCategories = [];
  for (const c of categories) {
    const prods = products.filter(p => p.parent_category === c.slug);
    if (prods.length === 0) {
      emptyCategories.push({
        id: c.id,
        slug: c.slug,
        name: c.name,
        parent_col: c.parent_collection_slug,
        parent_sub: c.parent_subcategory_slug,
        is_active: c.is_active
      });
    }
  }

  // Check subcategories with 0 products
  const emptySubcategories = [];
  for (const s of subcategories) {
    const prods = products.filter(p => p.parent_subcategory === s.slug);
    const childCats = categories.filter(c => c.parent_subcategory_slug === s.slug);
    if (prods.length === 0) {
      emptySubcategories.push({
        id: s.id,
        slug: s.slug,
        name: s.name,
        parent_col: s.parent_collection_slug,
        is_active: s.is_active,
        childCategoryCount: childCats.length
      });
    }
  }

  // Check static collections vs DB collections
  const staticColKeys = Object.keys(collectionsData);
  const dbColSlugs = collections.map(c => c.slug);

  // Check static categories vs DB categories
  const staticCatKeys = Object.keys(categoriesData);
  const dbCatSlugs = categories.map(c => c.slug);

  // Check redirects in next.config.mjs
  const report = {
    totalCollections: collections.length,
    activeCollections: collections.filter(c => c.is_active).length,
    collections,
    totalSubcategories: subcategories.length,
    activeSubcategories: subcategories.filter(s => s.is_active).length,
    inactiveSubcategories: subcategories.filter(s => !s.is_active).length,
    subcategories,
    totalCategories: categories.length,
    activeCategories: categories.filter(c => c.is_active).length,
    inactiveCategories: categories.filter(c => !c.is_active).length,
    emptyCategories,
    emptySubcategories,
    totalProducts: products.length,
    productStatusCounts: products.reduce((acc, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {}),
    unlinkedProducts: unlinkedProducts.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      status: p.status,
      parent_collection: p.parent_collection,
      parent_subcategory: p.parent_subcategory,
      parent_category: p.parent_category
    })),
    productTaxonomyCounts,
    staticColKeys,
    dbColSlugs,
    staticCatKeys,
    dbCatSlugs
  };

  fs.writeFileSync("scripts/forensic-audit-report.json", JSON.stringify(report, null, 2));
  console.log("Report generated at scripts/forensic-audit-report.json");
  console.log(`Unlinked products count: ${unlinkedProducts.length}`);
  console.log(`Empty categories count: ${emptyCategories.length}`);
  console.log(`Empty subcategories count: ${emptySubcategories.length}`);
  process.exit(0);
}

main().catch(err => {
  console.error("Forensic audit error:", err);
  process.exit(1);
});
