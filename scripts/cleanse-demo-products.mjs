import { query, execute } from "../lib/db/client.js";
import fs from "fs/promises";
import path from "path";

async function executeProductCleanse() {
  console.log("=== JAIPUR STONECRAFT: PRODUCT CLEANSE & UNPUBLISH ===");

  const testProductSlugs = [
    'test-maruti-29431',
    'http-test-product-1787044914657',
    'phase9-crud-test-1787046726785'
  ];

  // 1. Delete image records for test products
  for (const slug of testProductSlugs) {
    const images = await query("SELECT url FROM product_images WHERE product_slug = ?", [slug]);
    for (const img of images) {
      if (img.url && img.url.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", img.url.replace(/^\//, ""));
        try {
          await fs.unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        } catch (e) {
          // ignore if already absent
        }
      }
    }
    await execute("DELETE FROM product_images WHERE product_slug = ?", [slug]);
    await execute("DELETE FROM products WHERE id = ? OR slug = ?", [slug, slug]);
    console.log(`Deleted test product record: ${slug}`);
  }

  // 2. Unpublish (set to draft) all 304 placeholder products that don't have real uploaded media
  const updateResult = await execute(`
    UPDATE products
    SET status = 'draft', updated_at = NOW()
    WHERE slug NOT IN (
      SELECT DISTINCT product_slug FROM product_images WHERE url LIKE '%/uploads/%'
    )
  `);
  console.log(`Set placeholder products to 'draft':`, updateResult);

  // 3. Ensure all 21 real products remain 'published'
  const publishedCount = await query("SELECT COUNT(*) as cnt FROM products WHERE status = 'published'");
  const draftCount = await query("SELECT COUNT(*) as cnt FROM products WHERE status = 'draft'");
  const totalCount = await query("SELECT COUNT(*) as cnt FROM products");

  console.log("\n=== VERIFICATION RESULTS ===");
  console.log(`Total Products in Database: ${totalCount[0].cnt}`);
  console.log(`Published Products (Real Artwork): ${publishedCount[0].cnt}`);
  console.log(`Draft Products (Unpublished Placeholders): ${draftCount[0].cnt}`);

  const publishedList = await query(`
    SELECT p.id, p.name, p.parent_category, p.status
    FROM products p
    WHERE p.status = 'published'
    ORDER BY p.name ASC
  `);
  console.log("\nPublished Products on Live Site:");
  publishedList.forEach((p, i) => console.log(`  ${i+1}. ${p.name} (${p.parent_category})`));

  process.exit(0);
}

executeProductCleanse().catch((err) => {
  console.error("Error executing cleanse:", err);
  process.exit(1);
});
