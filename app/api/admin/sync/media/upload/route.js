import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { isAuthorizedSyncRequest } from "@/lib/admin/auth.js";

const ALLOWED_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg", ".avif", ".svg"]);
const MAX_SYNC_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export async function POST(req) {
  if (!isAuthorizedSyncRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized sync request" }, { status: 401 });
  }

  let tempFilePath = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const rawRelPath = formData.get("relativePath") || formData.get("path");
    const expectedSha256 = (formData.get("sha256") || "").trim().toLowerCase();

    if (!file || typeof file === "string" || !rawRelPath) {
      return NextResponse.json({ success: false, error: "Missing required file or relativePath parameter" }, { status: 400 });
    }

    // 1. Strict Path Traversal & Absolute Path Prevention
    const rawStr = String(rawRelPath).trim();
    if (rawStr.startsWith("/") || rawStr.startsWith("\\") || rawStr.includes("..") || rawStr.includes("\0") || path.isAbsolute(rawStr)) {
      return NextResponse.json({ success: false, error: "Invalid path: Directory traversal or absolute path not permitted" }, { status: 400 });
    }
    const sanitizedRel = rawStr.replace(/\\/g, "/");

    // 2. Validate Extension
    const ext = path.extname(sanitizedRel).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ success: false, error: `Invalid file extension "${ext}". Allowed: webp, png, jpg, jpeg, avif, svg` }, { status: 400 });
    }

    // 3. Resolve target destination under public/uploads
    const uploadsBase = path.join(process.cwd(), "public", "uploads");
    const targetFilePath = path.join(uploadsBase, sanitizedRel);

    if (!targetFilePath.startsWith(uploadsBase)) {
      return NextResponse.json({ success: false, error: "Security violation: Path outside public/uploads" }, { status: 403 });
    }

    const targetDir = path.dirname(targetFilePath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // 4. Read buffer & size validation
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_SYNC_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "File exceeds 50MB sync limit" }, { status: 400 });
    }

    // 5. Atomic write strategy via temp file
    const randomSuffix = crypto.randomBytes(6).toString("hex");
    tempFilePath = `${targetFilePath}.tmp.${randomSuffix}`;
    fs.writeFileSync(tempFilePath, buffer);

    // 6. SHA-256 Verification
    const computedHash = crypto.createHash("sha256").update(buffer).digest("hex");
    if (expectedSha256 && computedHash !== expectedSha256) {
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
      return NextResponse.json({
        success: false,
        error: `Integrity check failed: Expected SHA-256 ${expectedSha256}, calculated ${computedHash}`
      }, { status: 400 });
    }

    // 7. Atomic Rename to final path
    fs.renameSync(tempFilePath, targetFilePath);
    tempFilePath = null;

    return NextResponse.json({
      success: true,
      message: "Media asset synchronized successfully",
      file: {
        relativePath: sanitizedRel,
        size: buffer.length,
        sha256: computedHash
      }
    });
  } catch (error) {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch (e) {}
    }
    return NextResponse.json({ success: false, error: error.message || "Failed to process media upload" }, { status: 500 });
  }
}
