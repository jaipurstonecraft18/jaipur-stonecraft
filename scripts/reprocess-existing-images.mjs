import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

async function reprocessFolder(targetFolder) {
  const baseUploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);
  const rawDir = path.join(baseUploadDir, "raw");
  const displayDir = path.join(baseUploadDir, "display");
  const cardDir = path.join(baseUploadDir, "card");
  const thumbDir = path.join(baseUploadDir, "thumb");

  try {
    const rawFiles = await fs.readdir(rawDir);
    console.log(`\nProcessing folder "${targetFolder}": found ${rawFiles.length} raw files.`);

    await Promise.all([
      fs.mkdir(displayDir, { recursive: true }),
      fs.mkdir(cardDir, { recursive: true }),
      fs.mkdir(thumbDir, { recursive: true })
    ]);

    for (const rawFile of rawFiles) {
      if (rawFile.startsWith(".")) continue;
      const rawPath = path.join(rawDir, rawFile);
      const ext = path.extname(rawFile);
      const baseFilename = path.basename(rawFile, ext);
      const webpFilename = `${baseFilename}.webp`;

      try {
        const buffer = await fs.readFile(rawPath);
        const baseSharp = () => sharp(buffer).rotate();

        // 1. Display Variant (1920x2400 max, WebP 90%)
        const displayBuffer = await baseSharp()
          .resize(1920, 2400, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 90 })
          .toBuffer();
        await fs.writeFile(path.join(displayDir, webpFilename), displayBuffer);

        // 2. Card Variant (1080x1350 max, WebP 88%)
        const cardBuffer = await baseSharp()
          .resize(1080, 1350, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 88 })
          .toBuffer();
        await fs.writeFile(path.join(cardDir, webpFilename), cardBuffer);

        // 3. Thumb Variant (400x400 square cover, WebP 85%)
        const thumbBuffer = await baseSharp()
          .resize(400, 400, { fit: "cover", position: "center" })
          .webp({ quality: 85 })
          .toBuffer();
        await fs.writeFile(path.join(thumbDir, webpFilename), thumbBuffer);

        console.log(`  ✓ Upgraded variants for: ${rawFile} (display: ${(displayBuffer.length / 1024).toFixed(1)} KB, card: ${(cardBuffer.length / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  ✗ Error processing ${rawFile}:`, err.message);
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error(`Error reading ${targetFolder}:`, err.message);
    }
  }
}

async function main() {
  console.log("=== RE-PROCESSING ALL UPLOADED IMAGES WITH HIGH-QUALITY SHARP WEBP SETTINGS ===");
  await reprocessFolder("products");
  await reprocessFolder("categories");
  console.log("\n=== RE-PROCESSING COMPLETE ===");
}

main();
