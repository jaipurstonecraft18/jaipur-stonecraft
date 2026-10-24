import fs from "fs";
import path from "path";

const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

const nonSculptureProducts = baseline.products.filter(p => p.parent_collection !== 'sculptures-statues');

console.log(`Total non-sculpture products: ${nonSculptureProducts.length}`);

// Group by current collection and category
const byCollection = {};
nonSculptureProducts.forEach(p => {
  if (!byCollection[p.parent_collection]) byCollection[p.parent_collection] = {};
  if (!byCollection[p.parent_collection][p.parent_category]) byCollection[p.parent_collection][p.parent_category] = [];
  byCollection[p.parent_collection][p.parent_category].push({
    id: p.id,
    sku: p.sku,
    name: p.name,
    slug: p.slug,
    status: p.status,
    material: p.primary_material_id,
    type: p.product_type,
    desc: p.short_description,
    images: p.images.map(img => img.url)
  });
});

fs.writeFileSync(path.join(process.cwd(), "scripts", "non-sculpture-products-breakdown.json"), JSON.stringify(byCollection, null, 2), "utf8");
console.log("Saved non-sculpture products breakdown to scripts/non-sculpture-products-breakdown.json");
