import { NextResponse } from "next/server";
import { executeSmartSearch } from "@/lib/search/smart-search.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";

export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const status = searchParams.get("status") || "all";
  const category = searchParams.get("category") || "";

  const results = executeSmartSearch({ query, status, category, limit: 30 });
  return NextResponse.json(results);
}
