import Link from "next/link";
import Image from "next/image";
import styles from "./ProductCard.module.css";

export default function ProductCard({ imageSrc, name, category, material, href }) {
  return (
    <Link href={href} className={styles.card} aria-label={`View details for ${name}`}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <div className={styles.meta}>
          {category && <span className={styles.category}>{category}</span>}
          {category && material && <span className={styles.dot}>•</span>}
          {material && <span className={styles.material}>{material}</span>}
        </div>
      </div>
    </Link>
  );
}
