import { NextResponse } from "next/server";
import { query, getOne, execute, initDB } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

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
    return NextResponse.json({ error: error.message || "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(request) {
  // Public endpoint for submitting contact / quote / custom project inquiries
  try {
    await initDB();
    const body = await request.json();
    const { name, email, phone, inquiryType, message, referenceImageUrl } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const timestamp = Date.now();
    const id = `INQ-${timestamp}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await execute(`
      INSERT INTO inquiries (id, name, email, phone, inquiry_type, message, reference_image_url, status, admin_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name.trim(),
      email.trim(),
      phone || "",
      inquiryType || "custom",
      message.trim(),
      referenceImageUrl || "",
      "new",
      ""
    ]);

    return NextResponse.json({
      success: true,
      id,
      message: "Thank you! Your inquiry has been received. Our master atelier team will contact you shortly."
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to submit inquiry" }, { status: 500 });
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
    return NextResponse.json({ error: error.message || "Failed to update inquiry" }, { status: 500 });
  }
}
