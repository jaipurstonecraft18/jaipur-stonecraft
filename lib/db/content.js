import { getOne } from "./client.js";

/**
 * Get dynamic site content slot value from DB with automatic fallback
 */
export async function getSiteContent(keyName, defaultValue = "") {
  try {
    const row = await getOne("SELECT value, alt_text FROM site_content WHERE key_name = ?", [keyName]);
    if (row && row.value) {
      return {
        url: row.value,
        alt: row.alt_text || defaultValue
      };
    }
  } catch (e) {
    // Return fallback on DB exception
  }
  return {
    url: defaultValue,
    alt: "Jaipur Stonecraft hand-carved stone art"
  };
}
