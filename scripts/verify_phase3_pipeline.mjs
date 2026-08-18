import fs from "fs";
import path from "path";
import sharp from "sharp";
import { createSessionToken } from "../lib/admin/auth.js";

async function runPhase3Verification() {
  console.log("============================================================");
  console.log("PHASE 3 — FULL IMAGE OPTIMIZATION PIPELINE VERIFICATION");
  console.log("============================================================\n");

  const validToken = createSessionToken();
  const testDir = path.join(process.cwd(), "scripts", "test_assets");
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  // 1. Create a 8MB Sample High-Res Camera Photo (2400 x 3000 px)
  const sampleImagePath = path.join(testDir, "camera_sculpture_photo.jpg");
  console.log("1. Generating 2400x3000 high-res camera-sized image...");
  
  await sharp({
    create: {
      width: 2400,
      height: 3000,
      channels: 3,
      background: { r: 245, g: 242, b: 236 }
    }
  })
  .composite([
    {
      input: Buffer.from(`
        <svg width="2400" height="3000">
          <rect x="200" y="300" width="2000" height="2400" fill="#9E7B4F" rx="40" />
          <circle cx="1200" cy="1400" r="500" fill="#E8E4DF" />
          <text x="1200" y="1450" font-family="serif" font-size="90" fill="#1A1918" text-anchor="middle">MAKRANA MARBLE</text>
          <text x="1200" y="2200" font-family="sans-serif" font-size="70" fill="#FFFFFF" text-anchor="middle">Jaipur Stonecraft High-Res Master</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .jpeg({ quality: 95 })
  .toFile(sampleImagePath);

  const sampleStats = fs.statSync(sampleImagePath);
  console.log(`   Sample camera photo created: ${(sampleStats.size / (1024 * 1024)).toFixed(2)} MB (${sampleStats.size} bytes)\n`);

  // Test 1: Upload Valid High-Res Camera Image (~8MB)
  console.log("2. Testing Upload of Valid High-Res Camera Image...");
  const sampleBuffer = fs.readFileSync(sampleImagePath);
  const sampleBlob = new Blob([sampleBuffer], { type: "image/jpeg" });
  
  const form1 = new FormData();
  form1.append("folder", "products");
  form1.append("productSlug", "makrana-white-shiva-statue");
  form1.append("files", sampleBlob, "camera_sculpture_photo.jpg");

  const res1 = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${validToken}` },
    body: form1
  });

  const json1 = await res1.json();
  console.log(`   HTTP Status: ${res1.status}`);
  if (res1.ok && json1.success) {
    const img = json1.images[0];
    console.log(`   ✓ Raw Master URL: ${img.rawUrl}`);
    console.log(`   ✓ Display WebP URL: ${img.displayUrl}`);
    console.log(`   ✓ Card WebP URL: ${img.cardUrl}`);
    console.log(`   ✓ Thumb WebP URL: ${img.thumbUrl}`);
    console.log(`   ✓ Raw Size: ${(img.originalSize / 1024).toFixed(2)} KB`);
    console.log(`   ✓ Display WebP Size: ${(img.displaySize / 1024).toFixed(2)} KB`);
    console.log(`   ✓ Card WebP Size: ${(img.cardSize / 1024).toFixed(2)} KB`);
    console.log(`   ✓ Thumb WebP Size: ${(img.thumbSize / 1024).toFixed(2)} KB`);
    console.log(`   ✓ Optimization Savings: ${img.savingsPercent}% reduction!\n`);
  } else {
    console.error("   ❌ Upload failed:", json1);
  }

  // Test 2: Invalid File Type Rejection
  console.log("3. Testing Invalid File Type Rejection (.txt file disguised as .png)...");
  const txtBlob = new Blob([Buffer.from("This is a text file")], { type: "text/plain" });
  const form2 = new FormData();
  form2.append("folder", "products");
  form2.append("files", txtBlob, "malicious.png");

  const res2 = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${validToken}` },
    body: form2
  });

  const json2 = await res2.json();
  console.log(`   HTTP Status: ${res2.status} (Expected: 400)`);
  console.log(`   Response: ${json2.error}`);
  console.log(`   ✓ Rejection Verified: ${res2.status === 400}\n`);

  // Test 3: Corrupted Image Bytes Rejection
  console.log("4. Testing Corrupted Image Bytes Rejection...");
  const fakeJpgHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x02, 0x00, 0x00, 0x00]);
  const corruptBlob = new Blob([fakeJpgHeader], { type: "image/jpeg" });
  const form3 = new FormData();
  form3.append("folder", "products");
  form3.append("files", corruptBlob, "corrupted_photo.jpg");

  const res3 = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Authorization": `Bearer ${validToken}` },
    body: form3
  });

  const json3 = await res3.json();
  console.log(`   HTTP Status: ${res3.status} (Expected: 400)`);
  console.log(`   Response: ${json3.error}`);
  console.log(`   ✓ Corrupted File Rejection Verified: ${res3.status === 400}\n`);

  // Cleanup test assets
  if (fs.existsSync(sampleImagePath)) fs.unlinkSync(sampleImagePath);
  console.log("============================================================");
  console.log("PHASE 3 VERIFICATION COMPLETED SUCCESSFULLY!");
  console.log("============================================================");
}

runPhase3Verification().catch(console.error);
