import Link from "next/link";
import Image from "next/image";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  imageSrc,
  imageAlt,
  name,
  type,
  location,
  description,
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

  const defaultAlt = `${name} architectural stone installation executed by Jaipur Stonecraft`;

  return (
    <Link href={href} className={cardClassName} aria-label={`View project details for ${name}`}>
      <div className={imageContainerClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc || `https://placehold.co/1200x800/E8E4DF/1A1918?text=${encodeURIComponent(name)}`}
          alt={imageAlt || defaultAlt}
          className={styles.image}
          loading="lazy"
        />
        {(isFeatured || badgeText) && (
          <span className={styles.badge}>{badgeText || "Featured Case Study"}</span>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.metaRow}>
          {type && <span className={styles.type}>{type}</span>}
          {type && location && <span className={styles.dot}>•</span>}
          {location && <span className={styles.location}>{location}</span>}
        </div>
        <h3 className={titleClass}>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.linkRow}>
          <span>Explore Case Study</span>
          <span aria-hidden="true">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
