import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import styles from "./CollectionDetail.module.css";

export default function CollectionFeaturedArtworks({ artworks = [], collectionName = "" }) {
  if (!artworks || artworks.length === 0) return null;

  return (
    <section className={styles.artworksSection} aria-label="Curated Masterworks">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>CURATED MASTERWORKS</span>
            <h2 className={styles.sectionTitle}>Featured {collectionName} Creations</h2>
            <p className={styles.sectionDesc}>
              A selection of representative hand-carved stone art, custom commissions, and architectural projects.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.artworksGrid}>
          {artworks.map((item, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 70}>
              <div className={styles.artworkCard}>
                <div className={styles.artworkImageWrapper}>
                  <Image
                    src={getImageVariantUrl(item.imageSrc || "/images/collections/hero-sculptures-group.webp", "card")}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={styles.artworkImage}
                  />
                </div>
                <div className={styles.artworkContent}>
                  <h3 className={styles.artworkTitle}>{item.title}</h3>
                  <span className={styles.artworkMeta}>{item.material || "Natural Stone"} &bull; {item.type || "Masterwork"}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
