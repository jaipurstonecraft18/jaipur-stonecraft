import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import { query, getOne, execute } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

// GET: Scan media directories and resolve references across DB
export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = (searchParams.get("q") || "").toLowerCase().trim();

    // 1. Fetch DB References
    const productImages = await query(`
      SELECT pi.url, pi.product_slug, p.name as product_name
      FROM product_images pi
      LEFT JOIN products p ON pi.product_slug = p.slug
    `);

    const categoryImages = await query("SELECT slug, name, image_src FROM categories WHERE image_src IS NOT NULL AND image_src != ''");
    const collectionImages = await query("SELECT slug, name, image_src FROM collections WHERE image_src IS NOT NULL AND image_src != ''");
    const contentImages = await query("SELECT key_name, label, value FROM site_content WHERE value IS NOT NULL AND value != ''");

    // Build Reference Map
    const refMap = new Map();

    const addRef = (url, refInfo) => {
      if (!url) return;
      const cleanUrl = url.trim();
      if (!refMap.has(cleanUrl)) refMap.set(cleanUrl, []);
      refMap.get(cleanUrl).push(refInfo);
    };

    for (const pi of productImages) {
      addRef(pi.url, { type: "product", name: pi.product_name || pi.product_slug, slug: pi.product_slug });
    }
    for (const cat of categoryImages) {
      addRef(cat.image_src, { type: "category", name: cat.name, slug: cat.slug });
    }
    for (const col of collectionImages) {
      addRef(col.image_src, { type: "collection", name: col.name, slug: col.slug });
    }
    for (const cnt of contentImages) {
      addRef(cnt.value, { type: "content", name: cnt.label, key: cnt.key_name });
    }

    // 2. Scan Physical Upload Directories
    const uploadBase = path.join(process.cwd(), "public", "uploads");
    const mediaFiles = [];

    const scanDir = async (dirPath, categoryFolder) => {
      if (!fsSync.existsSync(dirPath)) return;
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const variantFolder = entry.name;
          if (variantFolder === "display") {
            const variantPath = path.join(dirPath, variantFolder);
            const files = await fs.readdir(variantPath);

            for (const filename of files) {
              if (filename.startsWith(".")) continue;

              const url = `/uploads/${categoryFolder}/display/${filename}`;
              const rawUrl = `/uploads/${categoryFolder}/raw/${filename.replace(/\.webp$/, ".png")}`;
              const fullDiskPath = path.join(variantPath, filename);
              const stats = await fs.stat(fullDiskPath);

              const references = refMap.get(url) || [];
              const isUsed = references.length > 0;

              if (searchQuery && !filename.toLowerCase().includes(searchQuery) && !categoryFolder.toLowerCase().includes(searchQuery)) {
                continue;
              }

              mediaFiles.push({
                url,
                filename,
                folder: categoryFolder,
                sizeBytes: stats.size,
                sizeKb: (stats.size / 1024).toFixed(1),
                createdAt: stats.birthtime || stats.mtime,
                isUsed,
                references
              });
            }
          }
        }
      }
    };

    if (fsSync.existsSync(uploadBase)) {
      const folders = await fs.readdir(uploadBase);
      for (const f of folders) {
        await scanDir(path.join(uploadBase, f), f);
      }
    }

    return NextResponse.json({
      totalCount: mediaFiles.length,
      usedCount: mediaFiles.filter((m) => m.isUsed).length,
      unusedCount: mediaFiles.filter((m) => !m.isUsed).length,
      media: mediaFiles
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to scan media" }, { status: 500 });
  }
}

// DELETE: Safely remove unused media file from disk and B2
export async function DELETE(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const mediaUrl = searchParams.get("url");

    if (!mediaUrl || typeof mediaUrl !== "string" || !mediaUrl.startsWith("/uploads/")) {
      return NextResponse.json({ error: "Valid media URL is required (must start with /uploads/)" }, { status: 400 });
    }

    // Strict path traversal prevention: reject .. , backslashes, and null bytes
    if (mediaUrl.includes("..") || mediaUrl.includes("\\") || mediaUrl.includes("\0") || /%2e|%2f|%5c/i.test(mediaUrl)) {
      return NextResponse.json({ error: "Invalid media URL: path traversal patterns are strictly forbidden" }, { status: 400 });
    }

    const allowedBaseDir = path.resolve(process.cwd(), "public", "uploads");
    const baseDiskPath = path.resolve(process.cwd(), "public", mediaUrl.replace(/^\/+/, ""));

    // Ensure resolved path is strictly within the allowed uploads directory
    if (!baseDiskPath.startsWith(allowedBaseDir + path.sep)) {
      return NextResponse.json({ error: "Access denied: destination outside allowed uploads directory" }, { status: 403 });
    }

    // Only allow deletion of valid media file extensions
    const ext = path.extname(baseDiskPath).toLowerCase();
    const ALLOWED_DELETE_EXTS = [".webp", ".png", ".jpg", ".jpeg", ".avif", ".mp4", ".webm"];
    if (!ALLOWED_DELETE_EXTS.includes(ext)) {
      return NextResponse.json({ error: "Invalid media file extension" }, { status: 400 });
    }

    // Check if actively referenced in DB
    const productRef = await getOne("SELECT id FROM product_images WHERE url = ?", [mediaUrl]);
    const categoryRef = await getOne("SELECT id FROM categories WHERE image_src = ?", [mediaUrl]);
    const collectionRef = await getOne("SELECT id FROM collections WHERE image_src = ?", [mediaUrl]);
    const contentRef = await getOne("SELECT key_name FROM site_content WHERE value = ?", [mediaUrl]);

    if (productRef || categoryRef || collectionRef || contentRef) {
      return NextResponse.json({
        error: "Cannot safely delete media while active references exist in products, categories, or website content. Remove references first."
      }, { status: 400 });
    }

    // Unlink display, raw, card, and thumb files safely from local disk
    const rawDiskPath = baseDiskPath.replace(/[/\\]display[/\\]/, `${path.sep}raw${path.sep}`).replace(/\.webp$/, ".png");
    const cardDiskPath = baseDiskPath.replace(/[/\\]display[/\\]/, `${path.sep}card${path.sep}`);
    const thumbDiskPath = baseDiskPath.replace(/[/\\]display[/\\]/, `${path.sep}thumb${path.sep}`);

    const safeUnlink = (fp) => {
      try {
        const resolved = path.resolve(fp);
        if (resolved.startsWith(allowedBaseDir + path.sep) && fsSync.existsSync(resolved)) {
          fsSync.unlinkSync(resolved);
        }
      } catch (e) {}
    };

    safeUnlink(baseDiskPath);
    safeUnlink(rawDiskPath);
    safeUnlink(cardDiskPath);
    safeUnlink(thumbDiskPath);

    return NextResponse.json({ success: true, message: "Media file deleted safely from disk." });
  } catch (error) {
    console.error("[Admin Media DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete media file safely." }, { status: 500 });
  }
}

