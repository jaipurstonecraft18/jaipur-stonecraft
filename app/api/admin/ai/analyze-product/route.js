import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { query, getOne } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAiAvailable } from "@/lib/ai/config.js";
import { generateProductContentIntelligence } from "@/lib/ai/gemini-provider.js";

/**
 * POST /api/admin/ai/analyze-product
 * Protected admin route for AI-Assisted Product SEO & Content Intelligence.
 * PREVIEW-ONLY: Does not save or overwrite database contents.
 */
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAiAvailable()) {
    return NextResponse.json({
      success: false,
      isAiAvailable: false,
      error: "AI Service Unavailable: GEMINI_API_KEY environment variable is not set on the server."
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    let productData = body.product || null;
    const productSlug = body.productSlug || body.slug || null;
    const manualNotes = body.manualNotes || "";
    let selectedImages = Array.isArray(body.selectedImages) ? body.selectedImages : [];

    // If slug is provided and productData is not passed, load from database
    if (productSlug && !productData) {
      const row = await getOne("SELECT * FROM products WHERE slug = ?", [productSlug]);
      if (!row) {
        return NextResponse.json({ error: `Product with slug '${productSlug}' not found.` }, { status: 404 });
      }
      productData = await formatProductFromRow(row);
      
      if (selectedImages.length === 0 && Array.isArray(productData.images)) {
        selectedImages = productData.images.map(img => img.url || img.src).filter(Boolean);
      }
    }

    if (!productData || typeof productData !== "object") {
      return NextResponse.json({ error: "Invalid request payload. Provide 'product' object or valid 'productSlug'." }, { status: 400 });
    }

    const aiResult = await generateProductContentIntelligence(productData, {
      selectedImages,
      manualNotes
    });

    if (!aiResult.success) {
      return NextResponse.json({
        success: false,
        error: aiResult.error || "Failed to generate AI content intelligence."
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isAiAvailable: true,
      modelUsed: aiResult.modelUsed,
      imagesAnalyzedCount: aiResult.imagesAnalyzedCount,
      data: aiResult.data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Internal server error during AI product analysis."
    }, { status: 500 });
  }
}
