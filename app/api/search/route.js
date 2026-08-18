import { NextResponse } from "next/server";
import { queryProductsDB } from "@/lib/db/products.js";
import { categoriesData } from "@/content/categories.js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ products: [], categoryResults: [], totalCount: 0 });
  }

  // 1. Search category landings
  const categoryResults = [];
  const q = query.toLowerCase().trim();

  Object.values(categoriesData).forEach((cat) => {
    if (cat.name.toLowerCase().includes(q) || (cat.description || "").toLowerCase().includes(q)) {
      categoryResults.push({
        id: `cat-${cat.slug}`,
        title: `${cat.name} Statues`,
        type: "Category Landing",
        href: `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`,
      });
    }
  });

  // 2. Query MySQL products database
  const dbResult = await queryProductsDB({ query, pageSize: 6 });

  return NextResponse.json({
    products: dbResult.products,
    categoryResults,
    totalCount: dbResult.totalCount,
    isFallback: dbResult.isFallback,
    fallbackMessage: dbResult.fallbackMessage
  });
}
