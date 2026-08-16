/**
 * Jaipur Stonecraft — Admin Authentication & Security Manager
 * 
 * Provides session validation, cookie token verification, and route protection guards.
 */

import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "jsc-admin-secret-key-2026-atelier";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "jscadmin2026";
const COOKIE_NAME = "jsc_admin_session";

export { COOKIE_NAME };

/**
 * Validates provided password against admin secret/env password
 */
export function validateAdminCredentials(password) {
  if (!password) return false;
  return password.trim() === DEFAULT_ADMIN_PASSWORD;
}

/**
 * Creates a signed HMAC session token
 */
export function createSessionToken() {
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Verifies a signed HMAC session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payload, hmac] = parts;
  const expectedHmac = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");

  if (crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) {
    // Check if session is less than 7 days old
    const timestampStr = payload.replace("jsc_admin_", "");
    const timestamp = parseInt(timestampStr, 10);
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    return Date.now() - timestamp < maxAgeMs;
  }

  return false;
}

/**
 * Server Component / Route Handler Auth Guard
 */
export function isAuthorizedAdminRequest(req) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    // Check cookies header if auth header is missing
    if (!token) {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = match[1];
      }
    }

    return verifySessionToken(token);
  } catch (e) {
    return false;
  }
}
