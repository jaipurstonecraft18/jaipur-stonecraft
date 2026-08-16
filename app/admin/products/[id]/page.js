import { notFound } from "next/navigation";
import getDB from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import ProductStudio from "@/components/admin/ProductStudio/ProductStudio";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const db = getDB();

  const row = db.prepare("SELECT * FROM products WHERE id = ? OR slug = ?").get(id, id);

  if (!row) {
    notFound();
  }

  const product = formatProductFromRow(row);

  return <ProductStudio initialProduct={product} isNew={false} />;
}
