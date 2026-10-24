import fs from "fs";
import path from "path";

const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "scripts", "non-sculpture-products-breakdown.json"), "utf8"));

for (const [colSlug, cats] of Object.entries(data)) {
  console.log(`\n======================================================`);
  console.log(`COLLECTION: ${colSlug} (Total categories: ${Object.keys(cats).length})`);
  console.log(`======================================================`);
  for (const [catSlug, prods] of Object.entries(cats)) {
    console.log(`\n--- Category: ${catSlug} (${prods.length} products) ---`);
    for (const p of prods) {
      console.log(`  [${p.id}] ${p.name} | Type: ${p.type} | Mat: ${p.material}`);
      console.log(`     Desc: ${(p.desc || '').substring(0, 100)}...`);
    }
  }
}
