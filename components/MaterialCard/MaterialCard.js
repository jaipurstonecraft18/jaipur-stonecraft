import Link from "next/link";
import Image from "next/image";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./MaterialCard.module.css";

export default function MaterialCard({
  name,
  description,
  imageSrc,
  imageAlt,
  href,
  variant = "standard",
  origin,
  badgeText,
}) {
  const isFeatured = variant === "featured";
  const isSecondary = variant === "secondary";

  const cardClassName = `${styles.card} ${
    isFeatured ? styles.featuredCard : isSecondary ? styles.secondaryCard : ""
  }`;
  const imageWrapperClass = `${styles.imageWrapper} ${
    isFeatured ? styles.featuredImageWrapper : isSecondary ? styles.secondaryImageWrapper : ""
  }`;
  const titleClass = `${styles.title} ${
    isFeatured ? styles.featuredTitle : isSecondary ? styles.secondaryTitle : ""
  }`;

  const defaultAlt = `Natural stone specimen of ${name} quarried in ${origin || "Rajasthan, India"}`;
  const fallbackImage = `https://placehold.co/800x500/E8E4DF/1A1918?text=${encodeURIComponent(name)}`;
  const optimizedSrc = getImageVariantUrl(imageSrc, "card") || fallbackImage;

  return (
    <Link href={href || "/marble"} className={cardClassName}>
      <div className={imageWrapperClass}>
        <Image
          src={optimizedSrc}
          alt={imageAlt || defaultAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.titleGroup}>
          {(badgeText || origin) && (
            <span className={styles.metaBadge}>{badgeText || origin}</span>
          )}
          <h3 className={titleClass}>{name}</h3>
          {description && <p className={styles.description}>{description}</p>}
        </div>

        <div className={styles.linkRow}>
          <span>Explore Material</span>
          <span aria-hidden="true">&rarr;</span>
        </div>
      </div>
    </Link>
  );
}
