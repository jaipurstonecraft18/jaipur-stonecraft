/**
 * Jaipur Stonecraft — Admin Authentication & Security Manager
 * 
 * Provides session validation, cookie token verification, and route protection guards.
 * STRICT RULE: Zero hardcoded fallback secrets. App fails loudly if ADMIN_SECRET_KEY or ADMIN_PASSWORD are not set.
 */

import crypto from "crypto";

const COOKIE_NAME = "jsc_admin_session";

export { COOKIE_NAME };

/**
 * Retrieves ADMIN_SECRET_KEY from environment or throws explicit critical error
 */
export function getAdminSecret() {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret || !secret.trim()) {
    throw new Error("CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_SECRET_KEY environment variable is not defined.");
  }
  return secret.trim().replace(/^['"]|['"]$/g, "");
}

/**
 * Retrieves ADMIN_PASSWORD from environment or throws explicit critical error
 */
export function getAdminPassword() {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd || !pwd.trim()) {
    throw new Error("CRITICAL SECURITY CONFIGURATION ERROR: ADMIN_PASSWORD environment variable is not defined.");
  }
  return pwd.trim().replace(/^['"]|['"]$/g, "");
}

/**
 * Validates provided password against environment ADMIN_PASSWORD
 */
export function validateAdminCredentials(password) {
  if (!password || typeof password !== "string") return false;
  const expectedPassword = getAdminPassword();
  
  // Timing-safe comparison to prevent timing side-channel attacks
  const bufA = Buffer.from(password.trim());
  const bufB = Buffer.from(expectedPassword);
  
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Creates a signed HMAC session token
 */
export function createSessionToken() {
  const adminSecret = getAdminSecret();
  const timestamp = Date.now();
  const payload = `jsc_admin_${timestamp}`;
  const hmac = crypto.createHmac("sha256", adminSecret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

/**
 * Verifies a signed HMAC session token
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== "string") return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  try {
    const adminSecret = getAdminSecret();
    const [payload, hmac] = parts;
    const expectedHmac = crypto.createHmac("sha256", adminSecret).update(payload).digest("hex");

    const bufHmac = Buffer.from(hmac);
    const bufExpected = Buffer.from(expectedHmac);

    if (bufHmac.length === bufExpected.length && crypto.timingSafeEqual(bufHmac, bufExpected)) {
      const timestampStr = payload.replace("jsc_admin_", "");
      const timestamp = parseInt(timestampStr, 10);
      const maxAgeMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      return Date.now() - timestamp < maxAgeMs;
    }
  } catch (e) {
    return false;
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

/**
 * Machine-to-Machine Media & Sync Auth Guard
 * Validates either admin session tokens, x-sync-secret, or Bearer sync secret with constant-time comparison
 */
export function isAuthorizedSyncRequest(req) {
  try {
    if (isAuthorizedAdminRequest(req)) return true;

    const validSecret = (process.env.MEDIA_SYNC_SECRET || process.env.ADMIN_SECRET_KEY || process.env.BACKUP_SECRET_KEY || "").trim().replace(/^['"]|['"]$/g, "");
    if (!validSecret) return false;

    const expectedBuf = Buffer.from(validSecret);

    const headerSecret = req.headers.get("x-sync-secret");
    if (headerSecret) {
      const headerBuf = Buffer.from(headerSecret.trim());
      if (headerBuf.length === expectedBuf.length && crypto.timingSafeEqual(headerBuf, expectedBuf)) {
        return true;
      }
    }

    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const bearerVal = authHeader.substring(7).trim();
      const bearerBuf = Buffer.from(bearerVal);
      if (bearerBuf.length === expectedBuf.length && crypto.timingSafeEqual(bearerBuf, expectedBuf)) {
        return true;
      }
    }

    return false;
  } catch (e) {
    return false;
  }
}

