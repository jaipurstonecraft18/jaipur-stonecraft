import { redirect, notFound } from "next/navigation";
import { categoriesData } from "@/content/categories";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  const categorySlugs = Object.keys(categoriesData).map((slug) => ({ slug }));
  const products = await getAllProductsFromDB();
  const productSlugs = products.map((p) => ({ slug: p.slug }));
  return [...categorySlugs, ...productSlugs];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = categoriesData[slug];
  const product = await getProductFromDB(slug);

  if (category) {
    return { title: `${category.name} — Jaipur Stonecraft` };
  }
  if (product) {
    return { title: `${product.name} — Jaipur Stonecraft` };
  }
  return {};
}

export default async function LegacyProductRedirect({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const category = categoriesData[slug];
  if (category) {
    redirect(`/collections/${category.parentCollection}/${category.parentSubcategory}/${category.slug}`);
  }

  const product = await getProductFromDB(slug);
  if (product) {
    redirect(`/designs/${product.parentCategory}/${product.slug}`);
  }

  notFound();
}
