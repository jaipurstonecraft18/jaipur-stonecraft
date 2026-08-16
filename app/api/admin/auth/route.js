import { NextResponse } from "next/server";
import { validateAdminCredentials, createSessionToken, isAuthorizedAdminRequest, COOKIE_NAME } from "@/lib/admin/auth.js";

export async function GET(request) {
  const isAuth = isAuthorizedAdminRequest(request);
  return NextResponse.json({ authenticated: isAuth });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!validateAdminCredentials(password)) {
      return NextResponse.json(
        { success: false, error: "Invalid admin password" },
        { status: 401 }
      );
    }

    const token = createSessionToken();
    const response = NextResponse.json({ success: true, message: "Authenticated successfully" });

    // Set secure HTTP-only cookie
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
