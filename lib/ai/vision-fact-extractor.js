/**
 * Jaipur Stonecraft — Vision Fact Extractor (Gemini)
 * 
 * Specializes strictly in extracting structured physical / visual facts from photos:
 * - Subject / Deity
 * - Product Type
 * - Stone Material & Color (STRICT RULE: Granite is strictly excluded)
 * - Posture / Carving Details
 * - Confidence Level & Missing Fields
 * 
 * Implements the 3 Gemini States:
 * A. FULL_SUCCESS
 * B. PARTIAL_SUCCESS
 * C. COMPLETE_FAILURE (Never blocks upload; returns clear missing fields for user confirmation)
 */

import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { getGeminiApiKey, getGeminiModel, isFullAiAvailable, AI_CONFIG } from "./config.js";

export const VISION_STATES = {
  FULL_SUCCESS: "FULL_SUCCESS",
  PARTIAL_SUCCESS: "PARTIAL_SUCCESS",
  COMPLETE_FAILURE: "COMPLETE_FAILURE"
};

/**
 * Extract physical facts from uploaded image(s) using Gemini Vision.
 * 
 * @param {Array<string>} imageUrls - Array of uploaded image URLs (e.g. ['/uploads/products/display/...'])
 * @param {Object} [options]
 * @returns {Promise<Object>} { success, state, facts, missingFields, confidence, error }
 */
