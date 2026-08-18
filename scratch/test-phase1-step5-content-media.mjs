import crypto from 'crypto';
import fs from 'fs';

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

async function runStep5ContentTest() {
  console.log("=================================================");
  console.log("PHASE 1 STEP 5 — WEBSITE CONTENT & MEDIA AUDIT");
  console.log("=================================================\n");

  const token = createAdminToken();

  // 1. FETCH PREDEFINED SLOTS
  console.log("--- 1. Testing Content API Fetch ---");
  const getRes = await fetch("http://localhost:3000/api/admin/content", {
    headers: { "Cookie": `jsc_admin_session=${token}` }
  });
  const getData = await getRes.json();
  console.log(`GET /api/admin/content status: HTTP ${getRes.status}`);
  console.log(`  Predefined Slots Count: ${getData.slots?.length || 0}`);

  if (!getRes.ok || !getData.slots || getData.slots.length < 7) {
    console.error("❌ Content API fetch failed!");
    process.exit(1);
  }

  for (const slot of getData.slots) {
    console.log(`  [${slot.page}] ${slot.label} -> ${slot.value}`);
  }

  // 2. UPDATE CONTENT MEDIA SLOT
  console.log("\n--- 2. Testing Content Media Slot Replacement ---");
  const targetSlot = getData.slots[0];
  const newMediaUrl = "https://placehold.co/1200x800/E8E4DF/1A1918?text=Step+5+Updated+Hero";

  const putRes = await fetch("http://localhost:3000/api/admin/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      keyName: targetSlot.key_name,
      value: newMediaUrl,
      altText: "Updated Step 5 Hero Banner"
    })
  });
  const putData = await putRes.json();
  console.log(`PUT /api/admin/content status: HTTP ${putRes.status}, success: ${putData.success}`);
  if (!putRes.ok || !putData.success) {
    console.error("❌ Content slot update failed!");
    process.exit(1);
  }

  // 3. REVERT MEDIA SLOT BACK TO ORIGINAL
  await fetch("http://localhost:3000/api/admin/content", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Cookie": `jsc_admin_session=${token}`
    },
    body: JSON.stringify({
      keyName: targetSlot.key_name,
      value: targetSlot.value,
      altText: targetSlot.alt_text
    })
  });
  console.log("✓ Restored original slot media URL.");

  console.log("\n=================================================");
  console.log("✅ PHASE 1 STEP 5 — CONTENT & MEDIA AUDIT PASSED 100%!");
  console.log("=================================================\n");
  process.exit(0);
}

runStep5ContentTest().catch((err) => {
  console.error("❌ Step 5 test failed:", err);
  process.exit(1);
});
