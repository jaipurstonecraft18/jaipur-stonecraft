import fs from "fs";
import path from "path";

const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

console.log("=== COLLECTIONS ===");
baseline.collections.forEach(c => {
  console.log(`- ${c.name} (${c.slug}) [ID: ${c.id}]`);
});

console.log("\n=== SUBCATEGORIES BY COLLECTION ===");
baseline.collections.forEach(col => {
  console.log(`\nCollection: ${col.name} (${col.slug})`);
  const subs = baseline.subcategories.filter(s => s.parent_collection_slug === col.slug);
  subs.forEach(s => {
    console.log(`  Subcategory: ${s.name} (${s.slug}) [ID: ${s.id}]`);
    const cats = baseline.categories.filter(c => c.parent_collection_slug === col.slug && c.parent_subcategory_slug === s.slug);
    cats.forEach(c => {
      const prodCount = baseline.products.filter(p => p.parent_category === c.slug).length;
      console.log(`    Category: ${c.name} (${c.slug}) [ID: ${c.id}] -> ${prodCount} products`);
    });
  });
});
