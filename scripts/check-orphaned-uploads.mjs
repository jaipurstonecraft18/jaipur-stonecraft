import fs from 'fs/promises';
import path from 'path';
import Database from 'better-sqlite3';

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories', 'display');

async function checkOrphans() {
  const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');
  const db = new Database(dbPath);

  const collections = db.prepare('SELECT image_src FROM collections').all();
  const categories = db.prepare('SELECT image_src FROM categories').all();
  const subcategories = db.prepare('SELECT image_src FROM subcategories WHERE image_src IS NOT NULL').all();
  const productImages = db.prepare('SELECT url FROM product_images').all();
  const pageSections = db.prepare('SELECT content_json FROM page_sections').all();
  const projects = db.prepare('SELECT image_src, gallery FROM projects').all();

  const referencedSet = new Set();

  collections.forEach(r => r.image_src && referencedSet.add(r.image_src));
  categories.forEach(r => r.image_src && referencedSet.add(r.image_src));
  subcategories.forEach(r => r.image_src && referencedSet.add(r.image_src));
  productImages.forEach(r => r.url && referencedSet.add(r.url));
  
  pageSections.forEach(r => {
    if (r.content_json) {
      const matches = r.content_json.match(/\/uploads\/[^\s"'\\]+/g);
      if (matches) matches.forEach(m => referencedSet.add(m));
    }
  });

  projects.forEach(r => {
    if (r.image_src) referencedSet.add(r.image_src);
    if (r.gallery) {
      const matches = r.gallery.match(/\/uploads\/[^\s"'\\]+/g);
      if (matches) matches.forEach(m => referencedSet.add(m));
    }
  });

  const files = await fs.readdir(uploadDir);
  console.log(`Checking ${files.length} upload files in public/uploads/categories/display/ ...`);

  let activeCount = 0;
  let orphanCount = 0;
  const orphanFiles = [];

  for (const file of files) {
    const webPath = `/uploads/categories/display/${file}`;
    if (referencedSet.has(webPath)) {
      activeCount++;
    } else {
      orphanCount++;
      orphanFiles.push(file);
      const fullPath = path.join(uploadDir, file);
      const stat = await fs.stat(fullPath);
      console.log(`Orphaned asset: ${file} (${(stat.size / 1024).toFixed(0)} KB)`);
    }
  }

  console.log(`Summary: ${activeCount} active referenced images, ${orphanCount} orphaned unreferenced images.`);
  db.close();

  return orphanFiles;
}

checkOrphans().catch(console.error);
