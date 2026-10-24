import fs from "fs";
import path from "path";

const baseline = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "audit-baseline.json"), "utf8"));

const nonSculpture = baseline.products.filter(p => p.parent_collection !== 'sculptures-statues');

const map = {};
for (const p of nonSculpture) {
  const key = `${p.parent_collection} -> ${p.parent_subcategory} -> ${p.parent_category}`;
  if (!map[key]) map[key] = [];
  map[key].push(p);
}

let out = `TOTAL NON-SCULPTURE PRODUCTS: ${nonSculpture.length}\nTOTAL PATHS: ${Object.keys(map).length}\n\n`;

for (const [key, prods] of Object.entries(map).sort()) {
  out += `====================================================================\n`;
  out += `PATH: ${key} (${prods.length} products)\n`;
  out += `====================================================================\n`;
  for (const p of prods) {
    out += `ID: ${p.id} | SKU: ${p.sku} | Slug: ${p.slug}\n`;
    out += `Name: ${p.name}\n`;
    out += `Type: ${p.product_type} | Material: ${p.primary_material_id} | Status: ${p.status}\n`;
    out += `Desc: ${p.short_description || '(no description)'}\n`;
    out += `Images: ${p.images.map(i => i.url).join(', ')}\n\n`;
  }
}

fs.writeFileSync(path.join(process.cwd(), "scripts", "audit-all-paths.txt"), out, "utf8");
console.log("Wrote complete non-sculpture audit to scripts/audit-all-paths.txt");
