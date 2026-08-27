import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CollectionDetail.module.css";

export default function CollectionMaterials({ materials = [], collectionName = "" }) {
  if (!materials || materials.length === 0) return null;

  return (
    <section className={styles.materialsSection} aria-label="Stone Block Palette">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>MATERIAL PALETTE</span>
            <h2 className={styles.sectionTitle}>Stones Selected for {collectionName}</h2>
            <p className={styles.sectionDesc}>
              Quarried from iconic stone beds across Rajasthan, every block is tested for grain density, weatherability, and masonic purity.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.materialsGrid}>
          {materials.map((mat, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 80}>
              <div className={styles.materialCard}>
                <div className={styles.materialHeader}>
                  <h3 className={styles.materialName}>{mat.name}</h3>
                  <span className={styles.materialOrigin}>{mat.origin}</span>
                </div>
                <p className={styles.materialDesc}>{mat.description}</p>
                <Link href={mat.href || "/marble"} className={styles.materialLink}>
                  <span>Material Guide</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
