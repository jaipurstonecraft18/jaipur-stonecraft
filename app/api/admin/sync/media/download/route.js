import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { isAuthorizedSyncRequest } from "@/lib/admin/auth.js";

const MIME_MAP = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".avif": "image/avif",
  ".svg": "image/svg+xml"
};

export async function GET(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const rawFile = searchParams.get("file") || searchParams.get("path");

    if (!rawFile) {
      return NextResponse.json({ success: false, error: "Missing required 'file' query parameter" }, { status: 400 });
    }

    const rawStr = String(rawFile).trim();
    if (rawStr.startsWith("/") || rawStr.startsWith("\\") || rawStr.includes("..") || rawStr.includes("\0") || path.isAbsolute(rawStr)) {
      return NextResponse.json({ success: false, error: "Invalid path: Directory traversal or absolute path not permitted" }, { status: 400 });
    }
    const sanitizedRel = rawStr.replace(/\\/g, "/");

    const uploadsBase = path.join(process.cwd(), "public", "uploads");
    const targetFilePath = path.join(uploadsBase, sanitizedRel);

    if (!targetFilePath.startsWith(uploadsBase)) {
      return NextResponse.json({ success: false, error: "Security violation: Path outside public/uploads" }, { status: 403 });
    }

    if (!fs.existsSync(targetFilePath)) {
      return NextResponse.json({ success: false, error: "File not found" }, { status: 404 });
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(targetFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Failed to retrieve media file" }, { status: 500 });
  }
}
