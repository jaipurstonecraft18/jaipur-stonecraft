import Link from "next/link";
import Image from "next/image";
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
  const imageContainerClass = `${styles.imageContainer} ${
    isFeatured ? styles.featuredImageContainer : isSecondary ? styles.secondaryImageContainer : ""
  }`;
  const titleClass = `${styles.title} ${
    isFeatured ? styles.featuredTitle : isSecondary ? styles.secondaryTitle : ""
  }`;

  const defaultAlt = `Hand-carved ${name} in ${material || 'white marble'} sculpted in Jaipur atelier`;

  return (
    <Link href={href} className={cardClassName} aria-label={`View details for ${name}`}>
      <div className={imageContainerClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc || `https://placehold.co/800x1000/E8E4DF/1A1918?text=${encodeURIComponent(name)}`}
          alt={imageAlt || defaultAlt}
          className={styles.image}
          loading="lazy"
        />
        {(isFeatured || badgeText) && (
          <span className={styles.badge}>{badgeText || "Featured Design"}</span>
        )}
      </div>
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
