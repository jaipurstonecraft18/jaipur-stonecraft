import { NextResponse } from "next/server";
import { validateAdminCredentials, createSessionToken, isAuthorizedAdminRequest, COOKIE_NAME } from "@/lib/admin/auth.js";
import { checkRateLimit, recordFailedAttempt, resetRateLimit, getClientIp } from "@/lib/admin/rate-limiter.js";

export async function GET(request) {
  const isAuth = isAuthorizedAdminRequest(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request) {
  const clientIp = getClientIp(request);

  // 1. Check Rate Limit
  const rateLimitStatus = checkRateLimit(clientIp);
  if (rateLimitStatus.isRateLimited) {
    if (rateLimitStatus.lockType === "short") {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts (10 failed). Please wait ${rateLimitStatus.resetSeconds} second(s) before trying again.`,
          retryAfter: rateLimitStatus.resetSeconds,
          lockType: "short"
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitStatus.resetSeconds) }
        }
      );
    } else {
      const minutesLeft = Math.ceil(rateLimitStatus.resetSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          error: `All trials failed. Account locked for security. Please try again in ${minutesLeft} minute(s).`,
          retryAfter: rateLimitStatus.resetSeconds,
          lockType: "long"
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitStatus.resetSeconds) }
        }
      );
    }
  }

  try {
    const body = await request.json();
    const { password } = body;

    // 2. Validate Credentials
    if (!validateAdminCredentials(password)) {
      recordFailedAttempt(clientIp);
      const updatedStatus = checkRateLimit(clientIp);

      if (updatedStatus.isRateLimited) {
        if (updatedStatus.lockType === "short") {
          return NextResponse.json(
            {
              success: false,
              error: `10 failed attempts reached. Please wait ${updatedStatus.resetSeconds} second(s) before trying again.`,
              retryAfter: updatedStatus.resetSeconds,
              lockType: "short",
              remainingAttempts: 0
            },
            { status: 429, headers: { "Retry-After": String(updatedStatus.resetSeconds) } }
          );
        } else {
          const minutesLeft = Math.ceil(updatedStatus.resetSeconds / 60);
          return NextResponse.json(
            {
              success: false,
              error: `All 3 trials failed. Account locked for security. Please try again in ${minutesLeft} minute(s).`,
              retryAfter: updatedStatus.resetSeconds,
              lockType: "long",
              remainingAttempts: 0
            },
            { status: 429, headers: { "Retry-After": String(updatedStatus.resetSeconds) } }
          );
        }
      }

      let errorMsg = "Invalid admin password.";
      if (updatedStatus.stage === 1) {
        errorMsg = `Invalid admin password. ${updatedStatus.remainingAttempts} attempt(s) remaining before a 30-second cooldown.`;
      } else if (updatedStatus.stage === 2) {
        errorMsg = `Invalid admin password. ${updatedStatus.remainingAttempts} trial(s) remaining before a 15-minute security lockout.`;
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMsg,
          remainingAttempts: updatedStatus.remainingAttempts,
          stage: updatedStatus.stage
        },
        { status: 401 }
      );
    }

    // 3. Reset rate limit on successful authentication
    resetRateLimit(clientIp);

    const token = createSessionToken();
    const response = NextResponse.json({ success: true, message: "Authenticated successfully" });

    // 4. Set secure HTTP-only cookie
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    const isConfigErr = error?.message?.includes("CRITICAL SECURITY CONFIGURATION ERROR");
    if (isConfigErr) {
      console.error("[CRITICAL AUTH ERROR]:", error.message);
      return NextResponse.json(
        { success: false, error: "Server authentication error: Security environment variables missing." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/"
  });
  return response;
}
