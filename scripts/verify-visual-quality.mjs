import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const TEST_SET = [
  {
    category: "1. Finely carved deity face",
    name: "hero-krishna-artisan",
    masterPath: "public/images/.originals/hero/hero-krishna-artisan.jpg",
    servedUrl: "/images/hero/hero-krishna-artisan.webp",
    desktopWidth: 1200,
    mobileWidth: 640,
    quality: 88
  },
  {
    category: "2. Intricate marble jali",
    name: "architectural-screen",
    masterPath: "public/images/.originals/collections/architectural.png",
    servedUrl: "/images/collections/architectural.webp",
    desktopWidth: 1080,
    mobileWidth: 640,
    quality: 85
  },
  {
    category: "3. Detailed relief panel",
    name: "wall-art-relief",
    masterPath: "public/uploads/categories/raw/wall-art-reliefs-1787907673529-6puo6.png",
    servedUrl: "/uploads/categories/display/wall-art-reliefs-1787907673529-6puo6.webp",
    desktopWidth: 1200,
    mobileWidth: 640,
    quality: 85
  },
  {
    category: "4. White marble with subtle grain",
    name: "marble-home-mandir",
    masterPath: "public/images/.originals/creations/marble-home-mandir.jpg",
    servedUrl: "/images/creations/marble-home-mandir.webp",
    desktopWidth: 1200,
    mobileWidth: 640,
    quality: 88
  },
  {
    category: "5. Dark statue / high-contrast",
    name: "black-nandi-statue",
    masterPath: "public/images/.originals/creations/black-nandi-statue.jpg",
    servedUrl: "/images/creations/black-nandi-statue.webp",
    desktopWidth: 1080,
    mobileWidth: 640,
    quality: 85
  },
  {
    category: "6. Delicate gilding & ornaments",
    name: "gilded-murti",
    masterPath: "public/uploads/products/raw/quick-add-1790591737786-4jxbq.png",
    servedUrl: "/uploads/products/display/quick-add-1790591737786-4jxbq.webp",
    desktopWidth: 1200,
    mobileWidth: 640,
    quality: 88
  },
  {
    category: "7. Homepage hero image",
    name: "homepage-hero",
    masterPath: "public/uploads/categories/raw/cms-image-1792390358031-5m2tp.png",
    servedUrl: "/uploads/categories/display/cms-image-1792390358031-5m2tp.webp",
    desktopWidth: 1920,
    mobileWidth: 430,
    quality: 88
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

async function verifyLiveDelivery() {
  console.log("=== PHASE 7: OBJECTIVE VISUAL-QUALITY VERIFICATION (LIVE NEXT.JS PIPELINE) ===\n");
  const reports = [];

  for (const item of TEST_SET) {
    const masterBuf = await fs.readFile(path.join(process.cwd(), item.masterPath));
    const masterMeta = await sharp(masterBuf).metadata();
    const masterStat = await fs.stat(path.join(process.cwd(), item.masterPath));

    // Request desktop-optimized derivative from running Next dev server
    const desktopUrl = `http://localhost:3000/_next/image?url=${encodeURIComponent(item.servedUrl)}&w=${item.desktopWidth}&q=${item.quality}`;
    const desktopRes = await fetch(desktopUrl, {
      headers: { accept: "image/avif,image/webp,*/*" }
    });

    if (desktopRes.status !== 200) {
      console.error(`✗ FAILED to fetch desktop variant for ${item.name}: Status ${desktopRes.status}`);
      continue;
    }

    const desktopBytes = Buffer.from(await desktopRes.arrayBuffer());
    const desktopMeta = await sharp(desktopBytes).metadata();

    // Request mobile-optimized derivative from running Next dev server
    const mobileUrl = `http://localhost:3000/_next/image?url=${encodeURIComponent(item.servedUrl)}&w=${item.mobileWidth}&q=${item.quality}`;
    const mobileRes = await fetch(mobileUrl, {
      headers: { accept: "image/avif,image/webp,*/*" }
    });
    const mobileBytes = Buffer.from(await mobileRes.arrayBuffer());
    const mobileMeta = await sharp(mobileBytes).metadata();

    // Compare fidelity at delivered dimensions
    const refForDesktop = await sharp(masterBuf)
      .rotate()
      .resize(desktopMeta.width, desktopMeta.height, { fit: "inside" })
      .raw()
      .toBuffer();

    const decodedDesktop = await sharp(desktopBytes)
      .resize(desktopMeta.width, desktopMeta.height)
      .raw()
      .toBuffer();

    const metrics = calculateMetrics(refForDesktop, decodedDesktop);
    const desktopSavings = Math.round((1 - desktopBytes.length / masterStat.size) * 100);
    const mobileSavings = Math.round((1 - mobileBytes.length / masterStat.size) * 100);

    const report = {
      Category: item.category,
      Master: `${masterMeta.width}x${masterMeta.height} (${(masterStat.size / 1024).toFixed(0)}KB)`,
      "Desktop Delivered": `${desktopMeta.width}x${desktopMeta.height} ${desktopMeta.format} (${(desktopBytes.length / 1024).toFixed(0)}KB, -${desktopSavings}%)`,
      "Mobile Delivered": `${mobileMeta.width}x${mobileMeta.height} ${mobileMeta.format} (${(mobileBytes.length / 1024).toFixed(0)}KB, -${mobileSavings}%)`,
      "PSNR (dB)": metrics.psnr,
      Status: metrics.psnr >= 37.0 ? "PASSED (Crisp Reference)" : "NEEDS ADJUSTMENT"
    };

    reports.push(report);
  }

  console.table(reports);

  const outDir = path.join(process.cwd(), "artifacts");
  await fs.writeFile(path.join(outDir, "phase7-visual-verification.json"), JSON.stringify(reports, null, 2));
  console.log("\nVisual Quality Verification Report written to artifacts/phase7-visual-verification.json");
}

verifyLiveDelivery().catch(console.error);
