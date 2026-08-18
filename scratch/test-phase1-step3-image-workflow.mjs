import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import http from 'http';

// Load .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

function createAdminToken() {
  const secret = process.env.ADMIN_SECRET_KEY || "jsc-admin-secret-key-2026-atelier";
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

function checkUrl(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    }).on('error', reject);
  });
}

async function runStep3ImageWorkflowTest() {
  console.log("=================================================");
  console.log("PHASE 1 STEP 3 — PRODUCT IMAGE WORKFLOW AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();

  // 1. INTENTIONAL CONTROLLED UPLOAD FAILURE TEST (Non-image & Corrupted)
  console.log("--- 1. Testing Upload Validation & Controlled Failures ---");

  // Non-image text file
  const textFormData = new FormData();
  textFormData.append("files", new Blob(["Malicious text content"], { type: "text/plain" }), "test.txt");
  textFormData.append("folder", "products");

  const textRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Cookie": `jsc_admin_session=${token}` },
    body: textFormData
  });
  const textData = await textRes.json();
  console.log(`Text file rejection status: HTTP ${textRes.status} (Expected 400), Error: "${textData.error}"`);
  if (textRes.status !== 400) {
    console.error("❌ Failed to reject non-image file!");
    process.exit(1);
  }

  // Corrupted header file
  const fakeFormData = new FormData();
  fakeFormData.append("files", new Blob(["FAKE_IMAGE_HEADER_BYTES"], { type: "image/png" }), "fake.png");
  fakeFormData.append("folder", "products");

  const fakeRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Cookie": `jsc_admin_session=${token}` },
    body: fakeFormData
  });
  const fakeData = await fakeRes.json();
  console.log(`Corrupted image header rejection status: HTTP ${fakeRes.status} (Expected 400), Error: "${fakeData.error}"`);
  if (fakeRes.status !== 400) {
    console.error("❌ Failed to reject corrupted image!");
    process.exit(1);
  }
  console.log("✓ Upload validation & controlled error path verified 100%!");

  // 2. MULTIPLE REAL IMAGE UPLOADS & SHARP PIPELINE
  console.log("\n--- 2. Testing Multiple Image Uploads & Processing Pipeline ---");
  const realPngPath1 = path.join(process.cwd(), "public", "images", "collections", "custom.png");
  const realPngPath2 = path.join(process.cwd(), "public", "images", "collections", "sacred.png");
  const buffer1 = fs.readFileSync(realPngPath1);
  const buffer2 = fs.readFileSync(realPngPath2);

  const uploadFormData = new FormData();
  uploadFormData.append("files", new Blob([buffer1], { type: "image/png" }), "step3-statue-hero.png");
  uploadFormData.append("files", new Blob([buffer2], { type: "image/png" }), "step3-statue-detail.png");
  uploadFormData.append("folder", "products");
  uploadFormData.append("productSlug", "step3-image-test");

  const uploadRes = await fetch("http://localhost:3000/api/admin/upload", {
    method: "POST",
    headers: { "Cookie": `jsc_admin_session=${token}` },
    body: uploadFormData
  });
  const uploadData = await uploadRes.json();
  console.log(`Multiple Image Upload Status: HTTP ${uploadRes.status}, Uploaded count: ${uploadData.images?.length}`);
  if (!uploadRes.ok || !uploadData.images || uploadData.images.length < 2) {
    console.error("❌ Multiple image upload failed!", uploadData);
    process.exit(1);
  }

  const img1 = uploadData.images[0];
  const img2 = uploadData.images[1];
  console.log("  Image 1 Display WebP:", img1.displayUrl, `(${(img1.displaySize / 1024).toFixed(1)} KB, ${img1.savingsPercent}% saved)`);
  console.log("  Image 2 Display WebP:", img2.displayUrl, `(${(img2.displaySize / 1024).toFixed(1)} KB, ${img2.savingsPercent}% saved)`);

  // 3. VERIFY DISK PERSISTENCE & HTTP SERVING
  console.log("\n--- 3. Testing Disk Serving of Uploaded Variants ---");
  const check1 = await checkUrl(img1.displayUrl);
  const check2 = await checkUrl(img2.displayUrl);
  console.log(`GET ${img1.displayUrl} -> Status: HTTP ${check1.statusCode}`);
  console.log(`GET ${img2.displayUrl} -> Status: HTTP ${check2.statusCode}`);

  if (check1.statusCode !== 200 || check2.statusCode !== 200) {
    console.error("❌ Uploaded image files failed to serve over HTTP!");
    process.exit(1);
  }

  // Clean up uploaded test files from disk
  try {
    for (const rec of uploadData.images) {
      const rawDiskPath = path.join(process.cwd(), "public", rec.rawUrl.replace(/^\//, ""));
      const displayDiskPath = path.join(process.cwd(), "public", rec.displayUrl.replace(/^\//, ""));
      const cardDiskPath = path.join(process.cwd(), "public", rec.cardUrl.replace(/^\//, ""));
      const thumbDiskPath = path.join(process.cwd(), "public", rec.thumbUrl.replace(/^\//, ""));
      if (fs.existsSync(rawDiskPath)) fs.unlinkSync(rawDiskPath);
      if (fs.existsSync(displayDiskPath)) fs.unlinkSync(displayDiskPath);
      if (fs.existsSync(cardDiskPath)) fs.unlinkSync(cardDiskPath);
      if (fs.existsSync(thumbDiskPath)) fs.unlinkSync(thumbDiskPath);
    }
    console.log("✓ Uploaded test files cleaned up safely from disk.");
  } catch (e) {}

  console.log("\n=================================================");
  console.log("✅ PHASE 1 STEP 3 — PRODUCT IMAGE WORKFLOW AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runStep3ImageWorkflowTest().catch((err) => {
  console.error("❌ Step 3 test failed:", err);
  process.exit(1);
});
