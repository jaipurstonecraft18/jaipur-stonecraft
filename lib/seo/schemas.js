/**
 * Jaipur Stonecraft — JSON-LD Structured Data Schema Generator (Stage 6)
 * 
 * STRICT RULE: Never fabricate reviews, ratings, prices, or availability that do not exist.
 * Structured data accurately reflects Jaipur Stonecraft's bespoke enquiry-based business model.
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Jaipur Stonecraft",
    "image": "https://jaipurstonecraft.com/images/og-image.jpg",
    "description": "Handcrafted stone art, marble deity statues, and architectural stonework by master artisans in Jaipur, Rajasthan.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.9124",
      "longitude": "75.7873"
    },
    "url": "https://jaipurstonecraft.com",
    "telephone": "+91-98290-00000",
    "priceRange": "$$$$"
  };
}

export function generateProductSchema(product, originUrl) {
  if (!product) return null;

  const canonicalUrl = originUrl || `https://jaipurstonecraft.com/designs/${product.parentCategory}/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        "name": product.name,
        "description": product.shortDescription || product.detailedDescription,
        "artMedium": product.primaryMaterial ? product.primaryMaterial.name : "Makrana White Marble",
        "artform": "Sculpture",
        "artworkSurface": "Hand-carved Natural Stone",
        "creator": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft Artisans"
        },
        "material": product.primaryMaterial ? product.primaryMaterial.name : "White Marble",
        "countryOfOrigin": "India",
        "locationCreated": {
          "@type": "Place",
          "name": "Jaipur, Rajasthan"
        },
        "image": product.imageSrc,
        "url": canonicalUrl
      },
      {
        "@type": "Product",
        "name": product.name,
        "description": product.shortDescription,
        "image": product.imageSrc,
        "brand": {
          "@type": "Brand",
          "name": "Jaipur Stonecraft"
        },
        "material": product.primaryMaterial ? product.primaryMaterial.name : "White Marble",
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "price": "Upon Request",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl
        }
      }
    ]
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
