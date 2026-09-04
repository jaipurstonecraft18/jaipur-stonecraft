import Link from "next/link";
import Image from "next/image";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./CollectionCard.module.css";

export default function CollectionCard({ imageSrc, imageAlt, name, description, href }) {
  const defaultAlt = `Bespoke ${name} handcrafted by master stone artisans in Jaipur`;
  const optimizedSrc = getImageVariantUrl(imageSrc, "card") || imageSrc;

  return (
    <Link href={href} className={styles.card} aria-label={`Explore our ${name} collection`}>
      <div className={styles.imageContainer}>
        <Image
          src={optimizedSrc}
          alt={imageAlt || defaultAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        {description && <p className={styles.desc}>{description}</p>}
        <span className={styles.cta} aria-hidden="true">
          Explore Collection &nbsp;&rarr;
        </span>
      </div>
    </Link>
  );
}