export async function extractVisionFacts(imageUrls = [], options = {}) {
  // If no Gemini key is configured, return graceful complete failure without crashing
  if (!isFullAiAvailable()) {
    return {
      success: false,
      state: VISION_STATES.COMPLETE_FAILURE,
      errorCode: "UNAVAILABLE",
      error: "Gemini API is not configured on server. Please enter product details manually.",
      missingFields: ["subject", "material", "productType"],
      facts: getDefaultFallbackFacts()
    };
  }

  const validImages = Array.isArray(imageUrls)
    ? imageUrls.map(i => typeof i === "string" ? i : i?.url || i?.src).filter(Boolean)
    : [];

  if (validImages.length === 0) {
    return {
      success: false,
      state: VISION_STATES.COMPLETE_FAILURE,
      errorCode: "NO_IMAGE",
      error: "No photos provided for vision analysis.",
      missingFields: ["subject", "material", "productType"],
      facts: getDefaultFallbackFacts()
    };
  }

  try {
    // Adaptive Image Analysis: Analyze primary photo first
    const primaryImgUrl = validImages[0];
    const compressedInline = await loadAndCompressImage(primaryImgUrl);

    if (!compressedInline) {
      return {
        success: false,
        state: VISION_STATES.COMPLETE_FAILURE,
        errorCode: "IMAGE_LOAD_FAILED",
        error: "Unable to read primary photo for visual analysis.",
        missingFields: ["subject", "material", "productType"],
        facts: getDefaultFallbackFacts()
      };
    }

    const apiKey = getGeminiApiKey();
    const model = options.customModel || getGeminiModel();

    const systemPrompt = `
You are the Vision Art Inspector for Jaipur Stonecraft — an atelier in Jaipur, India specializing in hand-carved marble sculptures, Hindu deity murtis, temple architecture, stone murals, and garden fountains.
Your ONLY task is to visually identify the physical object in the photograph.
DO NOT write long marketing prose, sales pitches, or history essays.
STRICT RULE: Granite is strictly prohibited in this atelier. Never guess or identify granite. If a dark stone is seen, it is Black Bhainslana Marble or Soapstone.

You must respond STRICTLY in valid JSON matching this schema:
{
  "subject": "Name of deity or subject (e.g., Ganesh, Shiva, Radha Krishna, Buddha, Sai Baba, Elephant, Lion, Floral Relief, Plain Temple, Geometric Jali, Decorative)",
  "productType": "One of: statue, idol, sculpture, bust, relief, mandir, fountain, architectural_element, decorative_object",
  "material": "Estimated stone: Makrana Pure White Marble, Sangemarmar White Marble, Black Bhainslana Marble, Pink Bansi Paharpur Sandstone, Jodhpur Red Sandstone, Dholpur Beige Sandstone, Jaisalmer Yellow Limestone, or Natural Onyx",
  "color": "Primary color family: White, Black, Pink, Red, Beige, Golden Yellow",
  "posture": "Posture or format: Sitting / Seated, Standing, Meditating, Reclining, Wall Mounted, Free Standing",
  "finish": "Estimated surface finish: Hand Honed (Natural Matte), Mirror Polished, Antique Weathered, or Masonic Chiseled",
  "suggestedTitle": "Clean 3-6 word title (e.g., Hand-Carved White Marble Ganesh Statue)",
  "confidenceScore": 0.85,
  "confidenceLevel": "high",
  "confidenceFactors": {
    "subjectConfident": true,
    "materialConfident": true,
    "productTypeConfident": true
  }
}
`.trim();

    const userPrompt = "Visually inspect this photo and identify what stone art piece is shown. Respond strictly with the specified JSON.";

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    // 25 second timeout for fast vision check
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{
          parts: [
            { text: userPrompt },
            compressedInline
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1
        }
      })
    });

    clearTimeout(timeoutId);

    // Handle Gemini HTTP Errors (429, 400, 500, etc.)
    if (!res.ok) {
      const errText = await res.text();
      let errorCode = "SERVER_ERROR";
      if (res.status === 429) errorCode = "RATE_LIMIT";
      if (res.status === 503) errorCode = "UNAVAILABLE";

      return {
        success: false,
        state: VISION_STATES.COMPLETE_FAILURE,
        errorCode,
        error: `AI vision service unavailable (${errorCode}). You can continue manually.`,
        missingFields: ["subject", "material", "productType"],
        facts: getDefaultFallbackFacts()
      };
    }

    const resJson = await res.json();
    const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      return {
        success: false,
        state: VISION_STATES.COMPLETE_FAILURE,
        errorCode: "EMPTY_RESPONSE",
        error: "AI did not return visual data. Please verify product details.",
        missingFields: ["subject", "material", "productType"],
        facts: getDefaultFallbackFacts()
      };
    }

    let parsed = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      return {
        success: false,
        state: VISION_STATES.COMPLETE_FAILURE,
        errorCode: "INVALID_JSON",
        error: "AI returned unparseable output. Please verify details manually.",
        missingFields: ["subject", "material", "productType"],
        facts: getDefaultFallbackFacts()
      };
    }

    // Sanitize facts and enforce atelier rules
    const facts = sanitizeVisionFacts(parsed);

    // Evaluate confidence & missing fields to determine State (A, B, or C)
    const missingFields = [];
    const isSubjectKnown = Boolean(facts.subject && facts.subject !== "Unknown" && facts.confidenceFactors.subjectConfident);
    const isMaterialKnown = Boolean(facts.material && facts.confidenceFactors.materialConfident);
    const isTypeKnown = Boolean(facts.productType && facts.confidenceFactors.productTypeConfident);

    if (!isSubjectKnown) missingFields.push("subject");
    if (!isMaterialKnown) missingFields.push("material");
    if (!isTypeKnown) missingFields.push("productType");

    let state = VISION_STATES.FULL_SUCCESS;
    if (missingFields.length === 0 && facts.confidenceScore >= 0.7) {
      state = VISION_STATES.FULL_SUCCESS;
    } else if (missingFields.length < 3) {
      state = VISION_STATES.PARTIAL_SUCCESS;
    } else {
      state = VISION_STATES.COMPLETE_FAILURE;
    }

    return {
      success: true,
      state,
      facts,
      missingFields,
      confidenceScore: facts.confidenceScore,
      imagesAnalyzed: 1
    };

  } catch (error) {
    let errorCode = "SERVER_ERROR";
    if (error.name === "AbortError") {
      errorCode = "TIMEOUT";
    }

    return {
      success: false,
      state: VISION_STATES.COMPLETE_FAILURE,
      errorCode,
      error: errorCode === "TIMEOUT" ? "Vision analysis timed out. You can continue manually." : (error.message || "Vision analysis error"),
      missingFields: ["subject", "material", "productType"],
      facts: getDefaultFallbackFacts()
    };
  }
}

