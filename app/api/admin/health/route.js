import { NextResponse } from "next/server";
import { query } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allRows = await query("SELECT * FROM products ORDER BY updated_at DESC");
  const allProducts = await Promise.all(allRows.map(formatProductFromRow));

  const missingCover = [];
  const missingDescription = [];
  const missingClassification = [];
  const missingSeo = [];
  const draftQueue = [];

  allProducts.forEach((p) => {
    if (!p.imageSrc || p.imageSrc.includes("placehold.co")) {
      missingCover.push(p);
    }
    if (!p.shortDescription || !p.shortDescription.trim() || !p.detailedDescription || !p.detailedDescription.trim()) {
      missingDescription.push(p);
    }
    if (!p.primaryMaterialId || !p.parentCategory) {
      missingClassification.push(p);
    }
    if (!p.seo?.title || !p.seo?.description) {
      missingSeo.push(p);
    }
    if (p.status === "draft") {
      draftQueue.push(p);
    }
  });

  return NextResponse.json({
    summary: {
      totalProducts: allProducts.length,
      missingCoverCount: missingCover.length,
      missingDescriptionCount: missingDescription.length,
      missingClassificationCount: missingClassification.length,
      missingSeoCount: missingSeo.length,
      draftQueueCount: draftQueue.length
    },
    missingCover: missingCover.slice(0, 15),
    missingDescription: missingDescription.slice(0, 15),
    missingClassification: missingClassification.slice(0, 15),
    missingSeo: missingSeo.slice(0, 15),
    draftQueue: draftQueue.slice(0, 15)
  });
}
