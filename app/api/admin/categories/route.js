import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDB();
  const categories = db.prepare("SELECT * FROM categories ORDER BY name ASC").all();
  const collections = db.prepare("SELECT * FROM collections ORDER BY name ASC").all();

  return NextResponse.json({ categories, collections });
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, imageSrc, imageAlt, type = "category" } = body;

    if (!slug || !imageSrc) {
      return NextResponse.json({ error: "Slug and cover image URL are required" }, { status: 400 });
    }

    const db = getDB();

    if (type === "collection") {
      db.prepare("UPDATE collections SET image_src = ? WHERE slug = ?").run(imageSrc, slug);
    } else {
      db.prepare("UPDATE categories SET image_src = ?, image_alt = ? WHERE slug = ?").run(imageSrc, imageAlt || "", slug);
    }

    return NextResponse.json({ success: true, message: "Category cover image updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update cover image" }, { status: 500 });
  }
}
