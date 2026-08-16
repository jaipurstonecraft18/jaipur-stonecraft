import { NextResponse } from "next/server";
import getDB from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDB();
  const allRows = db.prepare("SELECT * FROM products ORDER BY updated_at DESC").all();
  const allProducts = allRows.map(formatProductFromRow);

  const missingCover = [];
  const missingDescription = [];
  const missingClassification = [];
  const missingSeo = [];
  const draftQueue = [];

  allProducts.forEach((p) => {
    // Missing cover image
    if (!p.imageSrc || p.imageSrc.includes("placehold.co")) {
      missingCover.push(p);
    }

    // Missing description
    if (!p.shortDescription || !p.shortDescription.trim() || !p.detailedDescription || !p.detailedDescription.trim()) {
      missingDescription.push(p);
    }

    // Missing classification
    if (!p.primaryMaterialId || !p.parentCategory) {
      missingClassification.push(p);
    }

    // Missing SEO
    if (!p.seo?.title || !p.seo?.description) {
      missingSeo.push(p);
    }

    // Draft queue
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
