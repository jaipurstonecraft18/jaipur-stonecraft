import ProductStudio from "@/components/admin/ProductStudio/ProductStudio";

export const dynamic = "force-dynamic";

export default function NewProductDraftPage() {
  return <ProductStudio isNew={true} />;
}
