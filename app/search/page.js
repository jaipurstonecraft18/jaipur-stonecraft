import { Suspense } from "react";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import SearchInterface from "@/components/Search/SearchInterface";
import { getAllProducts, getAllMaterials, getAllCollections } from "@/lib/db";

export const metadata = {
  title: "Search & Catalog Filter — Jaipur Stonecraft",
  description: "Search Jaipur Stonecraft catalog by deity, material, collection, or architectural stone style.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/search",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function SearchPage() {
  const products = getAllProducts();
  const materials = getAllMaterials();
  const collections = getAllCollections();

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs items={[{ label: "Search & Filter Catalog" }]} />

        <SectionHeading
          eyebrow="Architectural & Sacred Catalog"
          heading="Search Stonecraft Designs"
          description="Explore our hand-carved stone art database by keyword, material, or collection. Filter through Makrana white marble sculptures, pink sandstone jalis, and bespoke architectural stonework."
          align="center"
          headingLevel="h1"
        />

        <Suspense fallback={<div>Loading search...</div>}>
          <SearchInterface
            initialProducts={products}
            materials={materials}
            collections={collections}
          />
        </Suspense>
      </Container>
    </Section>
  );
}
