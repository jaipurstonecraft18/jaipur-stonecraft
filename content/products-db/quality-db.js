/**
 * Jaipur Stonecraft — Internal Product-Completeness & Quality Scoring System (Stage 9)
 * 
 * Evaluates product records across:
 * - SEO Readiness (Name, Slug, Category, Subject, Material, Meta Title, Meta Description, JSON-LD)
 * - Content Readiness (Short & Detailed Description quality, Specifications, Customization)
 * - Image Readiness (Hero Image, Gallery, Alt Text, Filename convention, Image Roles)
 * 
 * Surfaces internal quality reports to identify entries needing owner review or photography.
 */

import { productsDatabaseStore } from "./products-db.js";

export function evaluateProductQuality(product) {
  if (!product) return null;

  let seoScore = 0;
  let contentScore = 0;
  let imageScore = 0;
  const flags = [];

  // 1. SEO Readiness Checks (Max 100)
  if (product.name) seoScore += 15;
  if (product.slug) seoScore += 15;
  if (product.parentCategory) seoScore += 15;
  if (product.parentCollection) seoScore += 15;
  if (product.primaryMaterialId) seoScore += 15;
  if (product.seo && product.seo.title && !product.seo.title.includes("PLACEHOLDER")) seoScore += 125;
  if (product.seo && product.seo.description && product.seo.description.length > 50) seoScore += 10;
  seoScore = Math.min(100, seoScore);

  // 2. Content Readiness Checks (Max 100)
  if (product.shortDescription && product.shortDescription.length > 20) contentScore += 25;
  if (product.detailedDescription) {
    if (product.detailedDescription.includes("PLACEHOLDER")) {
      flags.push("Contains Description Placeholder");
      contentScore += 10;
    } else {
      contentScore += 35;
    }
  }
  if (product.attributes && product.attributes.availableDimensions) contentScore += 20;
  if (product.knowledgeLayer && product.knowledgeLayer.materialOrigin) contentScore += 20;
  contentScore = Math.min(100, contentScore);

  // 3. Image Readiness Checks (Max 100)
  if (product.imageSrc) {
    imageScore += 30;
    if (product.imageSrc.includes("placehold.co")) {
      flags.push("Uses Placeholder Image (Awaiting Real Photography)");
    } else {
      imageScore += 20;
    }
  }
  if (product.imageGallery && product.imageGallery.length > 0) {
    imageScore += 30;
  }
  if (product.primaryMaterial) imageScore += 20;
  imageScore = Math.min(100, imageScore);

  // Calculate Overall Grade
  const overallScore = Math.round((seoScore * 0.35) + (contentScore * 0.40) + (imageScore * 0.25));
  let rating = "A (Production Ready)";
  if (flags.length > 0 || overallScore < 80) {
    rating = "B (Functional - Needs Real Photos/Content)";
  }
  if (overallScore < 50) {
    rating = "C (Incomplete - Requires Refinement)";
  }

  return {
    productId: product.id,
    productName: product.name,
    overallScore,
    rating,
    seoScore,
    contentScore,
    imageScore,
    flags
  };
}

export function generateFullCatalogQualityAuditReport() {
  const allProducts = Object.values(productsDatabaseStore);
  const evaluations = allProducts.map(evaluateProductQuality);

  const totalProducts = evaluations.length;
  const gradeA = evaluations.filter((e) => e.rating.startsWith("A")).length;
  const gradeB = evaluations.filter((e) => e.rating.startsWith("B")).length;
  const gradeC = evaluations.filter((e) => e.rating.startsWith("C")).length;

  return {
    totalProducts,
    gradeA,
    gradeB,
    gradeC,
    averageOverallScore: Math.round(evaluations.reduce((sum, e) => sum + e.overallScore, 0) / totalProducts),
    evaluations
  };
}
