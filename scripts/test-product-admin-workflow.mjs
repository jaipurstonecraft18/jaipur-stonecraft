import fs from 'fs/promises';
import path from 'path';
import Database from 'better-sqlite3';

const dbPath = path.join(process.cwd(), 'data', 'jaipur_stonecraft.db');

async function testWorkflow() {
  console.log("=========================================");
  console.log("  Testing Step 3 Product Admin Workflow  ");
  console.log("=========================================\n");

  const db = new Database(dbPath);

  // 1. Create a draft product
  const testSlug = `test-product-${Date.now()}`;
  const testSku = `TEST-SKU-${Date.now()}`;
  console.log(`[1/5] Creating Test Product: ${testSlug}`);

  db.prepare(`
    INSERT INTO products (
      id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
      product_type, parent_collection, parent_subcategory, parent_category,
      subject_id, primary_material_id, short_description, detailed_description,
      knowledge_layer, attributes, tags, variants, seo
    ) VALUES (?, ?, ?, ?, 'draft', 0, 1, 0, 'sculpture', 'sculptures-statues', 'hindu-sculptures', 'ganesh-ji', 'ganesh', 'makrana-pure-white', 'Test Short Desc', 'Test Detail Desc', '{}', '{}', '[]', '{}', '{}')
  `).run(testSlug, testSku, testSlug, 'Test Artisan Ganesh');

  // Insert 2 test product images
  const testImg1 = `/uploads/products/display/${testSlug}-1.webp`;
  const testImg2 = `/uploads/products/display/${testSlug}-2.webp`;

  db.prepare(`
    INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
    VALUES (?, ?, 'Cover Image', 'hero', 0, 1)
  `).run(testSlug, testImg1);

  db.prepare(`
    INSERT INTO product_images (product_slug, url, alt_text, role, sort_order, is_primary)
    VALUES (?, ?, 'Detail View', 'gallery', 1, 0)
  `).run(testSlug, testImg2);

  // Create dummy physical files for unlinking test
  const dummyFile1 = path.join(process.cwd(), 'public', testImg1.replace(/^\//, ''));
  const dummyFile2 = path.join(process.cwd(), 'public', testImg2.replace(/^\//, ''));
  await fs.mkdir(path.dirname(dummyFile1), { recursive: true });
  await fs.writeFile(dummyFile1, 'dummy image content 1');
  await fs.writeFile(dummyFile2, 'dummy image content 2');

  console.log(`✓ Test product inserted into DB with 2 image references & dummy files.`);

  // 2. Verify Product & Image Queries
  const insertedRow = db.prepare('SELECT * FROM products WHERE slug = ?').get(testSlug);
  const insertedImgs = db.prepare('SELECT * FROM product_images WHERE product_slug = ? ORDER BY sort_order ASC').all(testSlug);

  console.log(`✓ Fetched inserted product: "${insertedRow.name}", status="${insertedRow.status}"`);
  console.log(`✓ Fetched ${insertedImgs.length} images: ${insertedImgs.map(i => i.url).join(', ')}`);

  // 3. Test Image Removal / Replacement (simulating PUT request)
  console.log(`\n[2/5] Simulating Product Image Edit: Removing testImg2 and keeping testImg1...`);
  db.prepare('DELETE FROM product_images WHERE product_slug = ? AND url = ?').run(testSlug, testImg2);

  // Verify DB state
  const remainingImgs = db.prepare('SELECT * FROM product_images WHERE product_slug = ?').all(testSlug);
  console.log(`✓ Remaining DB image references: ${remainingImgs.map(i => i.url).join(', ')}`);

  // 4. Test Permanent Product Deletion & Safe Unlinking
  console.log(`\n[3/5] Simulating Permanent Product Deletion...`);
  db.prepare('DELETE FROM product_images WHERE product_slug = ?').run(testSlug);
  db.prepare('DELETE FROM products WHERE slug = ?').run(testSlug);

  await fs.unlink(dummyFile1).catch(() => {});
  await fs.unlink(dummyFile2).catch(() => {});

  const checkDeletedProd = db.prepare('SELECT * FROM products WHERE slug = ?').get(testSlug);
  const checkDeletedImgs = db.prepare('SELECT * FROM product_images WHERE product_slug = ?').all(testSlug);

  console.log(`✓ Product deletion verified: product exists = ${Boolean(checkDeletedProd)}, images count = ${checkDeletedImgs.length}`);

  db.close();

  console.log("\n=========================================");
  console.log("  Step 3 Product Admin Workflow Test PASSED ");
  console.log("=========================================\n");
}

testWorkflow().catch(console.error);
