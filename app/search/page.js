import { redirect } from "next/navigation";

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(params).toString();
  redirect(`/products${queryString ? `?${queryString}` : ""}`);
}
