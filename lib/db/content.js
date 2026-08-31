import { getOne } from "./client.js";

/**
 * Get dynamic site content slot value from DB with automatic fallback
 */
export async function getSiteContent(keyName, defaultValue = "") {
  try {
    const row = await getOne("SELECT value, alt_text FROM site_content WHERE key_name = ?", [keyName]);
    if (row && row.value) {
      const cleanVal = typeof row.value === "string" ? row.value.trim().replace(/^["']|["']$/g, "") : row.value;
      return {
        url: cleanVal,
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

/**
 * Get dynamic page section content (JSON) from page_sections table with automatic fallback
 */
export async function getPageSection(keyName, defaultContent = {}) {
  try {
    const row = await getOne("SELECT content_json FROM page_sections WHERE key_name = ?", [keyName]);
    if (row && row.content_json) {
      return JSON.parse(row.content_json);
    }
  } catch (e) {
    // Return fallback on DB exception
  }
  return defaultContent;
}

/**
 * Get dynamic site setting value from site_settings table with automatic fallback
 */
export async function getSiteSetting(keyName, defaultValue = {}) {
  try {
    const row = await getOne("SELECT value FROM site_settings WHERE key_name = ?", [keyName]);
    if (row && row.value) {
      return JSON.parse(row.value);
    }
  } catch (e) {
    // Return fallback on DB exception
  }
  return defaultValue;
}
