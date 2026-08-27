import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const collectionsDir = path.join(process.cwd(), 'public', 'images', 'collections');

async function optimizeCollections() {
  const files = await fs.readdir(collectionsDir);
  console.log("Optimizing static collection assets in public/images/collections...");

  for (const file of files) {
    if (file.endsWith('.webp')) continue;
    const inputPath = path.join(collectionsDir, file);
    const stat = await fs.stat(inputPath);
    if (!stat.isFile()) continue;

    const ext = path.extname(file);
    const nameWithoutExt = path.basename(file, ext);
    const outputPath = path.join(collectionsDir, `${nameWithoutExt}.webp`);

    const metadata = await sharp(inputPath).metadata();

    let pipeline = sharp(inputPath).rotate();
    if (metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { fit: 'inside', withoutEnlargement: true });
    }

    const buffer = await pipeline.webp({ quality: 88, effort: 6 }).toBuffer();
    await fs.writeFile(outputPath, buffer);

    const newStat = await fs.stat(outputPath);
    const savings = Math.round(((stat.size - newStat.size) / stat.size) * 100);
    console.log(`${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB) -> ${nameWithoutExt}.webp (${(newStat.size / 1024).toFixed(0)} KB) [Saved ${savings}%]`);
  }
}

optimizeCollections().catch(console.error);
