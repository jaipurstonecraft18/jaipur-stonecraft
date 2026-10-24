import { getGroqApiKey, getGroqModel, getGroqMaxTokens, AI_CONFIG } from "./config.js";
import { buildProductContext } from "./product-context-builder.js";
import { normalizeAiResponse } from "./response-schema.js";

/**
 * Extracts and parses JSON from raw LLM output text, handling Markdown codeblocks or conversational wrappers.
 */
function extractJsonFromText(rawText) {
  if (!rawText || typeof rawText !== "string") return null;
  let text = rawText.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/i, "").trim();
  }
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.slice(firstBrace, lastBrace + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}

/**
 * Jaipur Stonecraft — Groq Provider for Text & SEO Optimization Mode
 * 
 * Performs high-speed text-only product analysis using Groq LLM API.
 * Uses manual product facts only without image payloads.
 */
export async function generateGroqTextOptimization(productData = {}, options = {}) {
  const apiKey = getGroqApiKey();
  const modelsToTry = [
    options.customModel || getGroqModel(),
    ...(AI_CONFIG.fallbackGroqModels || []).filter(m => m !== (options.customModel || getGroqModel()))
  ];

  const context = buildProductContext(productData, {
    ...options,
    isMultimodal: false,
    selectedImages: []
  });

  const systemInstruction = context.systemInstruction;
  const userPrompt = context.userPrompt;

  let lastError = null;

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.groqTimeoutMs || 30000);

    try {
      const requestBody = {
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.25,
        max_tokens: getGroqMaxTokens(options.maxTokens),
        response_format: { type: "json_object" }
      };

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        lastError = `Groq (${model}) HTTP ${res.status}: ${errText.slice(0, 200)}`;
        // Try fallback model if rate limit or server error
        continue;
      }

      const json = await res.json();
      const rawContent = json.choices?.[0]?.message?.content || "";

      const parsed = extractJsonFromText(rawContent);
      if (!parsed) {
        lastError = `Groq (${model}) produced unparseable JSON output: ${rawContent.slice(0, 150)}`;
        continue;
      }

      const normalizedData = normalizeAiResponse(parsed, productData);
      if (!normalizedData.hasAiContent) {
        lastError = `Groq (${model}) generated empty product descriptions.`;
        continue;
      }

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
        lastError = `Groq (${model}) request timed out after ${(AI_CONFIG.groqTimeoutMs || 30000) / 1000}s.`;
      } else {
        lastError = error.message || `Failed to execute Groq text optimization with ${model}.`;
      }
    }
  }

  return {
    success: false,
    errorCode: "PROVIDER_ERROR",
    error: lastError || "Failed to generate content intelligence with Groq."
  };
}

/**
 * Executes a direct system + user prompt on Groq with JSON output format.
 */
export async function executeGroqPrompt(systemInstruction, userPrompt, options = {}) {
  const apiKey = getGroqApiKey();
  const modelsToTry = [
    options.model || getGroqModel(),
    ...(AI_CONFIG.fallbackGroqModels || []).filter(m => m !== (options.model || getGroqModel()))
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.groqTimeoutMs || 30000);

    try {
      const requestBody = {
        model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt }
        ],
        temperature: options.temperature || 0.25,
        max_tokens: getGroqMaxTokens(options.maxTokens),
        response_format: { type: "json_object" }
      };

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errText = await res.text();
        lastError = `Groq (${model}) HTTP ${res.status}: ${errText.slice(0, 200)}`;
        continue;
      }

      const json = await res.json();
      const rawContent = json.choices?.[0]?.message?.content || "";

      return {
        success: true,
        provider: "groq",
        modelUsed: model,
        rawContent
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        lastError = `Groq (${model}) request timed out.`;
      } else {
        lastError = error.message;
      }
    }
  }

  return {
    success: false,
    errorCode: "SERVER_ERROR",
    error: lastError || "Failed to execute Groq prompt."
  };
}
