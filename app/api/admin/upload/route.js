import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { uploadObject } from "@/lib/storage/b2-client.js";
import { toB2Url } from "@/lib/storage/media-helper.js";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const rawTargetFolder = formData.get("folder");
    const targetFolder = rawTargetFolder === "categories" ? "categories" : "products";
    
    // Strict path traversal prevention & sanitization
    const rawSlug = (formData.get("productSlug") || "product").toString();
    const cleanSlug = path.basename(rawSlug).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "product";

    const files = formData.getAll("files").concat(formData.getAll("file")).filter((f) => f && typeof f !== "string");
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No image file provided to upload" }, { status: 400 });
    }

    const baseUploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);
    const rawDir = path.join(baseUploadDir, "raw");
    const displayDir = path.join(baseUploadDir, "display");
    const cardDir = path.join(baseUploadDir, "card");
    const thumbDir = path.join(baseUploadDir, "thumb");

    await Promise.all([
      fs.mkdir(rawDir, { recursive: true }),
      fs.mkdir(displayDir, { recursive: true }),
      fs.mkdir(cardDir, { recursive: true }),
      fs.mkdir(thumbDir, { recursive: true })
    ]);

    const uploadedRecords = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `File type "${file.type}" is not supported. Upload JPEG, PNG, WebP, or AVIF.` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File "${file.name}" exceeds the maximum 15MB limit.` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Byte-level image verification using Sharp
      let metadata;
      try {
        metadata = await sharp(buffer).metadata();
        if (!metadata || !metadata.format) {
          throw new Error("Invalid image header");
        }
      } catch (err) {
        return NextResponse.json({ error: `File "${file.name}" is corrupted or is not a valid image.` }, { status: 400 });
      }

      const timestamp = Date.now();
      const rawExt = path.extname(file.name).toLowerCase() || `.${metadata.format}`;
      const baseFilename = `${cleanSlug}-${timestamp}-${Math.random().toString(36).substring(2, 7)}`;

      const rawFilename = `${baseFilename}${rawExt}`;
      const webpFilename = `${baseFilename}.webp`;

      // 1. Save Unprocessed Raw Original File locally
      const rawPath = path.join(rawDir, rawFilename);
      await fs.writeFile(rawPath, buffer);

      // 2. Process Sharp WebP Variants with EXIF Auto-Orientation & Metadata Stripping
      const baseSharp = () => sharp(buffer).rotate();

      // Display Variant (1920x2400 max, WebP 90% - High-Res for Hero/Cover/Detail)
      const displayBuffer = await baseSharp()
        .resize(1920, 2400, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 90 })
        .toBuffer();
      const displayPath = path.join(displayDir, webpFilename);
      await fs.writeFile(displayPath, displayBuffer);

      // Card Variant (1080x1350 max, WebP 88% - Crisp for High-DPI Card Grids)
      const cardBuffer = await baseSharp()
        .resize(1080, 1350, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 88 })
        .toBuffer();
      const cardPath = path.join(cardDir, webpFilename);
      await fs.writeFile(cardPath, cardBuffer);

      // Thumb Variant (400x400 square cover, WebP 85%)
      const thumbBuffer = await baseSharp()
        .resize(400, 400, { fit: "cover", position: "center" })
        .webp({ quality: 85 })
        .toBuffer();
      const thumbPath = path.join(thumbDir, webpFilename);
      await fs.writeFile(thumbPath, thumbBuffer);

      // 3. Dual Storage: Upload to Backblaze B2 if configured
      const hasB2 = process.env.B2_KEY_ID && process.env.B2_APPLICATION_KEY && !process.env.B2_KEY_ID.startsWith("PASTE_");
      if (hasB2) {
        try {
          await Promise.all([
            uploadObject({
              key: `production/${targetFolder}/raw/${rawFilename}`,
              body: buffer,
              contentType: file.type || "application/octet-stream"
            }),
            uploadObject({
              key: `production/${targetFolder}/display/${webpFilename}`,
              body: displayBuffer,
              contentType: "image/webp"
            }),
            uploadObject({
              key: `production/${targetFolder}/card/${webpFilename}`,
              body: cardBuffer,
              contentType: "image/webp"
            }),
            uploadObject({
              key: `production/${targetFolder}/thumb/${webpFilename}`,
              body: thumbBuffer,
              contentType: "image/webp"
            })
          ]);
        } catch (b2Err) {
          console.warn("[Upload API] B2 cloud upload warning (local copy preserved):", b2Err.message || b2Err);
        }
      }

      const rawSize = file.size;
      const displaySize = displayBuffer.length;
      const cardSize = cardBuffer.length;
      const thumbSize = thumbBuffer.length;
      const savingsPercent = Math.max(0, Math.round(((rawSize - displaySize) / rawSize) * 100));

      const displayUrl = `/uploads/${targetFolder}/display/${webpFilename}`;
      const rawUrl = `/uploads/${targetFolder}/raw/${rawFilename}`;
      const cardUrl = `/uploads/${targetFolder}/card/${webpFilename}`;
      const thumbUrl = `/uploads/${targetFolder}/thumb/${webpFilename}`;

      uploadedRecords.push({
        url: displayUrl, // Primary canonical URL for backward compatibility & local fallback
        b2Url: toB2Url(displayUrl),
        rawUrl,
        displayUrl,
        cardUrl,
        thumbUrl,
        filename: webpFilename,
        rawFilename,
        originalSize: rawSize,
        displaySize,
        cardSize,
        thumbSize,
        savingsPercent,
        dimensions: { width: metadata.width, height: metadata.height },
        altText: `${cleanSlug.replace(/-/g, " ")} hand-carved in Jaipur atelier`
      });
    }

    return NextResponse.json({
      success: true,
      images: uploadedRecords,
      uploadedFiles: uploadedRecords
    });
  } catch (error) {
    console.error("[Upload API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process image upload on server." }, { status: 500 });
  }
}

