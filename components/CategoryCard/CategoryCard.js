import Link from "next/link";
import styles from "./CategoryCard.module.css";

export default function CategoryCard({
  name,
  description,
  imageSrc,
  imageAlt,
  href,
  featured = false,
}) {
  const cardClassName = `${styles.card} ${featured ? styles.featuredCard : ""}`;
  const imageWrapperClass = `${styles.imageWrapper} ${featured ? styles.featuredImageWrapper : ""}`;
  const contentClass = `${styles.content} ${featured ? styles.featuredContent : ""}`;
  const titleClass = `${styles.title} ${featured ? styles.featuredTitle : ""}`;
  const descriptionClass = `${styles.description} ${featured ? styles.featuredDescription : ""}`;

  const defaultAlt = `Hand-carved white marble ${name} sculpture created by master artisans in Jaipur`;

  return (
    <Link href={href} className={cardClassName}>
      {/* 1. Card Image */}
      <div className={imageWrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc || `https://placehold.co/800x500/E8E4DF/1A1918?text=${encodeURIComponent(name)}`}
          alt={imageAlt || defaultAlt}
          className={styles.image}
          loading="lazy"
        />
      </div>

      {/* 2. Card Content (Name -> Description -> Link) */}
      <div className={contentClass}>
        <div className={styles.titleGroup}>
          {featured && <span className={styles.featuredBadge}>Featured Collection</span>}
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
