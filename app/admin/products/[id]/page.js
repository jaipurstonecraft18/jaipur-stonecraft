import { notFound } from "next/navigation";
import { getOne } from "@/lib/db/client.js";
import { formatProductFromRow } from "@/lib/db/products.js";
import ProductStudio from "@/components/admin/ProductStudio/ProductStudio";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  let row = null;

  try {
    row = await getOne("SELECT * FROM products WHERE id = ? OR slug = ?", [id, id]);
  } catch (e) {
    console.error("[Admin Edit Product DB Error]:", e);
  }

  if (!row) {
    notFound();
  }

  const product = await formatProductFromRow(row);

  return <ProductStudio initialProduct={product} isNew={false} />;
}
