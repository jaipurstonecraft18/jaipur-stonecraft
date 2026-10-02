import fs from "fs/promises";
import path from "path";
import { getOne } from "@/lib/db/client.js";

/**
 * Safely unlinks an obsolete uploaded asset from disk IF AND ONLY IF
 * it is no longer referenced by any collection, category, subcategory, product, page or project.
 */
export async function safeUnlinkObsoleteUpload(oldPath) {
  if (!oldPath || typeof oldPath !== "string" || !oldPath.startsWith("/uploads/")) return;
  if (oldPath.includes("..") || oldPath.includes("\\") || oldPath.includes("\0") || /%2e|%2f|%5c/i.test(oldPath)) {
    console.warn(`[Storage Cleanup Blocked]: Path traversal attempt detected: ${oldPath}`);
    return;
  }

  const allowedBaseDir = path.resolve(process.cwd(), "public", "uploads");
  const absolutePath = path.resolve(process.cwd(), "public", oldPath.replace(/^\/+/, ""));

  if (!absolutePath.startsWith(allowedBaseDir + path.sep)) {
    console.warn(`[Storage Cleanup Blocked]: Target outside uploads directory: ${oldPath}`);
    return;
  }

  try {
    const colCount = await getOne("SELECT COUNT(*) as c FROM collections WHERE image_src = ?", [oldPath]);
    const catCount = await getOne("SELECT COUNT(*) as c FROM categories WHERE image_src = ?", [oldPath]);
    const subCount = await getOne("SELECT COUNT(*) as c FROM subcategories WHERE image_src = ?", [oldPath]);
    const prodCount = await getOne("SELECT COUNT(*) as c FROM product_images WHERE url = ?", [oldPath]);
    const projCount = await getOne("SELECT COUNT(*) as c FROM projects WHERE image_src = ? OR gallery LIKE ?", [oldPath, `%${oldPath}%`]);

    const totalRefs = (colCount?.c || 0) + (catCount?.c || 0) + (subCount?.c || 0) + (prodCount?.c || 0) + (projCount?.c || 0);

    if (totalRefs === 0) {
      await fs.unlink(absolutePath).catch(() => {});
      console.log(`[Storage Cleanup]: Safely unlinked obsolete uploaded asset: ${oldPath}`);
    }
  } catch (err) {
    console.error("[Storage Cleanup Warning]:", err);
  }
}
