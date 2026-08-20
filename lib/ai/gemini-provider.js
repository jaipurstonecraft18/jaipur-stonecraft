/**
 * Jaipur Stonecraft — Gemini AI Provider
 * 
 * Direct, secure server-side integration with Gemini REST API.
 * Optimized for speed, low token overhead, image compression with sharp, 
 * in-memory result caching, and graceful fallback to text-only analysis.
 */

import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import sharp from "sharp";
import { getGeminiApiKey, getGeminiModel, isAiAvailable, AI_CONFIG } from "./config.js";
import { PRODUCT_AI_RESPONSE_SCHEMA, normalizeAiResponse } from "./response-schema.js";
import { buildProductContext, normalizeProductInput } from "./product-context-builder.js";

// In-memory cache for fast repeated analysis (Map<hash, { data, timestamp }>)
const analysisCache = new Map();

/**
 * Generates AI-assisted Product Content Intelligence & SEO suggestions for a given product.
 * 
 * @param {Object} product - Product record or form draft state
 * @param {Object} [options] - Options like selectedImages, manualNotes, customModel, mode, fieldTarget, skipCache
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string, errorCode?: string, fromCache?: boolean }
 */
export async function generateProductContentIntelligence(product, options = {}) {
  if (!isAiAvailable()) {
    return {
      success: false,
      errorCode: "UNAVAILABLE",
      error: "AI Service Unavailable: GEMINI_API_KEY environment variable is not configured on the server."
    };
  }

  try {
    const apiKey = getGeminiApiKey();
    const model = options.customModel || getGeminiModel();
    const context = buildProductContext(product, options);

    // Generate input fingerprint hash for caching
    const fingerprint = createFingerprint(context.normalized, options);
    if (!options.skipCache) {
      const cached = getCachedResult(fingerprint);
      if (cached) {
        return {
          success: true,
          data: cached.data,
          modelUsed: model,
          imagesAnalyzedCount: cached.imagesAnalyzedCount,
          fromCache: true
        };
      }
    }

    // Build API payload parts
    const parts = [
      { text: context.userPrompt }
    ];

    let imagesAnalyzedCount = 0;

    // Process primary image for multimodal vision input (max 1 cover image to keep latency minimal)
    if (Array.isArray(context.selectedImages) && context.selectedImages.length > 0) {
      const primaryImage = context.selectedImages[0];
      const url = typeof primaryImage === "string" ? primaryImage : primaryImage?.url || primaryImage?.src;
      
      if (url) {
        const inlinePart = await loadImageCompressed(url);
        if (inlinePart) {
          parts.push(inlinePart);
          imagesAnalyzedCount = 1;
        }
      }
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const requestBody = {
      systemInstruction: {
        parts: [{ text: context.systemInstruction }]
      },
      contents: [
        { parts }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    };

    const isFullAnalysis = !options.mode || options.mode === "full";
    const requestTimeoutMs = isFullAnalysis ? (AI_CONFIG.geminiTimeoutMs || 45000) : (AI_CONFIG.targetedTimeoutMs || 15000);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), requestTimeoutMs);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMsg = `Gemini API Error (HTTP ${response.status})`;
      let errorCode = "SERVER_ERROR";

      if (response.status === 429) {
        errorCode = "RATE_LIMIT";
        errorMsg = "AI quota or rate limit reached. Please wait a moment and try again.";
      } else if (response.status === 400) {
        errorCode = "INVALID_REQUEST";
      }

      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson?.error?.message) {
          errorMsg = errorJson.error.message;
        }
      } catch {
        // Fallback to text
      }

      return { success: false, errorCode, error: sanitizeOutputText(errorMsg) };
    }

    const resJson = await response.json();
    const textOutput = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return {
        success: false,
        errorCode: "INVALID_RESPONSE",
        error: "AI provider returned empty response payload."
      };
    }

    const parsedData = JSON.parse(textOutput);
    let finalData;

    if (options.mode === "field" && options.fieldTarget) {
      const camelKey = options.fieldTarget;
      const snakeKey = camelKey.replace(/([A-Z])/g, "_$1").toLowerCase();
      const val = parsedData[camelKey] || parsedData[snakeKey] || parsedData.refined_text || parsedData.text || parsedData.content || (typeof Object.values(parsedData)[0] === "string" ? Object.values(parsedData)[0] : "");
      finalData = {
        [camelKey]: sanitizeOutputText(String(val))
      };
    } else {
      const normalizedData = normalizeAiResponse(parsedData, context.normalized);
      finalData = sanitizeOutputObject(normalizedData);
    }

    // Cache successful result
    setCachedResult(fingerprint, { data: finalData, imagesAnalyzedCount });

    return {
      success: true,
      data: finalData,
      modelUsed: model,
      imagesAnalyzedCount,
      fromCache: false
    };

  } catch (error) {
    if (error.name === "AbortError") {
      return {
        success: false,
        errorCode: "TIMEOUT",
        error: `AI analysis request timed out after ${AI_CONFIG.timeoutMs / 1000} seconds. Please try again.`
      };
    }
    return {
      success: false,
      errorCode: "SERVER_ERROR",
      error: error.message || "An unexpected error occurred during AI content intelligence generation."
    };
  }
}

