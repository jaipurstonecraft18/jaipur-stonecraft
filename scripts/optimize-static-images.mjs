import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public", "images");
const BACKUP_DIR = path.join(IMAGES_DIR, ".originals");

// Scan directory recursively
async function getFiles(dir) {
  let results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(await getFiles(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function optimizeImages() {
  console.log("=== STATIC ASSET PRE-OPTIMIZATION PIPELINE ===");
  if (!fsSync.existsSync(BACKUP_DIR)) {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }

  const files = await getFiles(IMAGES_DIR);
  console.log(`Found ${files.length} static images (.jpg, .jpeg, .png) to process.\n`);

  let totalOriginalBytes = 0;
  let totalOptimizedBytes = 0;
  const processed = [];

  for (const file of files) {
    const relFromImages = path.relative(IMAGES_DIR, file);
    const backupPath = path.join(BACKUP_DIR, relFromImages);
    const backupDir = path.dirname(backupPath);

    // 1. Backup original master file
    await fs.mkdir(backupDir, { recursive: true });
    if (!fsSync.existsSync(backupPath)) {
      await fs.copyFile(file, backupPath);
    }

    const stat = await fs.stat(file);
    const originalBytes = stat.size;
    totalOriginalBytes += originalBytes;

    // 2. Determine target WebP path
    const ext = path.extname(file);
    const webpPath = file.slice(0, -ext.length) + ".webp";

    // 3. Compress using Sharp with high-fidelity settings
    // Quality 84-86 preserves stone textures, fine chisel marks, and subtle shadows with zero visible artifacts
    const inputBuffer = await fs.readFile(file);
    const meta = await sharp(inputBuffer).metadata();

    // Do not enlarge, keep aspect ratio, limit maximum dimensions to 2400px
    let pipeline = sharp(inputBuffer)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true });

    // WebP with high effort and quality
    const webpBuffer = await pipeline
      .webp({ quality: 85, effort: 6, smartSubsample: true })
      .toBuffer();

    await fs.writeFile(webpPath, webpBuffer);
    const optimizedBytes = webpBuffer.length;
    totalOptimizedBytes += optimizedBytes;

    const savingsPct = Math.round((1 - optimizedBytes / originalBytes) * 100);
    const filename = path.basename(file);
    console.log(`✓ ${filename} (${meta.width}x${meta.height})`);
    console.log(`   Original: ${(originalBytes / 1024).toFixed(1)} KB → WebP: ${(optimizedBytes / 1024).toFixed(1)} KB (Saved ${savingsPct}%)`);

    processed.push({
      file: filename,
      originalKB: (originalBytes / 1024).toFixed(1),
      optimizedKB: (optimizedBytes / 1024).toFixed(1),
      savingsPct
    });
  }

  const totalSavedBytes = totalOriginalBytes - totalOptimizedBytes;
  console.log("\n==============================================");
  console.log(`Original Total: ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Optimized Total: ${(totalOptimizedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Net Savings: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB (${Math.round((totalSavedBytes / totalOriginalBytes) * 100)}%)`);
  console.log("Originals safely backed up in: public/images/.originals/");
  console.log("==============================================");
}

optimizeImages().catch(err => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
