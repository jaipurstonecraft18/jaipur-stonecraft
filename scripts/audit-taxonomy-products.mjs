import { query } from "../lib/db/client.js";
import fs from "fs";
import path from "path";

async function runAudit() {
  console.log("Starting Taxonomy & Products Baseline Audit...");

  // 1. Collections
  const collections = await query("SELECT * FROM collections ORDER BY id ASC");
  console.log(`Collections count: ${collections.length}`);

  // 2. Subcategories
  const subcategories = await query("SELECT * FROM subcategories ORDER BY parent_collection_slug, sort_order, id");
  console.log(`Subcategories count: ${subcategories.length}`);

  // 3. Categories
  const categories = await query("SELECT * FROM categories ORDER BY parent_collection_slug, parent_subcategory_slug, sort_order, id");
  console.log(`Categories count: ${categories.length}`);

  // 4. Products count by status
  const statusCounts = await query("SELECT status, count(*) as count FROM products GROUP BY status");
  console.log("Product counts by status:", statusCounts);

  // 5. Products count by collection
  const collectionCounts = await query(`
    SELECT parent_collection, count(*) as count 
    FROM products 
    GROUP BY parent_collection
    ORDER BY count DESC
  `);
  console.log("Product counts by collection:", collectionCounts);

  // 6. Products count by category
  const categoryCounts = await query(`
    SELECT parent_collection, parent_subcategory, parent_category, count(*) as count
    FROM products
    GROUP BY parent_collection, parent_subcategory, parent_category
    ORDER BY parent_collection, parent_subcategory, parent_category
  `);

  // 7. All products
  const allProducts = await query(`
    SELECT p.id, p.sku, p.slug, p.name, p.status, p.is_featured, p.is_new_arrival, p.is_custom_only,
           p.product_type, p.parent_collection, p.parent_subcategory, p.parent_category,
           p.primary_material_id, p.short_description
    FROM products p
    ORDER BY p.parent_collection, p.parent_subcategory, p.parent_category, p.name
  `);

  // 8. Product images
  const allImages = await query(`
    SELECT product_slug, url, alt_text, role, sort_order, is_primary
    FROM product_images
    ORDER BY product_slug, is_primary DESC, sort_order ASC
  `);

  const imagesByProduct = new Map();
  for (const img of allImages) {
    if (!imagesByProduct.has(img.product_slug)) {
      imagesByProduct.set(img.product_slug, []);
    }
    imagesByProduct.get(img.product_slug).push(img);
  }

  // Combine product details with images
  const enrichedProducts = allProducts.map(p => ({
    ...p,
    images: (imagesByProduct.get(p.slug) || []).map(img => ({
      url: img.url,
      alt: img.alt_text,
      isPrimary: Boolean(img.is_primary)
    }))
  }));

  const auditReport = {
    timestamp: new Date().toISOString(),
    collections,
    subcategories,
    categories,
    statusCounts,
    collectionCounts,
    categoryCounts,
    totalProducts: allProducts.length,
    sculptureProductsCount: allProducts.filter(p => p.parent_collection === 'sculptures-statues').length,
    nonSculptureProductsCount: allProducts.filter(p => p.parent_collection !== 'sculptures-statues').length,
    products: enrichedProducts
  };

  const outputPath = path.join(process.cwd(), "scripts", "audit-baseline.json");
  fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2), "utf8");
  console.log(`Baseline audit saved to ${outputPath}`);
  console.log(`Total products: ${auditReport.totalProducts}`);
  console.log(`Sculpture & Statues products (PROTECTED): ${auditReport.sculptureProductsCount}`);
  console.log(`Non-Sculpture products to audit & migrate: ${auditReport.nonSculptureProductsCount}`);
  process.exit(0);
}

runAudit().catch(err => {
  console.error("Audit error:", err);
  process.exit(1);
});
