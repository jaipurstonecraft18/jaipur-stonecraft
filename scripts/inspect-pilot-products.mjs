import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "jaipur_stonecraft.db");
const db = new Database(dbPath);

console.log("=== INSPECTING PRODUCTS FOR PHASE 5 PILOT ===");

const totalProducts = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
const publishedProducts = db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'published'").get().count;

console.log(`- Total DB Products: ${totalProducts}`);
console.log(`- Published Products: ${publishedProducts}`);

// Select 15 high-priority products across Priority A categories
const pilotCategorySlugs = [
  "ganesh-ji",
  "shiva-ji",
  "krishna-ji",
  "marble-home-temples",
  "jali-screens",
  "tiered-marble-fountains",
  "pedestals-plinths",
  "bespoke-portrait-busts"
];

const selectedProducts = db.prepare(`
  SELECT id, slug, name, parent_collection, parent_subcategory, parent_category, primary_material_id, status, attributes, seo
  FROM products
  WHERE parent_category IN (${pilotCategorySlugs.map(() => '?').join(',')})
  LIMIT 15
`).all(...pilotCategorySlugs);

console.log(`\nSelected ${selectedProducts.length} Pilot Products across Priority A Categories:`);
selectedProducts.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.parent_category}] ${p.name} (slug: ${p.slug})`);
});

db.close();
