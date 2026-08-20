import Image from "next/image";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./Gallery.module.css";

export default function Gallery({ images = [], aspect = "aspect45", columns = 3, altPrefix = "" }) {
  if (!images || images.length === 0) return null;

  const gridClass = `${styles.grid} ${styles[`cols${columns}`]}`;

  return (
    <div className={gridClass}>
      {images.map((imgItem, idx) => {
        const rawSrc = typeof imgItem === "string" ? imgItem : imgItem?.src || imgItem?.url || "";
        const imgSrc = getImageVariantUrl(rawSrc, "display") || rawSrc;
        const imgAlt = (typeof imgItem === "object" && (imgItem?.altText || imgItem?.alt_text || imgItem?.alt)) 
          ? (imgItem.altText || imgItem.alt_text || imgItem.alt) 
          : (altPrefix ? `${altPrefix} view ${idx + 1}` : `Gallery Image ${idx + 1}`);

        if (!imgSrc) return null;

        return (
          <ScrollReveal key={`${imgSrc}-${idx}`} animation="fade-up" delay={idx * 80}>
            <div className={`${styles.imageContainer} ${styles[aspect]}`}>
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={styles.image}
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
