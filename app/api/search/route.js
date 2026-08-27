import { NextResponse } from "next/server";
import { performSmartSearch } from "@/lib/search/smart-search-engine";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const scope = searchParams.get("scope") || "all";
  const limit = parseInt(searchParams.get("limit") || "100", 10);

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

  const result = await performSmartSearch(query, { scope, limit });

  return NextResponse.json(result);
}
