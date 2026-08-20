import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { query, getOne } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import { isAiAvailable } from "@/lib/ai/config.js";
import { executeDualModeAiAnalysis } from "@/lib/ai/ai-service-router.js";

/**
 * POST /api/admin/ai/analyze-product
 * Protected admin route for Dual-Mode AI Product SEO & Content Intelligence.
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
      errorCode: "UNAVAILABLE",
      error: "AI Service Unavailable: Neither GROQ_API_KEY nor GEMINI_API_KEY environment variable is configured on the server."
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    let productData = body.product || null;
    const productSlug = body.productSlug || body.slug || null;
    const manualNotes = body.manualNotes || "";
    const mode = body.mode || "TEXT_OPTIMIZATION";
    const fieldTarget = body.fieldTarget || null;
    const skipCache = Boolean(body.skipCache);
    let selectedImages = Array.isArray(body.selectedImages) ? body.selectedImages : [];

    // If slug is provided and productData is not passed, load from database
    if (productSlug && !productData) {
      const row = await getOne("SELECT * FROM products WHERE slug = ?", [productSlug]);
      if (!row) {
        return NextResponse.json({
          success: false,
          errorCode: "NOT_FOUND",
          error: `Product with slug '${productSlug}' not found.`
        }, { status: 404 });
      }
      productData = await formatProductFromRow(row);
      
      if (selectedImages.length === 0 && Array.isArray(productData.images)) {
        selectedImages = productData.images.map(img => img.url || img.src).filter(Boolean);
      }
    }

    if (!productData || typeof productData !== "object") {
      return NextResponse.json({
        success: false,
        errorCode: "BAD_REQUEST",
        error: "Invalid request payload. Provide 'product' object or valid 'productSlug'."
      }, { status: 400 });
    }

    const aiResult = await executeDualModeAiAnalysis(productData, {
      selectedImages,
      manualNotes,
      mode,
      fieldTarget,
      skipCache
    });

    if (!aiResult.success) {
      let statusCode = 500;
      if (aiResult.errorCode === "TIMEOUT") statusCode = 504;
      if (aiResult.errorCode === "RATE_LIMIT") statusCode = 429;
      if (aiResult.errorCode === "UNAVAILABLE") statusCode = 503;

      return NextResponse.json({
        success: false,
        errorCode: aiResult.errorCode || "SERVER_ERROR",
        error: aiResult.error || "Failed to generate AI content intelligence."
      }, { status: statusCode });
    }

    return NextResponse.json({
      success: true,
      isAiAvailable: true,
      modelUsed: aiResult.modelUsed,
      fromCache: Boolean(aiResult.fromCache),
      imagesAnalyzedCount: aiResult.imagesAnalyzedCount,
      data: aiResult.data
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      errorCode: "SERVER_ERROR",
      error: error.message || "Internal server error during AI product analysis."
    }, { status: 500 });
  }
}
