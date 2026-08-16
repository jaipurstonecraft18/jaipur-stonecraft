import { Suspense } from "react";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import CollectionCard from "@/components/CollectionCard/CollectionCard";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import SearchInterface from "@/components/Search/SearchInterface";
import { queryProductsDB, materialsDB, collectionsStore } from "@/content/products-db";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const hasFilterParams = Boolean(params?.q || params?.collection || params?.material || params?.type || (params?.page && parseInt(params.page, 10) > 1));

  return {
    title: "Full Product Catalogue — Jaipur Stonecraft",
    description: "Browse the complete Jaipur Stonecraft catalogue of hand-carved white marble statues, sandstone jalis, architectural mandirs, and courtyard water features.",
    alternates: {
      canonical: "https://jaipurstonecraft.com/products",
    },
    robots: {
      index: !hasFilterParams,
      follow: true,
    },
  };
}

export default async function ProductsCataloguePage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const collection = params?.collection || "";
  const material = params?.material || "";
  const productType = params?.type || "";
  const page = parseInt(params?.page || "1", 10);

  // Paginated database query (16 items per page)
  const { products, totalCount, currentPage, totalPages } = queryProductsDB({
    query,
    collection,
    material,
    productType,
    page,
    pageSize: 16
  });

  const collections = Object.values(collectionsStore);

  return (
    <>
      <Section background="light" spacing="standard" className="page-offset">
        <Container>
          <Breadcrumbs items={[{ label: "Full Product Catalogue" }]} />

          <ScrollReveal animation="fade-up">
            <SectionHeading
              eyebrow="Comprehensive Atelier Archive"
              heading="Handcrafted Product Catalogue"
              description="Explore all 386 bespoke stonecraft creations. Filter by material origin, collection, or deity iconography, or search for custom architectural commissions."
              align="center"
              headingLevel="h1"
            />
          </ScrollReveal>

          {/* Interactive Database-Backed Filter & Search Component */}
          <Suspense fallback={<div>Loading filters...</div>}>
            <SearchInterface
              initialProducts={products}
              materials={materialsDB}
              collections={collections}
            />
          </Suspense>

          {/* Server-Rendered Crawlable Grid (SEO & Initial Load) */}
          <div style={{ marginTop: "var(--spacing-2xl)" }}>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "var(--spacing-md)", color: "var(--color-charcoal)" }}>
              All Catalogue Designs ({totalCount} Total)
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--spacing-xl)"
            }}>
              {products.map((product) => (
                <CollectionCard
                  key={product.id}
                  name={product.name}
                  description={`${product.primaryMaterial.shortName} • Hand-carved in Jaipur`}
                  imageSrc={product.imageSrc}
                  href={`/designs/${product.parentCategory}/${product.slug}`}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "var(--spacing-md)",
                marginTop: "var(--spacing-2xl)"
              }}>
                {currentPage > 1 && (
                  <a
                    href={`/products?page=${currentPage - 1}${collection ? `&collection=${collection}` : ""}${material ? `&material=${material}` : ""}${query ? `&q=${query}` : ""}`}
                    style={{
                      padding: "0.6rem 1.2rem",
                      border: "1px solid var(--color-bronze)",
                      color: "var(--color-charcoal)",
                      textDecoration: "none",
                      fontSize: "0.9rem"
                    }}
                  >
                    &larr; Previous Page
                  </a>
                )}

                <span style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages && (
                  <a
                    href={`/products?page=${currentPage + 1}${collection ? `&collection=${collection}` : ""}${material ? `&material=${material}` : ""}${query ? `&q=${query}` : ""}`}
                    style={{
                      padding: "0.6rem 1.2rem",
                      border: "1px solid var(--color-bronze)",
                      color: "var(--color-charcoal)",
                      textDecoration: "none",
                      fontSize: "0.9rem"
                    }}
                  >
                    Next Page &rarr;
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
