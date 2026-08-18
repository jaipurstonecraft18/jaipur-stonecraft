import { query, getOne, execute, initDB } from "../lib/db/client.js";
import { formatProductFromRow, getAllProducts } from "../lib/db/products.js";

async function verify() {
  console.log("=== COMPREHENSIVE PRODUCT SYSTEM VERIFICATION ===");

  await initDB();

  // 1. Check all products retrieval
  const allProds = await getAllProducts();
  console.log(`[VERIFY 1] Total published products retrieved via getAllProducts(): ${allProds.length}`);

  if (allProds.length === 0) {
    console.error("❌ FAILED: 0 products retrieved!");
    process.exit(1);
  }

  // 2. Create a test product
  const testSlug = `test-verify-product-${Date.now()}`;
  const testSku = `JSC-TEST-${Date.now().toString().slice(-6)}`;
  console.log(`[VERIFY 2] Creating test product with slug: ${testSlug}...`);

  const insertResult = await execute(`
    INSERT INTO products (
      id, sku, slug, name, status, is_featured, is_new_arrival, is_custom_only,
      product_type, parent_collection, parent_subcategory, parent_category,
      subject_id, primary_material_id, short_description, detailed_description,
      knowledge_layer, attributes, tags, variants, seo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    testSlug,
    testSku,
    testSlug,
    "Test Verification Statue",
    "published",
    1,
    1,
    0,
    "statue",
    "sculptures-statues",
    "hindu-sculptures",
    "ganesh-ji",
    "ganesh",
    "makrana-pure-white",
    "A test verification statue crafted for automated testing.",
    "Detailed description for test statue.",
    JSON.stringify({ whatIsThis: "Test Statue" }),
    JSON.stringify({ colorFamily: "White" }),
    JSON.stringify(["Test"]),
    JSON.stringify({}),
    JSON.stringify({ title: "Test Statue" })
  ]);

  console.log(`[VERIFY 2] Insert affectedRows: ${insertResult.affectedRows}`);
  if (insertResult.affectedRows === 0) {
    console.error("❌ FAILED: Insert returned 0 affected rows!");
    process.exit(1);
  }

  // 3. Read back the test product
  const testRow = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  if (!testRow) {
    console.error("❌ FAILED: Created product not found in DB read back!");
    process.exit(1);
  }
  const formattedTestProd = await formatProductFromRow(testRow);
  console.log(`[VERIFY 3] Read back created product successfully: Name="${formattedTestProd.name}", SKU="${formattedTestProd.sku}"`);

  // 4. Edit the test product
  console.log(`[VERIFY 4] Updating test product...`);
  const updateResult = await execute("UPDATE products SET name = ? WHERE slug = ?", ["Updated Test Verification Statue", testSlug]);
  console.log(`[VERIFY 4] Update affectedRows: ${updateResult.affectedRows}`);

  const updatedRow = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  if (updatedRow.name !== "Updated Test Verification Statue") {
    console.error("❌ FAILED: Updated product name mismatch!");
    process.exit(1);
  }
  console.log(`[VERIFY 4] Updated product read back successfully: Name="${updatedRow.name}"`);

  // 5. Delete (archive) the test product
  console.log(`[VERIFY 5] Deleting (cleaning up) test product...`);
  const deleteResult = await execute("DELETE FROM products WHERE slug = ?", [testSlug]);
  console.log(`[VERIFY 5] Delete affectedRows: ${deleteResult.affectedRows}`);

  const verifyDeleted = await getOne("SELECT * FROM products WHERE slug = ?", [testSlug]);
  if (verifyDeleted) {
    console.error("❌ FAILED: Test product still exists after DELETE!");
    process.exit(1);
  }
  console.log(`[VERIFY 5] Test product deleted cleanly.`);

  console.log("\n✅ ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  process.exit(0);
}

verify().catch((err) => {
  console.error("❌ Verification exception:", err);
  process.exit(1);
});
