import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, productIds } = body;

    if (!action || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "Action and array of product IDs are required" }, { status: 400 });
    }

    const db = getDB();
    const placeholders = productIds.map(() => "?").join(",");

    if (action === "publish") {
      db.prepare(`UPDATE products SET status = 'published', updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(...productIds);
    } else if (action === "archive") {
      db.prepare(`UPDATE products SET status = 'archived', updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(...productIds);
    } else if (action === "feature") {
      db.prepare(`UPDATE products SET is_featured = 1, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(...productIds);
    } else if (action === "unfeature") {
      db.prepare(`UPDATE products SET is_featured = 0, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`).run(...productIds);
    } else {
      return NextResponse.json({ error: "Invalid bulk action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully executed bulk action '${action}' on ${productIds.length} product(s).`
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Bulk action failed" }, { status: 500 });
  }
}
