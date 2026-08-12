import Link from "next/link";
import Image from "next/image";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ imageSrc, name, type, location, href }) {
  return (
    <Link href={href} className={styles.card} aria-label={`View project details for ${name}`}>
      <div className={styles.imageContainer}>
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.metaRow}>
          {type && <span className={styles.type}>{type}</span>}
          {type && location && <span className={styles.dot}>•</span>}
          {location && <span className={styles.location}>{location}</span>}
        </div>
        <h3 className={styles.title}>{name}</h3>
      </div>
    </Link>
  );
}
