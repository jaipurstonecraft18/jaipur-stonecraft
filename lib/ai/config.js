/**
 * Jaipur Stonecraft — Centralized AI Provider Configuration
 * 
 * Secure server-side configuration for AI integration layer.
 * API key must NEVER be exposed to the client bundle.
 */

export const AI_CONFIG = {
  // Default to Gemini 2.5 Flash for high speed, multimodal capabilities, and structured JSON output
  defaultModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  
  // Timeout in milliseconds for AI requests
  timeoutMs: 30000,

  // Maximum image inline size (in bytes) to prevent overwhelming payload limits (~4MB)
  maxImageSizeBytes: 4 * 1024 * 1024
};

/**
 * Checks if the server environment has a configured Gemini API Key.
 * @returns {boolean}
 */
export function isAiAvailable() {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Retrieves the server-side Gemini API key securely.
 * Throws a clear descriptive error if missing on server.
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
 * Gets the configured Gemini model name.
 * @returns {string}
 */
export function getGeminiModel() {
  return process.env.GEMINI_MODEL || AI_CONFIG.defaultModel;
}
