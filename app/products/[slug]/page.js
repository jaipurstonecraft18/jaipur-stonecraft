import { redirect, notFound } from "next/navigation";
import { categoriesData } from "@/content/categories";

export async function generateStaticParams() {
  return Object.keys(categoriesData).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = categoriesData[slug];
  if (!category) return {};

  return {
    title: `${category.name} — Jaipur Stonecraft`,
  };
}

export default async function LegacyProductRedirect({ params }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const category = categoriesData[slug];

  if (!category) {
    notFound();
  }

  redirect(`/collections/${category.parentCollection}/${category.parentSubcategory}/${category.slug}`);
}
