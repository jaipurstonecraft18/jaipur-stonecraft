import { query } from '../lib/db/client.js';

async function main() {
  const collections = [
    'wall-art-reliefs',
    'temples-architectural-stonework',
    'fountains-water-features',
    'decorative-stone-art',
    'custom-bespoke-creations'
  ];

  for (const col of collections) {
    const prods = await query('SELECT id, name, parent_collection, parent_subcategory, parent_category, status FROM products WHERE parent_collection = ?', [col]);
    console.log(`\n=================== ${col.toUpperCase()} (${prods.length}) ===================`);
    for (const p of prods) {
      console.log(`${p.id} | ${p.name} | sub: ${p.parent_subcategory} | cat: ${p.parent_category} | status: ${p.status}`);
    }
  }
  process.exit(0);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
