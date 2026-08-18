import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createSessionToken } from "../lib/admin/auth.js";

async function runUploadTest() {
  console.log("=== PHASE 3 IMAGE PROCESSING & VARIANT GENERATION TEST ===");

  const sampleImagePath = path.join(process.cwd(), "scripts", "sample_test_sculpture.png");

  await sharp({
    create: {
      width: 1600,
      height: 2000,
      channels: 4,
      background: { r: 240, g: 235, b: 225, alpha: 1 }
    }
  })
  .composite([
    {
      input: Buffer.from(`
        <svg width="1600" height="2000">
          <rect x="200" y="200" width="1200" height="1600" fill="#9E7B4F" rx="30" />
          <text x="800" y="1000" font-family="serif" font-size="80" fill="#FFFFFF" text-anchor="middle">JAIPUR STONECRAFT</text>
          <text x="800" y="1150" font-family="sans-serif" font-size="50" fill="#FCFBF9" text-anchor="middle">Phase 3 Sample Deity Statue</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile(sampleImagePath);

  const rawStats = fs.statSync(sampleImagePath);
  console.log(`Generated Sample Raw Test Image: ${sampleImagePath} (${(rawStats.size / 1024).toFixed(2)} KB)`);

  const fileBuffer = fs.readFileSync(sampleImagePath);
  const blob = new Blob([fileBuffer], { type: "image/png" });

  const formData = new FormData();
  formData.append("folder", "products");
  formData.append("productSlug", "makrana-ganesh-murti");
  formData.append("files", blob, "sample_test_sculpture.png");

  const validToken = createSessionToken();

  const response = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${validToken}`
    },
    body: formData
  });

  const result = await response.json();
  console.log("\nAPI Response Status:", response.status);
  console.log("API Response Data:", JSON.stringify(result, null, 2));

  if (result.success && result.images && result.images.length > 0) {
    const rec = result.images[0];
    const rawDiskPath = path.join(process.cwd(), "public", rec.rawUrl);
    const displayDiskPath = path.join(process.cwd(), "public", rec.displayUrl);
    const cardDiskPath = path.join(process.cwd(), "public", rec.cardUrl);
    const thumbDiskPath = path.join(process.cwd(), "public", rec.thumbUrl);

    console.log("\n--- DISK FILE VERIFICATION ---");
    console.log(`Raw File Exists: ${fs.existsSync(rawDiskPath)} (${(fs.statSync(rawDiskPath).size / 1024).toFixed(2)} KB)`);
    console.log(`Display WebP Exists: ${fs.existsSync(displayDiskPath)} (${(fs.statSync(displayDiskPath).size / 1024).toFixed(2)} KB)`);
    console.log(`Card WebP Exists: ${fs.existsSync(cardDiskPath)} (${(fs.statSync(cardDiskPath).size / 1024).toFixed(2)} KB)`);
    console.log(`Thumb WebP Exists: ${fs.existsSync(thumbDiskPath)} (${(fs.statSync(thumbDiskPath).size / 1024).toFixed(2)} KB)`);
    console.log(`Optimization Savings: ${rec.savingsPercent}% reduction (Raw: ${(rec.originalSize/1024).toFixed(2)} KB -> Display WebP: ${(rec.displaySize/1024).toFixed(2)} KB)`);
  }

  if (fs.existsSync(sampleImagePath)) {
    fs.unlinkSync(sampleImagePath);
  }
}

runUploadTest().catch(console.error);
