import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

function findImages(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!full.includes('node_modules') && !full.includes('.next') && !full.includes('.git') && !full.includes('.tempmediaStorage')) {
        results = results.concat(findImages(full));
      }
    } else if (/\.(webp|jpg|jpeg|png)$/i.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

async function run() {
  const allImgs = findImages('public');
  console.log('Total images in public:', allImgs.length);

  const terms = ['shiva', 'mahadev', 'krishna', 'radha', 'hanuman', 'durga', 'saraswati', 'lakshmi', 'ram', 'buddha', 'bust', 'modi', 'sai'];
  for (const t of terms) {
    const matches = allImgs.filter(f => f.toLowerCase().includes(t));
    console.log(`\n=== Term: ${t} (${matches.length} matches) ===`);
    for (const m of matches.slice(0, 10)) {
      try {
        const meta = await sharp(m).metadata();
        const rel = path.relative(process.cwd(), m).replace(/\\/g, '/');
        console.log(`  ${rel} -> ${meta.width}x${meta.height} (${meta.format}, ${fs.statSync(m).size} bytes)`);
      } catch (e) {}
    }
  }
  console.log('\n=== PRODUCTS WITH REAL IMAGES IN DATABASE ===');
  const envText = fs.readFileSync('.env', 'utf8');
  const env = {};
  for (const line of envText.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  const mysql = (await import('mysql2/promise')).default;
  const pool = mysql.createPool(env.DATABASE_URL);
  const [products] = await pool.query(`
    SELECT p.id, p.name, p.slug, p.parent_category, pi.url as primary_image
    FROM products p
    LEFT JOIN product_images pi ON pi.product_slug = p.slug AND pi.is_primary = 1
    WHERE pi.url NOT LIKE '%placehold.co%' AND pi.url IS NOT NULL
    ORDER BY p.parent_category, p.name
  `);

  console.log('Published products with real images:', products.length);
  for (const p of products) {
    console.log(`  [${p.parent_category}] "${p.name}" (${p.slug}) -> ${p.primary_image}`);
  }
  await pool.end();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
