import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

const ALLOWED_MIME_TYPES = ["video/webm", "video/mp4"];
const ALLOWED_EXTENSIONS = [".webm", ".mp4"];
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB limit

/**
 * Validates file magic bytes to ensure file content matches the declared format.
 */
function isValidVideoSignature(buffer, ext) {
  if (!buffer || buffer.length < 12) return false;

  if (ext === ".webm") {
    // EBML Header ID: 1A 45 DF A3
    return (
      buffer[0] === 0x1a &&
      buffer[1] === 0x45 &&
      buffer[2] === 0xdf &&
      buffer[3] === 0xa3
    );
  }

  if (ext === ".mp4") {
    // MP4 ISO Base Media file: bytes 4-8 contain 'ftyp'
    const boxType = buffer.toString("ascii", 4, 8);
    return boxType === "ftyp";
  }

  return false;
}

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("video") || formData.get("file") || formData.get("files");

    if (!file || typeof file === "string" || !file.name) {
      return NextResponse.json(
        { error: "No video file provided to upload." },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();

    // 1. Validate File Extension
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Invalid file extension "${ext}". Only .webm and .mp4 video files are accepted.` },
        { status: 400 }
      );
    }

    // 2. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported video MIME type "${file.type}". Please upload video/webm or video/mp4.` },
        { status: 400 }
      );
    }

    // 3. Validate File Size
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: `File "${file.name}" exceeds the maximum 100MB size limit.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 4. Validate Byte-Level Magic Signatures
    if (!isValidVideoSignature(buffer, ext)) {
      return NextResponse.json(
        { error: `File content verification failed. "${file.name}" does not contain a valid ${ext.toUpperCase()} video header.` },
        { status: 400 }
      );
    }

    // 5. Store File Uncompressed in public/uploads/videos/
    const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
    await fs.mkdir(uploadDir, { recursive: true });

    const cleanBaseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "hero-video";

    const timestamp = Date.now();
    const filename = `${cleanBaseName}-${timestamp}${ext}`;
    const targetFilePath = path.join(uploadDir, filename);

    await fs.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/videos/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      mimeType: file.type,
      message: `Video "${filename}" uploaded successfully.`
    });
  } catch (err) {
    console.error("[Video Upload Error]:", err);
    return NextResponse.json(
      { error: "Internal server error while processing video upload." },
      { status: 500 }
    );
  }
}
