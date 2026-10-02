/**
 * Jaipur Stonecraft — Tiered Admin Login Rate Limiter
 * 
 * Multi-stage defense:
 * 1. Stage 1: 10 failed attempts -> 30-second cooldown / countdown.
 * 2. Stage 2: 3 additional trials.
 * 3. Stage 3: If failed again -> 15-minute security lockout.
 */

const STAGE_1_MAX = 10;                     // 10 failed attempts
const STAGE_1_LOCK_MS = 30 * 1000;          // 30 seconds countdown
const STAGE_2_EXTRA_TRIALS = 3;             // 3 trials
const STAGE_2_MAX = STAGE_1_MAX + STAGE_2_EXTRA_TRIALS; // 13 total failed attempts
const STAGE_2_LOCK_MS = 15 * 60 * 1000;     // 15 minutes lockout
const INACTIVITY_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes inactivity expiry

// In-memory record store: Map<ipAddress, { count: number, lockUntil: number, lockType: string|null, stage: number, lastAttempt: number }>
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
    return {
      isRateLimited: false,
      lockType: null,
      remainingAttempts: STAGE_1_MAX,
      resetSeconds: 0,
      stage: 1
    };
  }

  // If long 15-minute lock expired or inactivity period expired, clean up and reset
  if ((record.stage === 3 && now >= record.lockUntil) || (now - record.lastAttempt > INACTIVITY_EXPIRY_MS)) {
    attemptStore.delete(ip);
    return {
      isRateLimited: false,
      lockType: null,
      remainingAttempts: STAGE_1_MAX,
      resetSeconds: 0,
      stage: 1
    };
  }

  // If currently locked (either 30s countdown or 15m timer)
  if (record.lockUntil && now < record.lockUntil) {
    const resetSeconds = Math.max(1, Math.ceil((record.lockUntil - now) / 1000));
    return {
      isRateLimited: true,
      lockType: record.lockType,
      remainingAttempts: 0,
      resetSeconds,
      stage: record.stage
    };
  }

  // If 30-second lock has elapsed: user is now in Stage 2 with 3 trials
  if (record.stage === 2) {
    const trialsUsed = Math.max(0, record.count - STAGE_1_MAX);
    const remainingTrials = Math.max(0, STAGE_2_EXTRA_TRIALS - trialsUsed);
    return {
      isRateLimited: false,
      lockType: null,
      remainingAttempts: remainingTrials,
      resetSeconds: 0,
      stage: 2
    };
  }

  // In Stage 1
  return {
    isRateLimited: false,
    lockType: null,
    remainingAttempts: Math.max(0, STAGE_1_MAX - record.count),
    resetSeconds: 0,
    stage: 1
  };
}

/**
 * Records a failed login attempt for client IP
 */
export function recordFailedAttempt(ip) {
  const now = Date.now();
  let record = attemptStore.get(ip);

  // Prune expired records if store exceeds 1000
  if (attemptStore.size > 1000) {
    for (const [k, v] of attemptStore.entries()) {
      if (v.lockUntil && now > v.lockUntil && (v.stage === 3 || now - v.lastAttempt > INACTIVITY_EXPIRY_MS)) {
        attemptStore.delete(k);
      }
    }
  }

  if (!record || (record.stage === 3 && now >= record.lockUntil) || (now - record.lastAttempt > INACTIVITY_EXPIRY_MS)) {
    record = {
      count: 1,
      lockUntil: 0,
      lockType: null,
      stage: 1,
      lastAttempt: now
    };
    attemptStore.set(ip, record);
    return;
  }

  record.lastAttempt = now;
  record.count += 1;

  // Check if we hit 10 attempts (Stage 1 threshold)
  if (record.count >= STAGE_1_MAX && record.stage === 1) {
    record.stage = 2; // will transition to stage 2 trials after 30s lock
    record.lockType = "short";
    record.lockUntil = now + STAGE_1_LOCK_MS; // 30 seconds countdown
    return;
  }

  // Check if we are in Stage 2 trials and hit 13 attempts (10 + 3)
  if (record.stage === 2 && record.count >= STAGE_2_MAX) {
    record.stage = 3;
    record.lockType = "long";
    record.lockUntil = now + STAGE_2_LOCK_MS; // 15 minutes lockout
    return;
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
