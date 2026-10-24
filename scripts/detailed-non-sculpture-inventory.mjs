import fs from "fs";
import path from "path";

const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

const nonSculpture = baseline.products.filter(p => p.parent_collection !== 'sculptures-statues');

console.log("NON-SCULPTURE INVENTORY OVERVIEW:");
console.log(`Total non-sculpture items: ${nonSculpture.length}`);

// Group by collection and category
const map = {};
for (const p of nonSculpture) {
  const key = `${p.parent_collection} -> ${p.parent_subcategory} -> ${p.parent_category}`;
  if (!map[key]) map[key] = [];
  map[key].push(p);
}

for (const [key, prods] of Object.entries(map)) {
  console.log(`\n=== PATH: ${key} (${prods.length} products) ===`);
  for (const p of prods) {
    console.log(`- [${p.id}] ${p.name} (type: ${p.product_type}, mat: ${p.primary_material_id}, status: ${p.status})`);
  }
}
