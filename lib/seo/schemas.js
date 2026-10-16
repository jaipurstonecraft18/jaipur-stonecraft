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
    "telephone": "+91 9664388920",
    "priceRange": "$$$$"
  };
}

export function generateProductSchema(product, originUrl) {
  if (!product) return null;

  const canonicalUrl = originUrl || `https://jaipurstonecraft.com/designs/${product.parentCategory}/${product.slug}`;
  const materialName = product.primaryMaterial?.name || product.attributes?.stoneVariety || "Natural Stone";

  const offersObj = {
    "@type": "Offer",
    "url": canonicalUrl,
    "priceCurrency": "INR",
    "availability": product.isCustomOnly ? "https://schema.org/PreOrder" : "https://schema.org/MadeToOrder",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Jaipur Stonecraft",
      "url": "https://jaipurstonecraft.com"
    }
  };

  if (product.price && Number(product.price) > 0) {
    offersObj.price = String(product.price);
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VisualArtwork",
        "name": product.name,
        "description": product.shortDescription || product.detailedDescription,
        "artMedium": materialName,
        "artform": "Sculpture",
        "artworkSurface": "Hand-carved Natural Stone",
        "creator": {
          "@type": "Organization",
          "name": "Jaipur Stonecraft Artisans"
        },
        "material": materialName,
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
        "description": product.shortDescription || product.detailedDescription,
        "image": product.imageSrc,
        "sku": product.sku || product.slug,
        "brand": {
          "@type": "Brand",
          "name": "Jaipur Stonecraft"
        },
        "material": materialName,
        "offers": offersObj
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
