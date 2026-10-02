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
 * Checks if client IP is currently rate limited for admin login
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

  // Prune expired records if store exceeds 1000
  if (attemptStore.size > 1000) {
    for (const [k, v] of attemptStore.entries()) {
      if (now > v.resetTime) attemptStore.delete(k);
    }
  }

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

// Global store for generic endpoint limiters: Map<namespace, Map<ip, { count: number, resetTime: number }>>
const endpointStores = new Map();

/**
 * Generic sliding window rate limiter for public endpoints (Search, Contact/Inquiries)
 */
export function checkEndpointRateLimit(namespace, ip, maxRequests, windowMs) {
  const now = Date.now();
  if (!endpointStores.has(namespace)) {
    endpointStores.set(namespace, new Map());
  }
  const store = endpointStores.get(namespace);

  // Periodic pruning of expired entries to prevent memory buildup
  if (store.size > 2000) {
    for (const [k, v] of store.entries()) {
      if (now > v.resetTime) store.delete(k);
    }
  }

  const record = store.get(ip);
  if (!record || now > record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return { isRateLimited: false, remaining: maxRequests - 1, resetSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxRequests) {
    const resetSeconds = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { isRateLimited: true, remaining: 0, resetSeconds };
  }

  record.count += 1;
  return {
    isRateLimited: false,
    remaining: maxRequests - record.count,
    resetSeconds: Math.max(1, Math.ceil((record.resetTime - now) / 1000))
  };
}
