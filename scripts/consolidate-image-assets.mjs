import fs from "fs";
import path from "path";
import crypto from "crypto";
import Database from "better-sqlite3";

const dbPath = path.join(process.cwd(), "data", "jaipur_stonecraft.db");
const db = new Database(dbPath);

console.log("=== PHASE 4 SAFE IMAGE CONSOLIDATION & CLEANUP ===");

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
        fileList.push({ relPath, fullPath, sizeBytes: stat.size, md5 });
      }
    }
  }
  return fileList;
}

const allPublicImages = scanDir(path.join(process.cwd(), "public"));
const md5Map = new Map();

allPublicImages.forEach((img) => {
  if (!md5Map.has(img.md5)) {
    md5Map.set(img.md5, []);
  }
  md5Map.get(img.md5).push(img);
});

let savedBytes = 0;
let deletedFilesCount = 0;

md5Map.forEach((imgs, md5) => {
  if (imgs.length > 1) {
    // Keep the first file as canonical source
    const canonical = imgs[0];
    const duplicates = imgs.slice(1);

    duplicates.forEach((dup) => {
      // Check if DB references dup.relPath; if so, update to canonical.relPath
      const tablesAndCols = [
        { table: "product_images", col: "url" },
        { table: "collections", col: "image_src" },
        { table: "subcategories", col: "image_src" },
        { table: "categories", col: "image_src" },
        { table: "projects", col: "image_src" }
      ];

      let isReferenced = false;
      for (const { table, col } of tablesAndCols) {
        const count = db.prepare(`SELECT COUNT(*) as c FROM ${table} WHERE ${col} = ?`).get(dup.relPath).c;
        if (count > 0) {
          db.prepare(`UPDATE ${table} SET ${col} = ? WHERE ${col} = ?`).run(canonical.relPath, dup.relPath);
          console.log(`- Updated ${count} DB records in ${table}.${col} from ${dup.relPath} to canonical ${canonical.relPath}`);
        }
      }

      // Safe deletion of exact MD5 duplicate file
      if (fs.existsSync(dup.fullPath)) {
        fs.unlinkSync(dup.fullPath);
        savedBytes += dup.sizeBytes;
        deletedFilesCount++;
        console.log(`- Safely removed exact duplicate: ${dup.relPath} (Saved ${(dup.sizeBytes / 1024).toFixed(1)} KB)`);
      }
    });
  }
});

console.log(`\n=== CONSOLIDATION SUMMARY ===`);
console.log(`- Exact Duplicate Files Removed: ${deletedFilesCount}`);
console.log(`- Total Disk Storage Saved: ${(savedBytes / (1024 * 1024)).toFixed(2)} MB`);

db.close();
