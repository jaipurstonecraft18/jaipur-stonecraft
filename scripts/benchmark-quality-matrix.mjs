import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const TEST_SET = [
  {
    category: "1. Finely carved deity face",
    file: "public/images/.originals/hero/hero-krishna-artisan.jpg",
    slug: "face-krishna"
  },
  {
    category: "2. Intricate marble jali",
    file: "public/images/.originals/collections/architectural.png",
    slug: "jali-architectural"
  },
  {
    category: "3. Detailed relief panel",
    file: "public/uploads/categories/raw/wall-art-reliefs-1787907673529-6puo6.png",
    slug: "relief-panel"
  },
  {
    category: "4. White marble with subtle grain",
    file: "public/images/.originals/creations/marble-home-mandir.jpg",
    slug: "mandir-grain"
  },
  {
    category: "5. Dark statue / high-contrast",
    file: "public/images/.originals/creations/black-nandi-statue.jpg",
    slug: "nandi-dark"
  },
  {
    category: "6. Delicate gilding & ornaments",
    file: "public/uploads/products/raw/quick-add-1790591737786-4jxbq.png",
    slug: "gold-ornament"
  },
  {
    category: "7. Homepage hero image",
    file: "public/uploads/categories/raw/cms-image-1792390358031-5m2tp.png",
    slug: "hero-homepage"
  }
];

function calculateMetrics(rawBuffer, testBuffer) {
  if (rawBuffer.length !== testBuffer.length) {
    return { mse: -1, psnr: -1 };
  }
  let sumSqDiff = 0;
  for (let i = 0; i < rawBuffer.length; i++) {
    const diff = rawBuffer[i] - testBuffer[i];
    sumSqDiff += diff * diff;
  }
  const mse = sumSqDiff / rawBuffer.length;
  if (mse === 0) return { mse: 0, psnr: 99.9 };
  const psnr = 10 * Math.log10((255 * 255) / mse);
  return { mse: Number(mse.toFixed(2)), psnr: Number(psnr.toFixed(2)) };
}

async function runBenchmark() {
  const outDir = path.join(process.cwd(), "artifacts", "compression-benchmark");
  await fs.mkdir(outDir, { recursive: true });

  const webpQualities = [80, 85, 88, 90];
  const avifQualities = [75, 80, 85, 88];

  const results = [];

  console.log("=== COMPRESSION & FIDELITY BENCHMARK MATRIX ===\n");

  for (const item of TEST_SET) {
    const filePath = path.join(process.cwd(), item.file);
    let originalBuffer;
    try {
      originalBuffer = await fs.readFile(filePath);
    } catch (e) {
      console.error(`Missing test file: ${item.file}`);
      continue;
    }

    const origStat = await fs.stat(filePath);
    const origMeta = await sharp(originalBuffer).metadata();
    
    // Normalize reference dimensions (e.g., max 1920 inside for standardized measurement)
    const normalizedWidth = Math.min(origMeta.width, 1920);
    const referencePipeline = sharp(originalBuffer)
      .rotate()
      .resize(normalizedWidth, null, { fit: "inside", withoutEnlargement: true });
    
    // Get raw RGB buffer of reference
    const { data: refRaw, info: refInfo } = await referencePipeline.clone().raw().toBuffer({ resolveWithObject: true });

    console.log(`Analyzing: [${item.category}] - ${path.basename(item.file)} (${origMeta.width}x${origMeta.height}, ${(origStat.size/1024).toFixed(0)}KB)`);

    const itemResults = {
      category: item.category,
      file: path.basename(item.file),
      originalSizeKB: (origStat.size / 1024).toFixed(1),
      variants: []
    };

    // Test WebP variants
    for (const q of webpQualities) {
      const t0 = performance.now();
      const webpBuf = await referencePipeline
        .clone()
        .webp({ quality: q, effort: 5, smartSubsample: true })
        .toBuffer();
      const encodeTimeMs = Math.round(performance.now() - t0);

      // Decode back to raw for PSNR measurement
      const { data: decodedRaw } = await sharp(webpBuf)
        .resize(refInfo.width, refInfo.height)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const metrics = calculateMetrics(refRaw, decodedRaw);
      const sizeKB = Number((webpBuf.length / 1024).toFixed(1));
      const savings = Math.round((1 - webpBuf.length / origStat.size) * 100);

      itemResults.variants.push({
        format: "WebP",
        quality: q,
        sizeKB,
        savings: `${savings}%`,
        psnr: metrics.psnr,
        mse: metrics.mse,
        encodeTimeMs
      });

      const outFilename = `${item.slug}-webp-q${q}.webp`;
      await fs.writeFile(path.join(outDir, outFilename), webpBuf);
    }

    // Test AVIF variants
    for (const q of avifQualities) {
      const t0 = performance.now();
      const avifBuf = await referencePipeline
        .clone()
        .avif({ quality: q, effort: 4, chromaSubsampling: "4:2:0" })
        .toBuffer();
      const encodeTimeMs = Math.round(performance.now() - t0);

      // Decode back to raw for PSNR measurement
      const { data: decodedRaw } = await sharp(avifBuf)
        .resize(refInfo.width, refInfo.height)
        .raw()
        .toBuffer({ resolveWithObject: true });

      const metrics = calculateMetrics(refRaw, decodedRaw);
      const sizeKB = Number((avifBuf.length / 1024).toFixed(1));
      const savings = Math.round((1 - avifBuf.length / origStat.size) * 100);

      itemResults.variants.push({
        format: "AVIF",
        quality: q,
        sizeKB,
        savings: `${savings}%`,
        psnr: metrics.psnr,
        mse: metrics.mse,
        encodeTimeMs
      });

      const outFilename = `${item.slug}-avif-q${q}.avif`;
      await fs.writeFile(path.join(outDir, outFilename), avifBuf);
    }

    console.table(itemResults.variants.map(v => ({
      Codec: v.format,
      Q: v.quality,
      "Size (KB)": v.sizeKB,
      "PSNR (dB)": v.psnr,
      "Encode (ms)": v.encodeTimeMs
    })));

    results.push(itemResults);
  }

  await fs.writeFile(path.join(outDir, "benchmark-results.json"), JSON.stringify(results, null, 2));
  console.log(`\nBenchmark complete. Comparison variants saved to artifacts/compression-benchmark/`);
}

runBenchmark().catch(console.error);
