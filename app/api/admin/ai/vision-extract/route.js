import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { extractVisionFacts, VISION_STATES } from "@/lib/ai/vision-fact-extractor.js";
import { matchTaxonomyFromFacts } from "@/lib/ai/taxonomy-matcher.js";

/**
 * POST /api/admin/ai/vision-extract
 * Protected admin route for fast, resilient vision fact extraction from uploaded product photo(s).
 * 
 * NEVER fails the upload workflow:
 * - If Gemini works -> Returns FULL_SUCCESS with extracted facts & matched taxonomy
 * - If Gemini partially identifies -> Returns PARTIAL_SUCCESS with only missing fields
 * - If Gemini fails/quota/timeout -> Returns COMPLETE_FAILURE with default taxonomy, allowing manual continuation
 */
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const imageUrls = Array.isArray(body.imageUrls)
      ? body.imageUrls
      : (body.imageUrl ? [body.imageUrl] : (body.imageSrc ? [body.imageSrc] : []));

    // 1. Extract visual facts using Gemini Vision (adaptive image analysis)
    const visionResult = await extractVisionFacts(imageUrls);

    // 2. Resolve catalogue taxonomy deterministically
    const taxonomy = await matchTaxonomyFromFacts(visionResult.facts);

    return NextResponse.json({
      success: true,
      state: visionResult.state || VISION_STATES.COMPLETE_FAILURE,
      facts: visionResult.facts,
      taxonomy,
      missingFields: visionResult.missingFields || [],
      confidenceScore: visionResult.confidenceScore || 0,
      error: visionResult.error || null,
      errorCode: visionResult.errorCode || null
    });

  } catch (error) {
    // Failsafe: Never crash upload process
    const fallbackTaxonomy = await matchTaxonomyFromFacts({});
    return NextResponse.json({
      success: true,
      state: VISION_STATES.COMPLETE_FAILURE,
      facts: {
        subject: "",
        material: "Makrana Pure White Marble",
        productType: "statue",
        suggestedTitle: "Hand-Carved Marble Sculpture"
      },
      taxonomy: fallbackTaxonomy,
      missingFields: ["subject", "material", "productType"],
      confidenceScore: 0,
      error: error.message || "Vision extraction encountered an error.",
      errorCode: "EXCEPTION"
    });
  }
}
