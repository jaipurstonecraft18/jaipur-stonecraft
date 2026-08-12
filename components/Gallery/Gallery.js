import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./Gallery.module.css";

export default function Gallery({ images = [], aspect = "aspect45", columns = 3, altPrefix = "" }) {
  if (!images || images.length === 0) return null;

  const gridClass = `${styles.grid} ${styles[`cols${columns}`]}`;

  return (
    <div className={gridClass}>
      {images.map((src, idx) => (
        <ScrollReveal key={`${src}-${idx}`} animation="fade-up" delay={idx * 80}>
          <div className={`${styles.imageContainer} ${styles[aspect]}`}>
            <Image
              src={src}
              alt={altPrefix ? `${altPrefix} ${idx + 1}` : `Gallery Image ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className={styles.image}
              loading="lazy"
            />
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
