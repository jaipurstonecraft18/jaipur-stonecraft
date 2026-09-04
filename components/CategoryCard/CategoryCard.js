import Link from "next/link";
import Image from "next/image";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({
  name,
  description,
  imageSrc,
  imageAlt,
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
  const imageWrapperClass = `${styles.imageWrapper} ${
    isFeatured ? styles.featuredImageWrapper : isSecondary ? styles.secondaryImageWrapper : ""
  }`;
  const contentClass = `${styles.content} ${
    isFeatured ? styles.featuredContent : isSecondary ? styles.secondaryContent : ""
  }`;
  const titleClass = `${styles.title} ${
    isFeatured ? styles.featuredTitle : isSecondary ? styles.secondaryTitle : ""
  }`;
  const descriptionClass = `${styles.description} ${
    isFeatured ? styles.featuredDescription : isSecondary ? styles.secondaryDescription : ""
  }`;

  const defaultAlt = `Hand-carved white marble ${name} sculpture created by master artisans in Jaipur`;
  const targetVariant = isFeatured ? "display" : "card";
  const optimizedSrc = (imageSrc ? getImageVariantUrl(imageSrc, targetVariant) : null) || "/images/collections/hero-sculptures-group.webp";

  return (
    <Link href={href} className={cardClassName} aria-label={`Explore ${name} designs`}>
      {/* 1. Card Image */}
      <div className={imageWrapperClass}>
        <Image
          src={optimizedSrc}
          alt={imageAlt || defaultAlt}
          fill
          unoptimized={Boolean(optimizedSrc?.includes("placehold.co"))}
          sizes={isFeatured ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className={styles.image}
          loading="lazy"
        />
      </div>

      {/* 2. Card Content (Name -> Description -> Link) */}
      <div className={contentClass}>
        <div className={styles.titleGroup}>
          {(isFeatured || badgeText) && (
            <span className={styles.featuredBadge}>{badgeText || "Featured Category"}</span>
          )}
          <h3 className={titleClass}>{name}</h3>
          {description && <p className={descriptionClass}>{description}</p>}
        </div>

        <div className={styles.linkRow}>
          <span>Browse Designs</span>
          <span aria-hidden="true">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
