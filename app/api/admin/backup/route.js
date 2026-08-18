/**
 * Jaipur Stonecraft — Admin Backup Management & Trigger API Endpoint
 * 
 * POST /api/admin/backup  => Triggers an on-demand database & image backup pipeline
 * GET  /api/admin/backup  => Lists existing backups and cloud sync status
 */

import { NextResponse } from "next/server";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth";
import { runFullBackup, listLocalBackups } from "@/lib/backup/backup-engine";

function isAuthorizedCronOrAdmin(req) {
  if (isAuthorizedAdminRequest(req)) return true;

  // Check BACKUP_SECRET_KEY or ADMIN_SECRET_KEY query param or header
  const url = new URL(req.url);
  const keyParam = url.searchParams.get("key");
  const authHeader = req.headers.get("x-backup-secret");

  const validSecret = process.env.BACKUP_SECRET_KEY || process.env.ADMIN_SECRET_KEY;
  if (validSecret && ((keyParam && keyParam === validSecret) || (authHeader && authHeader === validSecret))) {
    return true;
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
