import fs from "fs";
import path from "path";
import crypto from "crypto";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "jaipur_stonecraft.db");
const db = new Database(dbPath);

console.log("=== JAIPUR STONECRAFT IMAGE AUDIT ===");

// 1. Database Image Records
const productImagesRows = db.prepare("SELECT * FROM product_images").all();
const collectionsRows = db.prepare("SELECT slug, name, image_src FROM collections").all();
const categoriesRows = db.prepare("SELECT slug, name, image_src FROM categories").all();
const subcategoriesRows = db.prepare("SELECT slug, name, image_src FROM subcategories").all();
const productsRows = db.prepare("SELECT slug, name, attributes FROM products").all();

console.log(`- Product Image DB Records: ${productImagesRows.length}`);
console.log(`- Collection DB Records: ${collectionsRows.length}`);
console.log(`- Subcategory DB Records: ${subcategoriesRows.length}`);
console.log(`- Category DB Records: ${categoriesRows.length}`);

// 2. Filesystem Audit in public/
function scanDir(dirPath, fileList = []) {
  if (!fs.existsSync(dirPath)) return fileList;
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath, fileList);
    } else {
      const ext = path.extname(item).toLowerCase();
      if ([".webp", ".png", ".jpg", ".jpeg", ".svg", ".avif"].includes(ext)) {
        const fileBuffer = fs.readFileSync(fullPath);
        const md5 = crypto.createHash("md5").update(fileBuffer).digest("hex");
        const relPath = "/" + path.relative(path.join(process.cwd(), "public"), fullPath).replace(/\\/g, "/");
        fileList.push({
          relPath,
          fullPath,
          sizeBytes: stat.size,
          sizeKb: (stat.size / 1024).toFixed(1),
          ext,
          md5
        });
      }
    }
  }
  return fileList;
}

const allPublicImages = scanDir(path.join(process.cwd(), "public"));
console.log(`\n- Total Physical Images in public/: ${allPublicImages.length}`);

let totalBytes = 0;
allPublicImages.forEach(img => totalBytes += img.sizeBytes);
console.log(`- Total Physical Image Storage: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);

// 3. Find Exact Hash Duplicates
const md5Map = new Map();
allPublicImages.forEach(img => {
  if (!md5Map.has(img.md5)) {
    md5Map.set(img.md5, []);
  }
  md5Map.get(img.md5).push(img);
});

const exactDuplicates = [];
md5Map.forEach((imgs, md5) => {
  if (imgs.length > 1) {
    exactDuplicates.push({ md5, count: imgs.length, files: imgs.map(i => i.relPath) });
  }
});

console.log(`\n- Exact MD5 Duplicate Asset Groups: ${exactDuplicates.length}`);
exactDuplicates.forEach(group => {
  console.log(`  [MD5 ${group.md5.slice(0, 8)} - ${group.count} files]:`);
  group.files.forEach(f => console.log(`    └─ ${f}`));
});

// 4. Check DB Asset References vs Physical Files
const dbReferencedUrls = new Set();
productImagesRows.forEach(row => { if (row.url) dbReferencedUrls.add(row.url); });
collectionsRows.forEach(row => { if (row.image_src) dbReferencedUrls.add(row.image_src); });
subcategoriesRows.forEach(row => { if (row.image_src) dbReferencedUrls.add(row.image_src); });
categoriesRows.forEach(row => { if (row.image_src) dbReferencedUrls.add(row.image_src); });

console.log(`\n- Unique Image URLs referenced in DB: ${dbReferencedUrls.size}`);

const unreferencedFiles = [];
allPublicImages.forEach(img => {
  if (!dbReferencedUrls.has(img.relPath) && !img.relPath.includes("site-logo") && !img.relPath.includes("favicon") && !img.relPath.includes("og-")) {
    unreferencedFiles.push(img.relPath);
  }
});

console.log(`- Physical files not directly in primary DB columns: ${unreferencedFiles.length}`);

db.close();
