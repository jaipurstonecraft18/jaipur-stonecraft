/**
 * Jaipur Stonecraft — JSON-LD Structured Data Schema Generator
 * 
 * STRICT RULE: Never fabricate reviews, ratings, prices, or availability that do not exist.
 * Structured data accurately reflects Jaipur Stonecraft's bespoke craftsmanship and enquiry-based business model.
 */

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "HomeGoodsStore"],
    "@id": "https://jaipurstonecraft.com/#organization",
    "name": "Jaipur Stonecraft",
    "legalName": "Jaipur Stonecraft Atelier",
    "url": "https://jaipurstonecraft.com",
    "logo": "https://jaipurstonecraft.com/icon.png",
    "image": "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp",
    "description": "Premier Indian manufacturer and exporter of handcrafted Makrana white marble deity statues, home mandirs, temple architecture, lattice stone jalis, and custom architectural stonework based in Jaipur, Rajasthan.",
    "telephone": "+91 8690471802",
    "email": "Jaipurstonecraft18@gmail.com",
    "priceRange": "$$$$",
    "currenciesAccepted": "INR, USD, EUR, GBP, AED",
    "paymentAccepted": "Cash, Credit Card, Bank Wire Transfer",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "30, Industrial Area, Krisna Nagar a, Kartarpura, Gopal Pura Mode",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "postalCode": "302015",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "26.8924",
      "longitude": "75.7925"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/jaipur_stonecraft",
      "https://youtube.com/@jaipurstonecraft",
      "https://www.facebook.com/share/19eWRe3Nnb/",
      "https://pin.it/5bFC6rv7i"
    ]
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jaipurstonecraft.com/#website",
    "url": "https://jaipurstonecraft.com",
    "name": "Jaipur Stonecraft",
    "description": "Handcrafted marble sculptures, home mandirs, and architectural stonework from Jaipur, Rajasthan.",
    "publisher": {
      "@id": "https://jaipurstonecraft.com/#organization"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://jaipurstonecraft.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
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

export function generateLandingPageSchema({
  title,
  description,
  url,
  breadcrumbs = [],
  faqs = [],
  products = []
}) {
  const graph = [];

  // 1. BreadcrumbList
  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((b, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": b.name,
        "item": b.url
      }))
    });
  }

  // 2. CollectionPage entity
  const collectionEntity = {
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    "url": url,
    "name": title,
    "description": description,
    "isPartOf": {
      "@id": "https://jaipurstonecraft.com/#website"
    },
    "about": {
      "@type": "Thing",
      "name": title
    }
  };

  if (products && products.length > 0) {
    collectionEntity.mainEntity = {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((p, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": p.name,
        "url": `https://jaipurstonecraft.com/designs/${p.primaryCategorySlug || p.parentCategory}/${p.slug}`
      }))
    };
  }

  graph.push(collectionEntity);

  // 3. FAQPage entity
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      "mainEntity": faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
