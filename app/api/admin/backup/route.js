/**
 * Jaipur Stonecraft — Admin Backup Management & Trigger API Endpoint
 * 
 * POST /api/admin/backup  => Triggers an on-demand database & image backup pipeline
 * GET  /api/admin/backup  => Lists existing backups and cloud sync status
 */

import { NextResponse } from "next/server";
import crypto from "crypto";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { runFullBackup, listLocalBackups } from "@/lib/backup/backup-engine";

function isAuthorizedCronOrAdmin(req) {
  if (isAuthorizedAdminRequest(req)) return true;

  const validSecret = (process.env.BACKUP_SECRET_KEY || process.env.ADMIN_SECRET_KEY || "").trim().replace(/^['"]|['"]$/g, "");
  if (!validSecret) return false;

  const expectedBuf = Buffer.from(validSecret);

  // Check x-backup-secret header
  const authHeader = req.headers.get("x-backup-secret");
  if (authHeader) {
    const headerBuf = Buffer.from(authHeader.trim());
    if (headerBuf.length === expectedBuf.length && crypto.timingSafeEqual(headerBuf, expectedBuf)) {
      return true;
    }
  }

  // Check Authorization: Bearer <secret>
  const bearerHeader = req.headers.get("authorization");
  if (bearerHeader && bearerHeader.startsWith("Bearer ")) {
    const token = bearerHeader.substring(7).trim();
    const tokenBuf = Buffer.from(token);
    if (tokenBuf.length === expectedBuf.length && crypto.timingSafeEqual(tokenBuf, expectedBuf)) {
      return true;
    }
  }

  return false;
}

export async function GET(req) {
  if (!isAuthorizedCronOrAdmin(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const backupList = listLocalBackups();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      backups: backupList
    });
  } catch (error) {
    console.error("[Backup API GET Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to list backups" }, { status: 500 });
  }
}

export async function POST(req) {
  if (!isAuthorizedCronOrAdmin(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const result = await runFullBackup();
    return NextResponse.json({
      success: true,
      message: "Backup completed successfully",
      result
    });
  } catch (error) {
    console.error("[Backup API POST Error]:", error);
    return NextResponse.json({ success: false, error: "Backup execution failed" }, { status: 500 });
  }
}
