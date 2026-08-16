import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const targetFolder = formData.get("folder") === "categories" ? "categories" : "products";
    const productSlug = (formData.get("productSlug") || "product").toString();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No image files provided" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", targetFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedRecords = [];

    for (const file of files) {
      if (typeof file === "string" || !file.name) continue;

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: `File type ${file.type} is not supported. Please upload JPEG, PNG, WebP, or AVIF images.` }, { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File ${file.name} exceeds maximum 15MB limit.` }, { status: 400 });
      }

      const timestamp = Date.now();
      const ext = path.extname(file.name) || ".jpg";
      const cleanSlug = productSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const filename = `${cleanSlug}-${timestamp}-${Math.random().toString(36).substring(2, 7)}${ext}`;
      const filePath = path.join(uploadDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${targetFolder}/${filename}`;
      uploadedRecords.push({
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
        altText: `${cleanSlug.replace(/-/g, " ")} hand-carved in Jaipur atelier`
      });
    }

    return NextResponse.json({ success: true, images: uploadedRecords });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
