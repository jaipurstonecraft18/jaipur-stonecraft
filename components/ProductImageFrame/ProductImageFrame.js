import Image from "next/image";
import styles from "./ProductImageFrame.module.css";

/**
 * ProductImageFrame — Intelligent, Luxury Stonecraft Product Image Presentation Component
 *
 * Guarantees:
 * 1. ZERO CROPPING: Always renders the complete original artwork using object-fit: contain.
 * 2. Natural Proportions: Accommodates tall statues (aspect ~0.45 - 0.75), square jalis (~1.0),
 *    and panoramic wall murals / fountains (~1.33 - 1.8) without distortion or stretching.
 * 3. Premium Atelier Backdrop: Subtly textured warm neutral canvas (#F7F5F0 - #EFECE6) that
 *    highlights translucent Makrana white marble, dark black marble, and pink sandstone.
 * 4. High-Performance Next.js Image Optimization: Retains responsive `sizes`, `priority`,
 *    and lazy loading without breaking core web vitals.
 */
export default function ProductImageFrame({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 88,
  aspectRatio = "4 / 5",
  className = "",
  imageClassName = "",
  children,
  unoptimized = false,
  containerStyle = {},
  onClick,
  badge,
}) {
  return (
    <div
      className={`${styles.frame} ${className}`}
      style={{
        aspectRatio,
        ...containerStyle,
      }}
      onClick={onClick}
    >
      {/* Subtle interior vignette / warmth layer behind the image */}
      <div className={styles.canvasBackground} aria-hidden="true" />

      {/* Main product image container */}
      <div className={styles.imageWrapper}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          quality={quality}
          unoptimized={unoptimized}
          className={`${styles.containImage} ${imageClassName}`}
          loading={priority ? undefined : "lazy"}
        />
      </div>

      {badge && <div className={styles.badgeSlot}>{badge}</div>}
      {children}
    </div>
  );
}

