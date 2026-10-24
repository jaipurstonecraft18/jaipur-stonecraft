import { query, initDB } from "../lib/db/client.js";

async function run() {
  await initDB();
  const res1 = await query("UPDATE products SET parent_subcategory = 'tiered-classical-fountains' WHERE parent_collection = 'fountains-water-features' AND parent_category IN ('tiered-fountains', 'central-courtyard-fountains', 'lotus-basin-fountains')");
  const res2 = await query("UPDATE products SET parent_subcategory = 'wall-freestanding-fountains' WHERE parent_collection = 'fountains-water-features' AND parent_category IN ('wall-fountains', 'freestanding-fountains')");
  const res3 = await query("UPDATE products SET parent_subcategory = 'sculptural-water-features' WHERE parent_collection = 'fountains-water-features' AND parent_category IN ('cascading-water-walls', 'poolside-stone-waterfalls', 'figurative-water-sculptures', 'abstract-water-sculptures')");

  console.log(`Updated tiered: ${res1.affectedRows}, wall/freestanding: ${res2.affectedRows}, sculptural: ${res3.affectedRows}`);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