/**
 * Loads an image from local disk or URL, compresses it with Sharp to ~800px max dimension,
 * and formats it as Gemini inlineData.
 */
async function loadAndCompressImage(imagePathOrUrl) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);

    let rawBuffer = null;

    if (imagePathOrUrl.startsWith("/") || imagePathOrUrl.startsWith("public/")) {
      const cleanPath = imagePathOrUrl.startsWith("/") ? imagePathOrUrl.slice(1) : imagePathOrUrl;
      const fullPath = path.join(process.cwd(), "public", cleanPath.replace(/^public\//, ""));
      try {
        rawBuffer = await fs.readFile(fullPath);
      } catch {
        clearTimeout(timer);
        return null;
      }
    } else if (imagePathOrUrl.startsWith("http://") || imagePathOrUrl.startsWith("https://")) {
      const res = await fetch(imagePathOrUrl, { signal: controller.signal });
      clearTimeout(timer);
      if (!res.ok) return null;
      const arrayBuf = await res.arrayBuffer();
      rawBuffer = Buffer.from(arrayBuf);
    } else {
      clearTimeout(timer);
      return null;
    }

    clearTimeout(timer);
    if (!rawBuffer) return null;

    const compressed = await sharp(rawBuffer)
      .resize({
        width: 800,
        height: 800,
        fit: "inside",
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    return {
      inlineData: {
        mimeType: "image/jpeg",
        data: compressed.toString("base64")
      }
    };
  } catch {
    return null;
  }
}

/**
 * Sanitizes returned visual facts and strips forbidden terms.
 */
function sanitizeVisionFacts(raw = {}) {
  const sanitizeStr = (s, fallback = "") => {
    if (!s || typeof s !== "string") return fallback;
    let clean = s.trim().replace(/\bgranite\b/gi, "Natural Marble");
    return clean;
  };

  const subject = sanitizeStr(raw.subject, "Devotional Sculpture");
  let material = sanitizeStr(raw.material, "Makrana Pure White Marble");
  if (material.toLowerCase().includes("granite")) {
    material = "Makrana Pure White Marble";
  }

  const productType = sanitizeStr(raw.productType, "statue").toLowerCase();
  const color = sanitizeStr(raw.color, "White");
  const posture = sanitizeStr(raw.posture, "Sitting / Seated");
  const finish = sanitizeStr(raw.finish, "Hand Honed (Natural Matte)");

  let suggestedTitle = sanitizeStr(raw.suggestedTitle);
  if (!suggestedTitle || suggestedTitle.length < 5) {
    suggestedTitle = `Hand-Carved ${material.replace(/ Marble| Sandstone/i, "")} ${subject} ${productType === "statue" ? "Statue" : "Sculpture"}`;
  }

  const score = typeof raw.confidenceScore === "number" ? Math.max(0, Math.min(1, raw.confidenceScore)) : 0.8;
  const factors = raw.confidenceFactors || {};

  return {
    subject,
    productType,
    material,
    color,
    posture,
    finish,
    suggestedTitle,
    confidenceScore: score,
    confidenceLevel: raw.confidenceLevel || (score >= 0.7 ? "high" : score >= 0.4 ? "medium" : "low"),
    confidenceFactors: {
      subjectConfident: factors.subjectConfident !== undefined ? Boolean(factors.subjectConfident) : score >= 0.6,
      materialConfident: factors.materialConfident !== undefined ? Boolean(factors.materialConfident) : score >= 0.6,
      productTypeConfident: factors.productTypeConfident !== undefined ? Boolean(factors.productTypeConfident) : score >= 0.6
    }
  };
}

function getDefaultFallbackFacts() {
  return {
    subject: "",
    productType: "statue",
    material: "Makrana Pure White Marble",
    color: "White",
    posture: "Sitting / Seated",
    finish: "Hand Honed (Natural Matte)",
    suggestedTitle: "Hand-Carved Marble Sculpture",
    confidenceScore: 0,
    confidenceLevel: "low",
    confidenceFactors: {
      subjectConfident: false,
      materialConfident: false,
      productTypeConfident: false
    }
  };
}
