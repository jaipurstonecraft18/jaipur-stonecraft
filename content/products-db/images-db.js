/**
 * Jaipur Stonecraft — Structured Image Data Model & Performance Store (Stage 7)
 * 
 * Implements Section 17 Image Roles: hero, front, side, detail, scale_reference, craftsmanship_process, installation, thumbnail.
 * Defines descriptive filename conventions and non-keyword-stuffed alt text rules.
 */

export const ImageRoleEnum = {
  HERO: "hero",
  FRONT: "front",
  SIDE: "side",
  DETAIL: "detail",
  SCALE_REFERENCE: "scale_reference",
  CRAFTSMANSHIP_PROCESS: "craftsmanship_process",
  INSTALLATION: "installation",
  THUMBNAIL: "thumbnail"
};

export function createStructuredImageRecord({ id, productId, role, filename, src, altText, caption, width = 800, height = 600, isPrimary = false }) {
  return {
    id,
    productId,
    role,
    filename: filename || `${productId}-${role}.jpg`,
    src: src || `https://placehold.co/${width}x${height}/E8E4DF/1A1918?text=${encodeURIComponent(altText)}`,
    altText,
    caption: caption || altText,
    width,
    height,
    format: "image/webp",
    isPrimary
  };
}

export function buildProductImageSet(product) {
  const primaryMaterialName = product.primaryMaterial ? product.primaryMaterial.shortName : "White Marble";

  const heroImage = createStructuredImageRecord({
    id: `img-${product.slug}-hero`,
    productId: product.slug,
    role: ImageRoleEnum.HERO,
    filename: `${product.slug}-${primaryMaterialName.toLowerCase().replace(/\s+/g, '-')}-jaipur-atelier.jpg`,
    src: product.imageSrc,
    altText: `${primaryMaterialName} ${product.name} hand-carved in Jaipur atelier`,
    caption: `${product.name} sculpted from solid ${primaryMaterialName}`,
    width: 1200,
    height: 900,
    isPrimary: true
  });

  const galleryImages = [
    createStructuredImageRecord({
      id: `img-${product.slug}-front`,
      productId: product.slug,
      role: ImageRoleEnum.FRONT,
      filename: `${product.slug}-front-view-jaipur.jpg`,
      altText: `Front view of ${product.name} showing facial chiseling and pedestal detail`,
      width: 800,
      height: 600
    }),
    createStructuredImageRecord({
      id: `img-${product.slug}-detail`,
      productId: product.slug,
      role: ImageRoleEnum.DETAIL,
      filename: `${product.slug}-masonic-chiseling-detail.jpg`,
      altText: `Detailed masonic chiseling on ${product.name}`,
      width: 800,
      height: 600
    }),
    createStructuredImageRecord({
      id: `img-${product.slug}-scale`,
      productId: product.slug,
      role: ImageRoleEnum.SCALE_REFERENCE,
      filename: `${product.slug}-scale-reference-architecture.jpg`,
      altText: `Architectural scale reference for ${product.name}`,
      width: 800,
      height: 600
    })
  ];

  return {
    heroImage,
    galleryImages,
    allImages: [heroImage, ...galleryImages]
  };
}
