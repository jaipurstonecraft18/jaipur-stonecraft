/**
 * Jaipur Stonecraft — Product SEO Readiness & Content Quality Checker
 * 
 * Evaluates actionable quality indicators (✓, ⚠, ✗) without arbitrary percentage scores.
 * Identifies weak or missing fields with explicit human-understandable guidance.
 */

export function evaluateSeoReadiness(product = {}) {
  const name = (product.name || "").trim();
  const category = (product.parentCategory || product.parent_category || "").trim();
  const material = (product.primaryMaterialId || product.primary_material_id || "").trim();
  const shortDesc = (product.shortDescription || product.short_description || "").trim();
  const detailedDesc = (product.detailedDescription || product.detailed_description || "").trim();
  const imageSrc = (product.imageSrc || product.image_src || "").trim();
  const images = Array.isArray(product.images) ? product.images : (Array.isArray(product.imageGallery) ? product.imageGallery : []);
  
  const seo = typeof product.seo === "string" 
    ? safeJsonParse(product.seo, {}) 
    : (product.seo || {});

  const seoTitle = (seo.title || "").trim();
  const metaDesc = (seo.description || "").trim();

  const items = [];

  // 1. Product Name
  items.push({
    id: "product_name",
    label: "Product Name",
    status: name ? "ok" : "missing",
    message: name ? `"${name}"` : "Product name is required for indexing.",
    aiActionKey: null
  });

  // 2. Category Hierarchy
  items.push({
    id: "category",
    label: "Category Classification",
    status: category ? "ok" : "missing",
    message: category ? `Categorized under "${category}"` : "Parent category is missing.",
    aiActionKey: null
  });

  // 3. Primary Material
  items.push({
    id: "primary_material",
    label: "Primary Stone Material",
    status: material ? "ok" : "missing",
    message: material ? `Material set to "${material}"` : "Primary material identification missing.",
    aiActionKey: null
  });

  // 4. Product Images
  const hasImages = (imageSrc && !imageSrc.includes("placehold.co")) || images.length > 0;
  items.push({
    id: "product_images",
    label: "Product Images",
    status: hasImages ? "ok" : "missing",
    message: hasImages ? `${images.length + (imageSrc ? 1 : 0)} image(s) attached.` : "No product images attached.",
    aiActionKey: null
  });

  // 5. Primary Cover Image
  const hasPrimary = imageSrc && !imageSrc.includes("placehold.co");
  items.push({
    id: "primary_image",
    label: "Primary Cover Photo",
    status: hasPrimary ? "ok" : "warning",
    message: hasPrimary ? "Cover photo assigned." : "Primary cover photo using default placeholder.",
    aiActionKey: null
  });

  // 6. Short Description
  if (!shortDesc) {
    items.push({
      id: "short_description",
      label: "Short Description",
      status: "missing",
      message: "Missing short description for product cards and previews.",
      aiActionKey: "generate_short_description"
    });
  } else if (shortDesc.length < 25) {
    items.push({
      id: "short_description",
      label: "Short Description",
      status: "warning",
      message: "Short description is brief (< 25 characters).",
      aiActionKey: "enhance_short_description"
    });
  } else {
    items.push({
      id: "short_description",
      label: "Short Description",
      status: "ok",
      message: "Short description is present and descriptive.",
      aiActionKey: null
    });
  }

  // 7. Detailed Description
  if (!detailedDesc) {
    items.push({
      id: "detailed_description",
      label: "Detailed Description",
      status: "missing",
      message: "Missing detailed product & carving description.",
      aiActionKey: "generate_detailed_description"
    });
  } else if (detailedDesc.length < 80) {
    items.push({
      id: "detailed_description",
      label: "Detailed Description",
      status: "warning",
      message: "Detailed description is minimal (< 80 characters).",
      aiActionKey: "enhance_detailed_description"
    });
  } else {
    items.push({
      id: "detailed_description",
      label: "Detailed Description",
      status: "ok",
      message: "Detailed product copy is comprehensive.",
      aiActionKey: null
    });
  }

  // 8. SEO Title Tag
  if (!seoTitle) {
    items.push({
      id: "seo_title",
      label: "SEO Title Tag",
      status: "missing",
      message: "Missing HTML page title tag.",
      aiActionKey: "generate_seo"
    });
  } else if (seoTitle.length < 30 || seoTitle.length > 65) {
    items.push({
      id: "seo_title",
      label: "SEO Title Tag",
      status: "warning",
      message: `Title tag length (${seoTitle.length} chars) is outside optimal 30-65 range.`,
      aiActionKey: "optimize_seo_title"
    });
  } else {
    items.push({
      id: "seo_title",
      label: "SEO Title Tag",
      status: "ok",
      message: `Title tag optimal (${seoTitle.length} chars).`,
      aiActionKey: null
    });
  }

  // 9. Meta Description Tag
  if (!metaDesc) {
    items.push({
      id: "meta_description",
      label: "Meta Description Tag",
      status: "missing",
      message: "Missing HTML meta description tag.",
      aiActionKey: "generate_seo"
    });
  } else if (metaDesc.length < 70 || metaDesc.length > 165) {
    items.push({
      id: "meta_description",
      label: "Meta Description Tag",
      status: "warning",
      message: `Meta description length (${metaDesc.length} chars) outside optimal 70-165 range.`,
      aiActionKey: "optimize_meta_description"
    });
  } else {
    items.push({
      id: "meta_description",
      label: "Meta Description Tag",
      status: "ok",
      message: `Meta description optimal (${metaDesc.length} chars).`,
      aiActionKey: null
    });
  }

  // 10. Image Alt Texts
  const imagesWithoutAlt = images.filter(img => {
    const alt = typeof img === "object" ? img.altText || img.alt_text || img.alt : "";
    return !alt || alt.trim().length === 0;
  });

  if (images.length === 0) {
    items.push({
      id: "image_alt_texts",
      label: "Image Alt Texts",
      status: "warning",
      message: "No gallery images present to evaluate alt texts.",
      aiActionKey: null
    });
  } else if (imagesWithoutAlt.length > 0) {
    items.push({
      id: "image_alt_texts",
      label: "Image Alt Texts",
      status: "warning",
      message: `${imagesWithoutAlt.length} of ${images.length} image(s) missing descriptive alt text.`,
      aiActionKey: "generate_image_alts"
    });
  } else {
    items.push({
      id: "image_alt_texts",
      label: "Image Alt Texts",
      status: "ok",
      message: "All images have descriptive alt texts.",
      aiActionKey: null
    });
  }

  const okCount = items.filter(i => i.status === "ok").length;
  const warningCount = items.filter(i => i.status === "warning").length;
  const missingCount = items.filter(i => i.status === "missing").length;

  let overallStatus = "ready";
  if (missingCount > 0) overallStatus = "incomplete";
  else if (warningCount > 0) overallStatus = "needs_attention";

  return {
    overallStatus,
    okCount,
    warningCount,
    missingCount,
    items
  };
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
