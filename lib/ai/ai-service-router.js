import { isGroqAvailable, isFullAiAvailable } from "./config.js";
import { generateGroqTextOptimization, executeGroqPrompt } from "./groq-provider.js";
import { generateProductContentIntelligence } from "./gemini-provider.js";
import {
  PIE_PROMPTS,
  SHARED_PIE_SYSTEM_INSTRUCTION,
  validateAndCleanPieOutput
} from "./prompts/product-prompts.js";

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

/**
 * Executes a targeted, field-specific PIE prompt action.
 * 
 * @param {string} actionId - One of the 15 PIE prompt IDs
 * @param {Object} productData - Product record or draft state
 * @param {Object} [options] - Contextual options
 * @returns {Promise<Object>} { success: boolean, action: string, data?: Object, error?: string }
 */
export async function executePieAction(actionId, productData = {}, options = {}) {
  const promptDef = PIE_PROMPTS[actionId];
  if (!promptDef) {
    return {
      success: false,
      errorCode: "INVALID_ACTION",
      error: `Action '${actionId}' is not recognized in PIE prompt registry.`
    };
  }

  const userPrompt = promptDef.buildUserPrompt(productData, options);

  // Strategy 1: Attempt Groq
  if (isGroqAvailable()) {
    const groqResult = await executeGroqPrompt(SHARED_PIE_SYSTEM_INSTRUCTION, userPrompt, options);
    if (groqResult.success) {
      try {
        const validated = validateAndCleanPieOutput(actionId, groqResult.rawContent);
        return {
          success: true,
          action: actionId,
          version: promptDef.version,
          fieldTarget: promptDef.fieldTarget,
          modelUsed: groqResult.modelUsed,
          provider: "groq",
          data: validated
        };
      } catch (validationErr) {
        return {
          success: false,
          errorCode: "SCHEMA_VALIDATION_ERROR",
          error: validationErr.message
        };
      }
    }
  }

  // Strategy 2: Fallback to Gemini if Groq is unavailable
  if (isFullAiAvailable()) {
    const geminiResult = await generateProductContentIntelligence(productData, {
      ...options,
      mode: "text",
      manualNotes: `PIE ACTION: ${actionId}. ${userPrompt}`
    });

    if (geminiResult.success && geminiResult.data) {
      return {
        success: true,
        action: actionId,
        version: promptDef.version,
        fieldTarget: promptDef.fieldTarget,
        modelUsed: geminiResult.modelUsed,
        provider: "gemini",
        data: geminiResult.data
      };
    }
  }

  return {
    success: false,
    errorCode: "UNAVAILABLE",
    error: "Neither GROQ_API_KEY nor GEMINI_API_KEY is available to process this action."
  };
}

