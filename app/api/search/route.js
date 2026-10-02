import { NextResponse } from "next/server";
import { performSmartSearch } from "@/lib/search/smart-search-engine";
import { checkEndpointRateLimit, getClientIp } from "@/lib/admin/rate-limiter.js";

// Rate limit: 60 search requests per minute per IP
const SEARCH_RATE_LIMIT = 60;
const SEARCH_WINDOW_MS = 60 * 1000;

export async function GET(request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkEndpointRateLimit("search", clientIp, SEARCH_RATE_LIMIT, SEARCH_WINDOW_MS);

  if (rateLimit.isRateLimited) {
    return NextResponse.json(
      { error: "Too many search requests. Please slow down." },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.resetSeconds) }
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") || "";
  const scope = searchParams.get("scope") || "all";
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "100", 10)), 100);

  // Bound search query length to 120 characters to avoid excessive CPU fuzzy processing
  const query = rawQuery.slice(0, 120);

  if (!query.trim()) {
    return NextResponse.json({
      products: [],
      categories: [],
      collections: [],
      projects: [],
      typoSuggestion: null,
      totalCount: 0,
    });
  }

  try {
    const result = await performSmartSearch(query, { scope, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[Search Route Error]:", error);
    return NextResponse.json({ error: "Failed to perform search" }, { status: 500 });
  }
}
