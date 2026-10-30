import path from "path";
import fs from "fs";
import { generateImageVariants, RESPONSIVE_WIDTHS } from "../lib/media/variant-generator.js";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const FOLDERS = ["products", "categories"];

/**
 * Scan a target upload folder and find all unique image basenames
 */
function scanFolder(folderName) {
  const folderDir = path.join(UPLOAD_ROOT, folderName);
  if (!fs.existsSync(folderDir)) return [];

  const rawDir = path.join(folderDir, "raw");
  const displayDir = path.join(folderDir, "display");

  const imagesMap = new Map(); // basename -> { sourcePath, isRaw }

  // 1. First scan raw directory (highest quality master source)
  if (fs.existsSync(rawDir)) {
    const rawFiles = fs.readdirSync(rawDir);
    for (const file of rawFiles) {
      if (file.startsWith(".") || file.includes(".tmp.")) continue;
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      imagesMap.set(baseName, {
        sourcePath: path.join(rawDir, file),
        baseName,
        isRaw: true
      });
    }
  }

  // 2. Scan display directory (for any legacy images that may only have a display file)
  if (fs.existsSync(displayDir)) {
    const displayFiles = fs.readdirSync(displayDir);
    for (const file of displayFiles) {
      if (file.startsWith(".") || file.includes(".tmp.")) continue;
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      if (!imagesMap.has(baseName)) {
        imagesMap.set(baseName, {
          sourcePath: path.join(displayDir, file),
          baseName,
          isRaw: false
        });
      }
    }
  }

  return Array.from(imagesMap.values());
}

/**
 * Check which variants are missing for a given basename
 */
function getMissingVariants(folderName, baseName) {
  const folderDir = path.join(UPLOAD_ROOT, folderName);
  const requiredVariants = [...RESPONSIVE_WIDTHS.map(w => `w${w}`), "display", "card", "thumb"];
  const missing = [];

  for (const v of requiredVariants) {
    const p = path.join(folderDir, v, `${baseName}.webp`);
    if (!fs.existsSync(p) || fs.statSync(p).size === 0) {
      missing.push(v);
    }
  }

  return missing;
}

async function run() {
  console.log("================================================================================");
  console.log("JAIPUR STONECRAFT — STATIC WEBP VARIANT MIGRATION & BACKFILL ENGINE");
  console.log("================================================================================");
  console.log("Target Directory: ", UPLOAD_ROOT);
  console.log("Responsive Widths:", RESPONSIVE_WIDTHS.join(", "));
  console.log("Timestamp:        ", new Date().toISOString());
  console.log("================================================================================\n");

  let totalScanned = 0;
  let totalAlreadyComplete = 0;
  let totalProcessed = 0;
  let totalBytesGenerated = 0;
  const failures = [];

  for (const folder of FOLDERS) {
    console.log(`\n>>> SCANNING FOLDER: /uploads/${folder} <<<`);
    const images = scanFolder(folder);
    console.log(`Found ${images.length} unique image basenames.`);
    totalScanned += images.length;

    const baseUploadDir = path.join(UPLOAD_ROOT, folder);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const missing = getMissingVariants(folder, img.baseName);

      if (missing.length === 0) {
        totalAlreadyComplete++;
        continue;
      }

      const progress = `[${i + 1}/${images.length}]`;
      const start = Date.now();

      try {
        const res = await generateImageVariants(img.sourcePath, baseUploadDir, img.baseName, {
          skipExisting: true
        });

        let newBytes = 0;
        let generatedCount = 0;
        for (const [k, v] of Object.entries(res.variants)) {
          if (!v.skipped) {
            newBytes += v.size;
            generatedCount++;
          }
        }

        totalProcessed++;
        totalBytesGenerated += newBytes;
        const dur = Date.now() - start;

        console.log(`${progress} ✓ ${img.baseName} (${res.originalWidth}x${res.originalHeight}) -> Generated ${generatedCount} variants (${Math.round(newBytes / 1024)} KB) in ${dur}ms`);
      } catch (err) {
        console.error(`${progress} ❌ FAILED ${img.baseName}:`, err.message);
        failures.push({ folder, baseName: img.baseName, error: err.message });
      }
    }
  }

  console.log("\n================================================================================");
  console.log("BACKFILL MIGRATION COMPLETE SUMMARY");
  console.log("================================================================================");
  console.log(`Total Master Images Scanned: ${totalScanned}`);
  console.log(`Already 100% Complete:       ${totalAlreadyComplete}`);
  console.log(`Newly Processed Images:      ${totalProcessed}`);
  console.log(`Total Storage Added:         ${(totalBytesGenerated / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total Failures:              ${failures.length}`);
  if (failures.length > 0) {
    console.log("Failure Details:", JSON.stringify(failures, null, 2));
  }
  console.log("================================================================================\n");
}

run().catch(console.error);

