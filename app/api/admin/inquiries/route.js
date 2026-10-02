import { NextResponse } from "next/server";
import { query, getOne, execute, initDB } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { checkEndpointRateLimit, getClientIp } from "@/lib/admin/rate-limiter.js";

// Rate limit: 5 inquiries per 10 minutes per IP
const INQUIRY_RATE_LIMIT = 5;
const INQUIRY_WINDOW_MS = 10 * 60 * 1000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    let rows;
    if (status !== "all") {
      rows = await query("SELECT * FROM inquiries WHERE status = ? ORDER BY created_at DESC", [status]);
    } else {
      rows = await query("SELECT * FROM inquiries ORDER BY created_at DESC");
    }

    return NextResponse.json({ inquiries: rows, totalCount: rows.length });
  } catch (error) {
    console.error("[Admin Inquiries GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request) {
  // Public endpoint for submitting contact / quote / custom project inquiries
  const clientIp = getClientIp(request);
  const rateLimit = checkEndpointRateLimit("inquiries", clientIp, INQUIRY_RATE_LIMIT, INQUIRY_WINDOW_MS);

  if (rateLimit.isRateLimited) {
    const minutes = Math.ceil(rateLimit.resetSeconds / 60);
    return NextResponse.json(
      { error: `Too many submissions. Please wait ${minutes} minute(s) before sending another inquiry.` },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.resetSeconds) }
      }
    );
  }

  try {
    await initDB();
    const body = await request.json();
    const { name, email, phone, inquiryType, message, referenceImageUrl } = body;

    // Strict Input Validation & Length Bounds
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }
    if (name.trim().length > 150) {
      return NextResponse.json({ error: "Name must not exceed 150 characters." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (email.trim().length > 150 || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address (e.g. name@domain.com)." }, { status: 400 });
    }

    if (phone && (typeof phone !== "string" || phone.length > 40)) {
      return NextResponse.json({ error: "Phone number must not exceed 40 characters." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Inquiry message is required." }, { status: 400 });
    }
    if (message.trim().length > 3000) {
      return NextResponse.json({ error: "Message must not exceed 3000 characters." }, { status: 400 });
    }

    let cleanRefImage = "";
    if (referenceImageUrl && typeof referenceImageUrl === "string") {
      const trimmed = referenceImageUrl.trim();
      if (trimmed.length <= 500 && (trimmed.startsWith("/uploads/") || trimmed.startsWith("https://") || trimmed.startsWith("http://"))) {
        cleanRefImage = trimmed;
      }
    }

    const cleanInquiryType = (typeof inquiryType === "string" && inquiryType.trim().length <= 50) 
      ? inquiryType.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "") 
      : "custom";

    const timestamp = Date.now();
    const id = `INQ-${timestamp}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await execute(`
      INSERT INTO inquiries (id, name, email, phone, inquiry_type, message, reference_image_url, status, admin_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name.trim(),
      email.trim().toLowerCase(),
      phone ? phone.trim() : "",
      cleanInquiryType,
      message.trim(),
      cleanRefImage,
      "new",
      ""
    ]);

    return NextResponse.json({
      success: true,
      id,
      message: "Thank you! Your inquiry has been received. Our master atelier team will contact you shortly."
    });
  } catch (error) {
    console.error("[Inquiry Submission Error]:", error);
    return NextResponse.json({ error: "An unexpected error occurred while submitting your inquiry. Please try again." }, { status: 500 });
  }
}

export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 });
    }

    const existing = await getOne("SELECT * FROM inquiries WHERE id = ?", [id]);
    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }

    await execute(`
      UPDATE inquiries
      SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status || existing.status, adminNotes !== undefined ? adminNotes : existing.admin_notes, id]);

    return NextResponse.json({ success: true, message: `Updated inquiry ${id}` });
  } catch (error) {
    console.error("[Admin Inquiries PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}
