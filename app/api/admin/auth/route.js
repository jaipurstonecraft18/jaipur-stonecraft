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
    const minutesLeft = Math.ceil(rateLimitStatus.resetSeconds / 60);
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed login attempts. Account locked for security. Please try again in ${minutesLeft} minutes.`
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimitStatus.resetSeconds) }
      }
    );
  }

  try {
    const body = await request.json();
    const { password } = body;

    // 2. Validate Credentials
    if (!validateAdminCredentials(password)) {
      recordFailedAttempt(clientIp);
      const updatedStatus = checkRateLimit(clientIp);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid admin password",
          remainingAttempts: updatedStatus.remainingAttempts
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