/**
 * Loads an image, resizes/compresses using `sharp` to ~30-60KB, and returns inlineData format.
 * Includes explicit 4s timeout so image loading NEVER blocks text analysis.
 */
async function loadImageCompressed(imagePathOrUrl) {
  try {
    const controller = new AbortController();
    const imgTimeout = setTimeout(() => controller.abort(), AI_CONFIG.imageTimeoutMs);

    let rawBuffer;

    if (imagePathOrUrl.startsWith("/") || imagePathOrUrl.startsWith("public/")) {
      const cleanPath = imagePathOrUrl.startsWith("/") ? imagePathOrUrl.slice(1) : imagePathOrUrl;
      const fullPath = path.join(process.cwd(), "public", cleanPath.replace(/^public\//, ""));
      try {
        rawBuffer = await fs.readFile(fullPath);
      } catch {
        clearTimeout(imgTimeout);
        return null;
      }
    } else if (imagePathOrUrl.startsWith("http://") || imagePathOrUrl.startsWith("https://")) {
      const fetchRes = await fetch(imagePathOrUrl, { signal: controller.signal });
      clearTimeout(imgTimeout);
      if (!fetchRes.ok) return null;
      const arrayBuf = await fetchRes.arrayBuffer();
      rawBuffer = Buffer.from(arrayBuf);
    } else {
      clearTimeout(imgTimeout);
      return null;
    }

    clearTimeout(imgTimeout);
    if (!rawBuffer) return null;

    // Use Sharp to resize image to max dimension 800px and compress to JPEG ~80%
    const compressedBuffer = await sharp(rawBuffer)
      .resize({
        width: AI_CONFIG.imageMaxDimension,
        height: AI_CONFIG.imageMaxDimension,
        fit: "inside",
        withoutEnlargement: true
      })
      .jpeg({ quality: AI_CONFIG.imageQuality })
      .toBuffer();

    return {
      inlineData: {
        mimeType: "image/jpeg",
        data: compressedBuffer.toString("base64")
      }
    };
  } catch {
    // Return null silently on image failure so text-based AI analysis still proceeds cleanly!
    return null;
  }
}

/**
 * Creates SHA256 fingerprint of input for caching.
 */
function createFingerprint(normalizedInput, options = {}) {
  const payloadStr = JSON.stringify({
    input: normalizedInput,
    mode: options.mode || "full",
    fieldTarget: options.fieldTarget || "",
    image: options.selectedImages?.[0] || ""
  });
  return crypto.createHash("sha256").update(payloadStr).digest("hex");
}

function getCachedResult(fingerprint) {
  const cached = analysisCache.get(fingerprint);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > AI_CONFIG.cacheTtlMs) {
    analysisCache.delete(fingerprint);
    return null;
  }
  return cached;
}

function setCachedResult(fingerprint, payload) {
  // Prune cache if exceeds 100 entries
  if (analysisCache.size > 100) {
    const oldestKey = analysisCache.keys().next().value;
    analysisCache.delete(oldestKey);
  }
  analysisCache.set(fingerprint, {
    ...payload,
    timestamp: Date.now()
  });
}

/**
 * Sanitizes output string to strip forbidden keywords like granite.
 */
function sanitizeOutputText(str) {
  if (!str || typeof str !== "string") return str;
  let text = str;
  AI_CONFIG.forbiddenTerms.forEach(term => {
    const reg = new RegExp(`\\b${term}\\b`, "gi");
    text = text.replace(reg, "Natural Stone");
  });
  return text;
}

/**
 * Recursively sanitizes JSON output object and array values.
 */
function sanitizeOutputObject(obj) {
  if (typeof obj === "string") {
    return sanitizeOutputText(obj);
  }
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeOutputObject);
  }
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const cleanKey = sanitizeOutputText(key);
    result[cleanKey] = sanitizeOutputObject(value);
  }
  return result;
}
