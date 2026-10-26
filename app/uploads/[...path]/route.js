import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const pathSegments = resolvedParams?.path || [];
    
    // Construct local safe path
    const safeSubPath = path.join(...pathSegments).replace(/^(\.\.[\/\\])+/, "");
    let targetPath = path.join(process.cwd(), "public", "uploads", safeSubPath);

    // Ensure path remains inside public/uploads
    const allowedRoot = path.normalize(path.join(process.cwd(), "public", "uploads"));
    const normalizedTarget = path.normalize(targetPath);
    if (!normalizedTarget.startsWith(allowedRoot)) {
      return new Response("Forbidden", { status: 403 });
    }

    // Check exact file existence
    if (!fs.existsSync(normalizedTarget) || !fs.statSync(normalizedTarget).isFile()) {
      // Try webp fallback candidate
      const webpCandidate = normalizedTarget.replace(/\.(jpg|jpeg|png)$/i, ".webp");
      if (fs.existsSync(webpCandidate) && fs.statSync(webpCandidate).isFile()) {
        targetPath = webpCandidate;
      } else {
        return new Response("Not Found", { status: 404 });
      }
    }

    const ext = path.extname(targetPath).toLowerCase();
    const mimeTypes = {
      ".webp": "image/webp",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".avif": "image/avif",
      ".gif": "image/gif",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    const stat = fs.statSync(targetPath);
    const fileBuffer = fs.readFileSync(targetPath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
