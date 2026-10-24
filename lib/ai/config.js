/**
 * Jaipur Stonecraft — Centralized AI Provider Configuration
 * 
 * Secure server-side configuration for AI integration layer.
 * API key must NEVER be exposed to the client bundle.
 */

export const AI_CONFIG = {
  // Default to Gemini for multimodal capabilities
  defaultModel: process.env.GEMINI_MODEL || "gemini-flash-lite-latest",
  fallbackGeminiModels: ["gemini-flash-lite-latest", "gemini-3.5-flash-lite", "gemini-flash-latest"],
  
  // Default to Groq for ultra-fast text & SEO optimization
  defaultGroqModel: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  fallbackGroqModels: ["openai/gpt-oss-120b", "openai/gpt-oss-20b", "qwen/qwen3.8-27b"],
  
  // Groq max tokens constraint (supports comprehensive descriptions + SEO metadata)
  groqMaxTokens: 2048,
  
  // Provider-specific timeouts for maximum reliability
  groqTimeoutMs: 30000,    // 30 seconds for Groq text optimization
  geminiTimeoutMs: 45000,  // 45 seconds for Gemini multimodal vision analysis
  targetedTimeoutMs: 15000,
  imageTimeoutMs: 8000,    // 8 seconds limit for image fetch & compression

  // Maximum image inline size (in bytes) to prevent overwhelming payload limits (~4MB)
  maxImageSizeBytes: 4 * 1024 * 1024,

  // Image optimization parameters for Gemini vision inputs
  imageMaxDimension: 800,
  imageQuality: 80,

  // In-memory cache TTL (5 minutes)
  cacheTtlMs: 5 * 60 * 1000,

  // Forbidden materials according to atelier rules (synthetic resin and cultured stone)
  forbiddenTerms: ["synthetic marble", "cultured marble", "resin cast", "bonded marble"]
};

/**
 * Checks if the server environment has a configured Gemini API Key.
 * @returns {boolean}
 */
export function isAiAvailable() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Checks if Groq API Key is configured for text optimization.
 * @returns {boolean}
 */
export function isGroqAvailable() {
  const apiKey = process.env.GROQ_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Checks if Text AI Optimization mode is available.
 * @returns {boolean}
 */
export function isTextAiAvailable() {
  return isGroqAvailable() || isAiAvailable();
}

/**
 * Checks if Full Multimodal AI Analysis mode is available.
 * @returns {boolean}
 */
export function isFullAiAvailable() {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Retrieves the server-side Gemini API key securely.
 * @returns {string}
 */
export function getGeminiApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("GEMINI_API_KEY environment variable is not configured on the server.");
  }
  return apiKey.trim();
}

/**
 * Retrieves the server-side Groq API key securely.
 * @returns {string}
 */
export function getGroqApiKey() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    throw new Error("GROQ_API_KEY environment variable is not configured on the server.");
  }
  return apiKey.trim();
}

/**
 * Gets the configured Gemini model name.
 * @returns {string}
 */
export function getGeminiModel() {
  return process.env.GEMINI_MODEL || AI_CONFIG.defaultModel;
}

/**
 * Gets the configured Groq model name.
 * @returns {string}
 */
export function getGroqModel() {
  return process.env.GROQ_MODEL || AI_CONFIG.defaultGroqModel;
}

/**
 * Gets the configured Groq max_tokens (supports comprehensive descriptions + SEO metadata).
 * @param {number} [requestedTokens]
 * @returns {number}
 */
export function getGroqMaxTokens(requestedTokens) {
  const envTokens = process.env.GROQ_MAX_TOKENS ? parseInt(process.env.GROQ_MAX_TOKENS, 10) : null;
  const target = (typeof requestedTokens === "number" && requestedTokens > 0)
    ? requestedTokens
    : (envTokens || AI_CONFIG.groqMaxTokens || 2048);
  return Math.min(Math.max(target, 512), 4096);
}

