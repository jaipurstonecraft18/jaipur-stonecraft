import { NextResponse } from "next/server";
import { query, getOne, execute, initDB } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

const DEFAULT_CONTENT_SLOTS = [
  {
    key_name: "homepage_hero_image",
    page: "Homepage",
    label: "Homepage → Main Hero Showcase Banner",
    type: "image",
    value: "/images/collections/custom.png",
    alt_text: "Bespoke hand-carved stone art in Jaipur"
  },
  {
    key_name: "homepage_craftsmanship_image",
    page: "Homepage",
    label: "Homepage → Artisan Craftsmanship Spotlight",
    type: "image",
    value: "/images/craftsmanship/artisan-hands.png",
    alt_text: "Master stone carver shaping white marble"
  },
  {
    key_name: "homepage_story_image",
    page: "Homepage",
    label: "Homepage → Atelier Heritage Story Image",
    type: "image",
    value: "https://placehold.co/1200x800/E8E4DF/1A1918?text=Jaipur+Atelier",
    alt_text: "Jaipur Stonecraft generational stone atelier"
  },
  {
    key_name: "about_heritage_banner",
    page: "Our Story",
    label: "Our Story Page → Atelier Heritage Banner",
    type: "image",
    value: "https://placehold.co/1200x800/E8E4DF/1A1918?text=Atelier+Heritage",
    alt_text: "Jaipur Stonecraft heritage atelier workshop"
  },
  {
    key_name: "about_quarry_image",
    page: "Our Story",
    label: "Our Story Page → Single-Block Quarrying Photo",
    type: "image",
    value: "https://placehold.co/800x600/E8E4DF/1A1918?text=Quarry+Selection",
    alt_text: "Single block Makrana marble quarry selection"
  },
  {
    key_name: "craftsmanship_hero_banner",
    page: "Craftsmanship",
    label: "Craftsmanship Page → Main Hero Banner",
    type: "image",
    value: "/images/craftsmanship/artisan-hands.png",
    alt_text: "Generational stone carving techniques in Jaipur"
  },
  {
    key_name: "craftsmanship_chisel_image",
    page: "Craftsmanship",
    label: "Craftsmanship Page → Chisel & Proportion Technique",
    type: "image",
    value: "https://placehold.co/800x600/E8E4DF/1A1918?text=Hand+Chiseling",
    alt_text: "Fine chisel detailing on marble deity idol"
  }
];

async function seedDefaultSlots() {
  await initDB();
  for (const slot of DEFAULT_CONTENT_SLOTS) {
    const existing = await getOne("SELECT key_name FROM site_content WHERE key_name = ?", [slot.key_name]);
    if (!existing) {
      await execute(`
        INSERT INTO site_content (key_name, page, label, type, value, alt_text)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [slot.key_name, slot.page, slot.label, slot.type, slot.value, slot.alt_text]);
    }
  }
}

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await seedDefaultSlots();
    const rows = await query("SELECT * FROM site_content ORDER BY page ASC, key_name ASC");
    return NextResponse.json({ slots: rows });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch content" }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { keyName, value, altText } = body;

    if (!keyName || !value) {
      return NextResponse.json({ error: "keyName and value are required" }, { status: 400 });
    }

    const existing = await getOne("SELECT * FROM site_content WHERE key_name = ?", [keyName]);
    if (!existing) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    await execute(`
      UPDATE site_content
      SET value = ?, alt_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE key_name = ?
    `, [value, altText || existing.alt_text, keyName]);

    const updated = await getOne("SELECT * FROM site_content WHERE key_name = ?", [keyName]);
    return NextResponse.json({ success: true, slot: updated, message: `Updated ${existing.label}` });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update content" }, { status: 500 });
  }
}
