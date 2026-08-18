/**
 * Jaipur Stonecraft — Gemini AI Provider
 * 
 * Direct, secure server-side integration with Gemini REST API.
 * Uses structured JSON outputs and optional multimodal image analysis.
 * NEVER exposed to client-side bundles.
 */

import path from "path";
import fs from "fs/promises";
import { getGeminiApiKey, getGeminiModel, isAiAvailable, AI_CONFIG } from "./config.js";
import { PRODUCT_AI_RESPONSE_SCHEMA, normalizeAiResponse } from "./response-schema.js";
import { buildProductContext } from "./product-context-builder.js";

/**
 * Generates AI-assisted Product Content Intelligence & SEO suggestions for a given product.
 * 
 * @param {Object} product - Product record or form draft state
 * @param {Object} [options] - Options like selectedImages, manualNotes, customModel
 * @returns {Promise<Object>} { success: boolean, data?: Object, error?: string }
 */
export async function generateProductContentIntelligence(product, options = {}) {
  if (!isAiAvailable()) {
    return {
      success: false,
      error: "AI generation is temporarily unavailable. Your existing product information has not been changed. Please configure GEMINI_API_KEY on the server."
    };
  }

  try {
    const apiKey = getGeminiApiKey();
    const model = options.customModel || getGeminiModel();
    const context = buildProductContext(product, options);

    // Build API payload parts
    const parts = [
      { text: context.userPrompt }
    ];

    // Process selected images for multimodal vision input (max 2 images to stay fast & lightweight)
    if (Array.isArray(context.selectedImages) && context.selectedImages.length > 0) {
      const imagesToAnalyze = context.selectedImages.slice(0, 2);
      for (const imgItem of imagesToAnalyze) {
        const url = typeof imgItem === "string" ? imgItem : imgItem.url;
        if (url) {
          const inlinePart = await loadImageAsInlinePart(url);
          if (inlinePart) {
            parts.push(inlinePart);
          }
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
        responseSchema: PRODUCT_AI_RESPONSE_SCHEMA,
        temperature: 0.2
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeoutMs);

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
      let errorMsg = `Gemini API HTTP Error ${response.status}`;
      try {
        const errorJson = JSON.parse(errorText);
        errorMsg = errorJson?.error?.message || errorMsg;
      } catch {
        // Fallback to text
      }
      return { success: false, error: errorMsg };
    }

    const resJson = await response.json();
    const textOutput = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      return { success: false, error: "AI provider returned empty response payload." };
    }

    const parsedData = JSON.parse(textOutput);
    const normalizedData = normalizeAiResponse(parsedData);

    return {
      success: true,
      data: normalizedData,
      modelUsed: model,
      imagesAnalyzedCount: parts.length - 1
    };

  } catch (error) {
    if (error.name === "AbortError") {
      return { success: false, error: "AI analysis request timed out. Please try again." };
    }
    return {
      success: false,
      error: error.message || "An unexpected error occurred during AI content intelligence generation."
    };
  }
}

/**
 * Loads a local or remote image and converts it to Gemini inlineData format { inlineData: { mimeType, data } }
 */
async function loadImageAsInlinePart(imagePathOrUrl) {
  try {
    let buffer;
    let mimeType = "image/jpeg";

    if (imagePathOrUrl.endsWith(".png")) mimeType = "image/png";
    else if (imagePathOrUrl.endsWith(".webp")) mimeType = "image/webp";
    else if (imagePathOrUrl.endsWith(".jpg") || imagePathOrUrl.endsWith(".jpeg")) mimeType = "image/jpeg";

    // Handle relative local uploads (e.g., /uploads/products/...)
    if (imagePathOrUrl.startsWith("/") || imagePathOrUrl.startsWith("public/")) {
      const cleanPath = imagePathOrUrl.startsWith("/") ? imagePathOrUrl.slice(1) : imagePathOrUrl;
      const fullPath = path.join(process.cwd(), "public", cleanPath.replace(/^public\//, ""));
      
      try {
        const stats = await fs.stat(fullPath);
        if (stats.size > AI_CONFIG.maxImageSizeBytes) {
          return null; // Exceeds size limit, skip safely
        }
        buffer = await fs.readFile(fullPath);
      } catch {
        return null; // Local file missing, skip safely
      }
    } else if (imagePathOrUrl.startsWith("http://") || imagePathOrUrl.startsWith("https://")) {
      // Remote URL
      const fetchRes = await fetch(imagePathOrUrl);
      if (!fetchRes.ok) return null;
      const arrayBuf = await fetchRes.arrayBuffer();
      buffer = Buffer.from(arrayBuf);
      const contentType = fetchRes.headers.get("content-type");
      if (contentType) mimeType = contentType.split(";")[0];
    } else {
      return null;
    }

    if (!buffer) return null;

    return {
      inlineData: {
        mimeType,
        data: buffer.toString("base64")
      }
    };
  } catch {
    return null; // Ignore image load errors so text analysis still proceeds
  }
}
