import { query } from "../lib/db/client.js";

async function main() {
  const prods = await query("SELECT slug, short_description, detailed_description FROM products WHERE short_description LIKE '%/collections/%' OR detailed_description LIKE '%/collections/%'");
  console.log('Products with /collections/ in descriptions:', prods.length);
  if (prods.length > 0) console.log(prods);

  const cats = await query("SELECT slug, description FROM categories WHERE description LIKE '%/collections/%'");
  console.log('Categories with /collections/ in descriptions:', cats.length);
  if (cats.length > 0) console.log(cats);

  const subs = await query("SELECT slug, description FROM subcategories WHERE description LIKE '%/collections/%'");
  console.log('Subcategories with /collections/ in descriptions:', subs.length);
  if (subs.length > 0) console.log(subs);

  const cols = await query("SELECT slug, description FROM collections WHERE description LIKE '%/collections/%'");
  console.log('Collections with /collections/ in descriptions:', cols.length);
  if (cols.length > 0) console.log(cols);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
