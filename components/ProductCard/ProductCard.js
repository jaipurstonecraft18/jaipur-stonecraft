import Link from "next/link";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import ProductImageFrame from "@/components/ProductImageFrame/ProductImageFrame";
import styles from "./ProductCard.module.css";

export default function ProductCard({
  imageSrc,
  imageAlt,
  name,
  category,
  material,
  href,
  featured = false,
  variant,
  badgeText,
}) {
  const isFeatured = variant === "featured" || featured;
  const isSecondary = variant === "secondary";

  const cardClassName = `${styles.card} ${
    isFeatured ? styles.featuredCard : isSecondary ? styles.secondaryCard : ""
  }`;
  const titleClass = `${styles.title} ${
    isFeatured ? styles.featuredTitle : isSecondary ? styles.secondaryTitle : ""
  }`;

  const defaultAlt = `Hand-carved ${name} in ${material || 'white marble'} sculpted in Jaipur atelier`;
  const targetVariant = "display";
  const optimizedImageSrc = getImageVariantUrl(imageSrc, targetVariant) || `https://placehold.co/800x1000/E8E4DF/1A1918?text=${encodeURIComponent(name)}`;

  return (
    <Link href={href} className={cardClassName} aria-label={`View details for ${name}`}>
      <ProductImageFrame
        src={optimizedImageSrc}
        alt={imageAlt || defaultAlt}
        aspectRatio="4 / 5"
        unoptimized={Boolean(optimizedImageSrc?.includes("placehold.co"))}
        sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        quality={88}
        className={styles.imageFrame}
        badge={(isFeatured || badgeText) ? (
          <span className={styles.badge}>{badgeText || "Featured Design"}</span>
        ) : null}
      />
      <div className={styles.content}>
        <h3 className={titleClass}>{name}</h3>
        <div className={styles.meta}>
          {category && <span className={styles.category}>{category}</span>}
          {category && material && <span className={styles.dot}>•</span>}
          {material && <span className={styles.material}>{material}</span>}
        </div>
      </div>
    </Link>
  );
}
