import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { isAiAvailable } from "@/lib/ai/config.js";
import { generateProductContentIntelligence } from "@/lib/ai/gemini-provider.js";

/**
 * POST /api/admin/ai/generate-alt-texts
 * Protected admin API endpoint specifically for generating distinct Image SEO Alt Texts per image.
 */
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAiAvailable()) {
    return NextResponse.json({
      success: false,
      error: "AI Service Unavailable: GEMINI_API_KEY is not set on the server."
    }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { productName, materialName, productType, images } = body;

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided for alt text generation." }, { status: 400 });
    }

    const mockProduct = {
      name: productName || "Hand-Carved Stone Artifact",
      primaryMaterialId: materialName || "Natural Stone",
      productType: productType || "Sculpture"
    };

    const imageUrls = images.map(img => typeof img === "string" ? img : img.url || img.src).filter(Boolean);

    const result = await generateProductContentIntelligence(mockProduct, {
      selectedImages: imageUrls,
      manualNotes: `Focus specifically on Image Alt Text generation for each of the ${imageUrls.length} images. Differentiate visual angles (e.g., front view, side profile, carving detail, plinth base). Never give identical alt texts to different images.`
    });

    if (!result.success || !result.data) {
      return NextResponse.json({
        success: false,
        error: result.error || "Failed to generate image alt texts."
      }, { status: 500 });
    }

    const altTextSuggestions = result.data.image_alt_texts || [];

    // Map back to input images array
    const mappedImages = images.map((img, index) => {
      const url = typeof img === "string" ? img : img.url || img.src;
      const foundMatch = altTextSuggestions.find(a => a.image_url === url) || altTextSuggestions[index];
      return {
        url,
        suggestedAlt: foundMatch?.suggested_alt || `${mockProduct.name} - View ${index + 1}`
      };
    });

    return NextResponse.json({
      success: true,
      images: mappedImages
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to process image alt text generation."
    }, { status: 500 });
  }
}
