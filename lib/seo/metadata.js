/**
 * Jaipur Stonecraft — Data-Driven SEO Metadata Generator (Stage 6)
 * 
 * Provides natural, non-keyword-stuffed metadata for products, categories, collections, and hubs.
 */

const BASE_URL = "https://jaipurstonecraft.com";

export function generatePageMetadata({ title, description, path, ogImage, noindex = false }) {
  const canonicalUrl = `${BASE_URL}${path || ""}`;
  const defaultOgImage = `${BASE_URL}/images/og-image.jpg`;
  const finalTitle = (title || "").includes("Jaipur Stonecraft") ? title : `${title} | Jaipur Stonecraft`;

  return {
    title: finalTitle,
    description: description,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: finalTitle,

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

function safeJson(val, fallback = {}) {
  if (!val) return fallback;
  if (typeof val === "object") return val;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export function generateProductMetadata(product) {
  if (!product) return {};

  const seoObj = safeJson(product.seo, {});

  const title = (seoObj.title || seoObj.seoTitle || "").trim() || `${product.name} — Hand-Carved Stone Art`;
  const description = (seoObj.description || seoObj.metaDescription || "").trim() || product.shortDescription || `Hand-carved ${product.name} sculpted from solid natural stone by Jaipur Stonecraft artisans. Request custom sizing and quotes.`;
  const path = `/designs/${product.parentCategory}/${product.slug}`;
  const noindex = seoObj.indexable === false;

  return generatePageMetadata({
    title,
    description,
    path,
    ogImage: product.imageSrc,
    noindex
  });
}

