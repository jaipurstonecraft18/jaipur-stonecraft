import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import sharp from 'sharp';

// Load .env
const envText = fs.readFileSync('.env', 'utf8');
const env = {};
for (const line of envText.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
}

async function inspect() {
  const pool = mysql.createPool(env.DATABASE_URL);
  
  console.log('=== 1. HOMEPAGE DISCOVERY SLIDER ITEMS ===');
  const [pageSecRows] = await pool.query("SELECT key_name, content_json FROM page_sections WHERE key_name IN ('homepage_discovery_statues', 'homepage_discovery_arch')");
  console.log('Page sections in DB:', pageSecRows.length);
  for (const row of pageSecRows) {
    console.log(`Key: ${row.key_name}`);
    const data = JSON.parse(row.content_json || '{}');
    if (data.items) {
      for (const item of data.items) {
        console.log(`  - Title: ${item.title}`);
        console.log(`    customImage: ${item.customImage}`);
        console.log(`    imageSrc:    ${item.imageSrc}`);
        console.log(`    fallback:    ${item.fallbackImage}`);
        const effective = item.customImage || item.imageSrc || item.fallbackImage;
        if (effective) {
          const filePath = path.join(process.cwd(), 'public', effective.replace(/^\//, ''));
          if (fs.existsSync(filePath)) {
            const meta = await sharp(filePath).metadata();
            console.log(`    DISK FILE: ${meta.width}x${meta.height}, ${meta.format}, size: ${fs.statSync(filePath).size} bytes`);
          } else {
            console.log(`    DISK FILE NOT FOUND: ${filePath}`);
          }
        }
      }
    }
  }

  console.log('\n=== 2. PRODUCTS WITH REAL IMAGES IN DB ===');
  const [prodImgRows] = await pool.query(`
    SELECT pi.id, pi.product_slug, pi.url, pi.is_primary, pi.role, pi.sort_order, p.name as product_name
    FROM product_images pi
    LEFT JOIN products p ON p.slug = pi.product_slug
    WHERE pi.url NOT LIKE '%placehold.co%'
    ORDER BY pi.product_slug, pi.is_primary DESC, pi.sort_order ASC
  `);

  console.log(`Total real product images in DB: ${prodImgRows.length}`);
  
  // Group by product_slug
  const byProduct = {};
  for (const row of prodImgRows) {
    if (!byProduct[row.product_slug]) byProduct[row.product_slug] = [];
    byProduct[row.product_slug].push(row);
  }

  for (const [slug, imgs] of Object.entries(byProduct)) {
    console.log(`\nProduct: ${slug} ("${imgs[0]?.product_name}") - ${imgs.length} image(s):`);
    for (const img of imgs) {
      console.log(`  [${img.is_primary ? 'PRIMARY' : 'SECONDARY'}] [role: ${img.role}] URL: ${img.url}`);
      const filePath = path.join(process.cwd(), 'public', img.url.replace(/^\//, ''));
      if (fs.existsSync(filePath)) {
        const meta = await sharp(filePath).metadata();
        console.log(`    -> DISK FILE: ${meta.width}x${meta.height}, format: ${meta.format}, size: ${fs.statSync(filePath).size} bytes`);
      } else {
        console.log(`    -> NOT FOUND on disk: ${filePath}`);
      }
    }
  }

  console.log('\n=== 3. CATEGORY ROUTES FOR KEY PRODUCTS ===');
  const [cols] = await pool.query('SHOW COLUMNS FROM products');
  console.log('Columns on products:', cols.map(c => c.Field));
  
  const [catRows] = await pool.query(`
    SELECT p.id, p.name, p.slug, p.parent_category
    FROM products p
    WHERE p.slug IN ('radha-krishna-jugal-roop-with-gau-mata', 'white-marble-sai-baba-statue', 'blessing-ganesh-statue', 'ganesh-ji')
  `);
  console.log(catRows);

  await pool.end();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
