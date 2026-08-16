/**
 * Jaipur Stonecraft — Data-Driven SEO Metadata Generator (Stage 6)
 * 
 * Provides natural, non-keyword-stuffed metadata for products, categories, collections, and hubs.
 */

const BASE_URL = "https://jaipurstonecraft.com";

export function generatePageMetadata({ title, description, path, ogImage, noindex = false }) {
  const canonicalUrl = `${BASE_URL}${path || ""}`;
  const defaultOgImage = `${BASE_URL}/images/og-image.jpg`;

  return {
    title: `${title} | Jaipur Stonecraft`,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${title} | Jaipur Stonecraft`,
      description: description,
      url: canonicalUrl,
      siteName: "Jaipur Stonecraft",
      type: "website",
      images: [
        {
          url: ogImage || defaultOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export function generateProductMetadata(product) {
  if (!product) return {};

  const title = `${product.name} — Hand-Carved Stone Art`;
  const description = product.shortDescription || `Hand-carved ${product.name} sculpted from solid natural stone by Jaipur Stonecraft artisans. Request custom sizing and quotes.`;
  const path = `/designs/${product.parentCategory}/${product.slug}`;

  return generatePageMetadata({
    title,
    description,
    path,
    ogImage: product.imageSrc
  });
}
