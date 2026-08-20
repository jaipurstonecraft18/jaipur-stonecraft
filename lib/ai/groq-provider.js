import { getGroqApiKey, getGroqModel, AI_CONFIG } from "./config.js";
import { buildProductContext } from "./product-context-builder.js";
import { normalizeAiResponse } from "./response-schema.js";

/**
 * Jaipur Stonecraft — Groq Provider for Text & SEO Optimization Mode
 * 
 * Performs high-speed text-only product analysis using Groq LLM API.
 * Uses manual product facts only without image payloads.
 */
export async function generateGroqTextOptimization(productData = {}, options = {}) {
  const apiKey = getGroqApiKey();
  const model = getGroqModel();

  const context = buildProductContext(productData, {
    ...options,
    isMultimodal: false,
    selectedImages: []
  });

  const systemInstruction = (context.systemInstruction || "You are an expert stone art curator and luxury SEO specialist for Jaipur Stonecraft atelier. Output strictly valid JSON matching requested keys without any conversational preambles or markdown codeblock wrappers.").trim();
  const userPrompt = String(context.userPrompt || "").trim();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.groqTimeoutMs || 25000);

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemInstruction
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 4000
      })
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      let errorCode = "SERVER_ERROR";
      if (res.status === 429) errorCode = "RATE_LIMIT";
      if (res.status === 503) errorCode = "UNAVAILABLE";

      return {
        success: false,
        errorCode,
        error: `Groq API HTTP ${res.status}: ${errText.slice(0, 200)}`
      };
    }

    const json = await res.json();
    const rawContent = json.choices?.[0]?.message?.content || "";

    let parsed = {};
    try {
      parsed = typeof rawContent === "string" ? JSON.parse(rawContent) : (rawContent || {});
    } catch (e) {
      parsed = {};
    }

    const normalizedData = normalizeAiResponse(parsed, productData);

    return {
      success: true,
      provider: "groq",
      modelUsed: model,
      imagesAnalyzedCount: 0,
      data: normalizedData
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      return {
        success: false,
        errorCode: "TIMEOUT",
        error: `Groq request timed out after ${AI_CONFIG.timeoutMs / 1000}s.`
      };
    }

    return {
      success: false,
      errorCode: "SERVER_ERROR",
      error: error.message || "Failed to execute Groq text optimization."
    };
  }
}
