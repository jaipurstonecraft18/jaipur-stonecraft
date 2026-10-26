import fs from 'fs';
import path from 'path';

// Load env
if (fs.existsSync('.env.local')) {
  const envText = fs.readFileSync('.env.local', 'utf8');
  for (const line of envText.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
    }
  }
}

async function run() {
  console.log('--- 1. HOMEPAGE DISCOVERY SLIDERS ---');
  const { getPageSection } = await import('../lib/db/content.js');
  const { popularStatuesData, architecturalArtData } = await import('../content/discovery-sliders.js');
  
  const statuesFromDb = await getPageSection('homepage_discovery_statues', popularStatuesData);
  const archFromDb = await getPageSection('homepage_discovery_arch', architecturalArtData);

  console.log('Statues count:', statuesFromDb?.items?.length);
  for (const item of (statuesFromDb?.items || []).slice(0, 5)) {
    console.log(`\nItem: ${item.title} (${item.entitySlug || item.id})`);
    console.log(`  customImage: ${item.customImage}`);
    console.log(`  imageSrc:    ${item.imageSrc}`);
    console.log(`  fallback:    ${item.fallbackImage}`);
    
    // Check files on disk
    const rawSrc = item.customImage || item.imageSrc || item.fallbackImage;
    if (rawSrc) {
      const filePath = path.join(process.cwd(), 'public', rawSrc.replace(/^\//, ''));
      const exists = fs.existsSync(filePath);
      console.log(`  Resolved file: ${filePath} (exists: ${exists})`);
      if (exists) {
        const stats = fs.statSync(filePath);
        console.log(`  File size: ${stats.size} bytes`);
      }
    }
  }

  console.log('\n--- 2. PRODUCT DETAIL GALLERY & ADDITIONAL ANGLES ---');
  // Check products in DB or product database
  const { query } = await import('../lib/db/mysql.js');
  const images = await query(`
    SELECT pi.id, pi.product_id, p.slug as product_slug, p.name as product_name, pi.url, pi.is_primary, pi.role, pi.display_order
    FROM product_images pi
    JOIN products p ON pi.product_id = p.id
    WHERE p.slug = 'blessing-ganesh-statue'
    ORDER BY pi.is_primary DESC, pi.display_order ASC
  `);
  console.log('Blessing Ganesh Statue images:', images.length);
  for (const img of images) {
    console.log(`\nImage ID ${img.id} (primary: ${img.is_primary}, role: ${img.role}, order: ${img.display_order})`);
    console.log(`  URL in DB: ${img.url}`);
    const filePath = path.join(process.cwd(), 'public', img.url.replace(/^\//, ''));
    console.log(`  Disk path: ${filePath} (exists: ${fs.existsSync(filePath)})`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
