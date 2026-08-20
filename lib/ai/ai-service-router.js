import { isGroqAvailable, isFullAiAvailable } from "./config.js";
import { generateGroqTextOptimization } from "./groq-provider.js";
import { generateProductContentIntelligence } from "./gemini-provider.js";

/**
 * Jaipur Stonecraft — Dual-Mode AI Router & Service Layer
 * 
 * Directs AI analysis requests based on user-selected mode:
 * 1. TEXT_OPTIMIZATION -> Text-only AI analysis (Groq primary, Gemini text fallback)
 * 2. FULL_ANALYSIS      -> Multimodal AI analysis (Gemini vision primary)
 */
export async function executeDualModeAiAnalysis(productData = {}, options = {}) {
  const modeKey = (options.mode || "TEXT_OPTIMIZATION").toUpperCase();

  if (modeKey === "TEXT_OPTIMIZATION" || modeKey === "TEXT") {
    // Primary: Groq text provider
    if (isGroqAvailable()) {
      return await generateGroqTextOptimization(productData, options);
    }
    // Fallback: Gemini text-only
    if (isFullAiAvailable()) {
      return await generateProductContentIntelligence(productData, {
        ...options,
        mode: "text",
        selectedImages: []
      });
    }

    return {
      success: false,
      errorCode: "UNAVAILABLE",
      error: "No AI provider API key configured on server (GROQ_API_KEY or GEMINI_API_KEY)."
    };
  }

  // Default / FULL_ANALYSIS: Gemini Multimodal Vision Provider
  if (isFullAiAvailable()) {
    return await generateProductContentIntelligence(productData, {
      ...options,
      mode: "full"
    });
  }

  // Graceful degradation if only Groq key is set for a FULL_ANALYSIS request
  if (isGroqAvailable()) {
    const textResult = await generateGroqTextOptimization(productData, options);
    if (textResult.success) {
      return {
        ...textResult,
        warning: "FULL_ANALYSIS mode degraded to TEXT_OPTIMIZATION (GEMINI_API_KEY not configured)."
      };
    }
  }

  return {
    success: false,
    errorCode: "UNAVAILABLE",
    error: "GEMINI_API_KEY environment variable is not configured on the server for full multimodal analysis."
  };
}
