import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { generateImageVariants } from "@/lib/media/variant-generator.js";

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

      // Check if a byte-for-byte original camera file was provided alongside this processed image
      const rawOriginalFile = formData.get("originalFile");
      let rawBuffer = buffer;
      let rawFileExt = rawExt;
      if (rawOriginalFile && typeof rawOriginalFile !== "string" && rawOriginalFile.size > 0) {
        try {
          rawBuffer = Buffer.from(await rawOriginalFile.arrayBuffer());
          rawFileExt = path.extname(rawOriginalFile.name).toLowerCase() || rawExt;
        } catch {
          rawBuffer = buffer;
        }
      }

      const rawFilename = `${baseFilename}${rawFileExt}`;
      const webpFilename = `${baseFilename}.webp`;

      // 1. Save Unprocessed Raw Original File locally (preserving original camera image byte-for-byte)
      const rawPath = path.join(rawDir, rawFilename);
      await fs.writeFile(rawPath, rawBuffer);

      // 2. Generate comprehensive responsive static WebP variants + legacy variants atomically
      let variantResults;
      try {
        variantResults = await generateImageVariants(buffer, baseUploadDir, baseFilename, {
          skipExisting: false
        });
      } catch (genErr) {
        console.error(`[Upload API Warning] Fast variant generation failed for ${baseFilename}:`, genErr);
        // Fallback: minimal display WebP generation so upload never breaks
        const fallbackBuf = await sharp(buffer)
          .rotate()
          .resize(1920, 2400, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 90 })
          .toBuffer();
        const displayPath = path.join(displayDir, webpFilename);
        await fs.writeFile(displayPath, fallbackBuf);
        variantResults = {
          originalWidth: metadata.width,
          originalHeight: metadata.height,
          variants: { display: { size: fallbackBuf.length } }
        };
      }

      const rawSize = file.size;
      const displaySize = variantResults.variants?.display?.size || 0;
      const cardSize = variantResults.variants?.card?.size || variantResults.variants?.w960?.size || displaySize;
      const thumbSize = variantResults.variants?.thumb?.size || variantResults.variants?.w400?.size || 0;
      const savingsPercent = Math.max(0, Math.round(((rawSize - displaySize) / rawSize) * 100));

      const displayUrl = `/uploads/${targetFolder}/display/${webpFilename}`;
      const rawUrl = `/uploads/${targetFolder}/raw/${rawFilename}`;
      const cardUrl = `/uploads/${targetFolder}/card/${webpFilename}`;
      const thumbUrl = `/uploads/${targetFolder}/thumb/${webpFilename}`;

      uploadedRecords.push({
        url: displayUrl, // Primary canonical URL for backward compatibility & local fallback
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
        altText: `${cleanSlug.replace(/-/g, " ")} hand-carved in Jaipur atelier`,
        variants: {
          w400: `/uploads/${targetFolder}/w400/${webpFilename}`,
          w640: `/uploads/${targetFolder}/w640/${webpFilename}`,
          w960: `/uploads/${targetFolder}/w960/${webpFilename}`,
          w1280: `/uploads/${targetFolder}/w1280/${webpFilename}`,
          w1920: `/uploads/${targetFolder}/w1920/${webpFilename}`
        }
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


