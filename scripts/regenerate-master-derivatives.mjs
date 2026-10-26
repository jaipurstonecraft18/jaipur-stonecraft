import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import sharp from "sharp";

async function regenerateCollections() {
  console.log("\n--- REGENERATING STATIC COLLECTIONS FROM PRISTINE MASTERS ---");
  const originalsDir = path.join(process.cwd(), "public", "images", ".originals", "collections");
  const targetDir = path.join(process.cwd(), "public", "images", "collections");

  if (!fsSync.existsSync(originalsDir)) {
    console.log("No .originals/collections directory found.");
    return;
  }

  const files = await fs.readdir(originalsDir);
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    const inputPath = path.join(originalsDir, file);
    const baseName = path.basename(file, path.extname(file));
    const outputPath = path.join(targetDir, `${baseName}.webp`);

    const inputBuffer = await fs.readFile(inputPath);
    const meta = await sharp(inputBuffer).metadata();

    const webpBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 90, effort: 6, smartSubsample: true })
      .toBuffer();

    await fs.writeFile(outputPath, webpBuffer);
    console.log(`✓ Generated ${baseName}.webp from master ${file} (${meta.width}x${meta.height}) -> ${(webpBuffer.length / 1024).toFixed(1)} KB`);
  }
}

async function regenerateCreationsAndHero() {
  console.log("\n--- REGENERATING CREATIONS & HERO FROM PRISTINE MASTERS ---");
  const folders = [
    { orig: "public/images/.originals/hero", target: "public/images/hero" },
    { orig: "public/images/.originals/creations", target: "public/images/creations" },
    { orig: "public/images/.originals/craftsmanship", target: "public/images/craftsmanship" }
  ];

  for (const { orig, target } of folders) {
    const origPath = path.join(process.cwd(), orig);
    const targetPath = path.join(process.cwd(), target);
    if (!fsSync.existsSync(origPath)) continue;

    const files = await fs.readdir(origPath);
    for (const file of files) {
      if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
      const inputPath = path.join(origPath, file);
      const baseName = path.basename(file, path.extname(file));
      const outputPath = path.join(targetPath, `${baseName}.webp`);

      const inputBuffer = await fs.readFile(inputPath);
      const meta = await sharp(inputBuffer).metadata();

      const webpBuffer = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90, effort: 6, smartSubsample: true })
        .toBuffer();

      await fs.writeFile(outputPath, webpBuffer);
      console.log(`✓ Generated ${target}/${baseName}.webp from master (${meta.width}x${meta.height}) -> ${(webpBuffer.length / 1024).toFixed(1)} KB`);
    }
  }
}

async function processUploadFolder(folder) {
  console.log(`\n--- PROCESSING UPLOADS: ${folder} ---`);
  const baseUploadDir = path.join(process.cwd(), "public", "uploads", folder);
  const rawDir = path.join(baseUploadDir, "raw");
  const displayDir = path.join(baseUploadDir, "display");
  const cardDir = path.join(baseUploadDir, "card");
  const thumbDir = path.join(baseUploadDir, "thumb");

  await Promise.all([
    fs.mkdir(displayDir, { recursive: true }),
    fs.mkdir(cardDir, { recursive: true }),
    fs.mkdir(thumbDir, { recursive: true })
  ]);

  const rawFiles = await fs.readdir(rawDir);
  console.log(`Found ${rawFiles.length} raw master files in ${folder}/raw.`);

  for (const rawFile of rawFiles) {
    if (rawFile.startsWith(".")) continue;
    const rawPath = path.join(rawDir, rawFile);
    const ext = path.extname(rawFile);
    const baseName = path.basename(rawFile, ext);
    const webpFilename = `${baseName}.webp`;

    try {
      const buffer = await fs.readFile(rawPath);
      const meta = await sharp(buffer).metadata();
      const baseSharp = () => sharp(buffer).rotate();

      // 1. Display Variant (1920x2400 max, WebP 90% with smartSubsample - High-Res Master for Product Detail & Fullscreen)
      const displayBuffer = await baseSharp()
        .resize(1920, 2400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90, effort: 5, smartSubsample: true })
        .toBuffer();
      await fs.writeFile(path.join(displayDir, webpFilename), displayBuffer);

      // 2. Card Variant (1080x1350 max, WebP 85% with smartSubsample - Crisp for High-DPI Grid Displays)
      const cardBuffer = await baseSharp()
        .resize(1080, 1350, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 85, effort: 5, smartSubsample: true })
        .toBuffer();
      await fs.writeFile(path.join(cardDir, webpFilename), cardBuffer);

      // 3. Thumb Variant (400x400 cover, WebP 80%)
      const thumbBuffer = await baseSharp()
        .resize(400, 400, { fit: "cover", position: "center" })
        .webp({ quality: 80, effort: 4 })
        .toBuffer();
      await fs.writeFile(path.join(thumbDir, webpFilename), thumbBuffer);

      console.log(`  ✓ ${rawFile} (${meta.width}x${meta.height}) -> display: ${(displayBuffer.length/1024).toFixed(0)}KB, card: ${(cardBuffer.length/1024).toFixed(0)}KB, thumb: ${(thumbBuffer.length/1024).toFixed(0)}KB`);
    } catch (err) {
      console.error(`  ✗ Error processing ${rawFile}: ${err.message}`);
    }
  }
}

async function main() {
  await regenerateCollections();
  await regenerateCreationsAndHero();
  await processUploadFolder("products");
  await processUploadFolder("categories");
  console.log("\n=== ALL DERIVATIVES REGENERATED CONSISTENTLY FROM PRISTINE MASTERS ===");
}

main().catch(console.error);
