/**
 * Jaipur Stonecraft — Admin Login Rate Limiter
 * 
 * IP-based sliding window rate limiter protecting against brute-force login attempts.
 * Limit: Max 5 failed attempts per 15-minute window per IP.
 */

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// In-memory record store: Map<ipAddress, { count: number, resetTime: number }>
const attemptStore = new Map();

/**
 * Extracts client IP address from NextRequest
 */
export function getClientIp(req) {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks if client IP is currently rate limited
 */
export function checkRateLimit(ip) {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record) {
    return { isRateLimited: false, remainingAttempts: MAX_FAILED_ATTEMPTS, resetSeconds: 0 };
  }

  // Reset counter if window expired
  if (now > record.resetTime) {
    attemptStore.delete(ip);
    return { isRateLimited: false, remainingAttempts: MAX_FAILED_ATTEMPTS, resetSeconds: 0 };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { isRateLimited: true, remainingAttempts: 0, resetSeconds };
  }

  return {
    isRateLimited: false,
    remainingAttempts: MAX_FAILED_ATTEMPTS - record.count,
    resetSeconds: Math.ceil((record.resetTime - now) / 1000)
  };
}

/**
 * Records a failed login attempt for client IP
 */
export function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = attemptStore.get(ip);

  if (!record || now > record.resetTime) {
    attemptStore.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS
    });
  } else {
    record.count += 1;
  }
}

/**
 * Resets rate limit records for client IP on successful login
 */
export function resetRateLimit(ip) {
  attemptStore.delete(ip);
}
