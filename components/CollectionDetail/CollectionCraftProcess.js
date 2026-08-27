import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CollectionDetail.module.css";

export default function CollectionCraftProcess({ processSteps = [], collectionName = "" }) {
  if (!processSteps || processSteps.length === 0) return null;

  return (
    <section className={styles.craftSection} aria-label="Masonic Carving Process">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionEyebrow} ${styles.craftEyebrow}`}>ATELIER CRAFTSMANSHIP</span>
            <h2 className={`${styles.sectionTitle} ${styles.craftTitle}`}>The Carving Process for {collectionName}</h2>
            <p className={`${styles.sectionDesc} ${styles.craftDesc}`}>
              Combining traditional Rajasthan hand-chiseling with modern masonic precision from raw block selection to final hand buffing.
            </p>
          </div>
        </ScrollReveal>

        <div className={styles.processGrid}>
          {processSteps.map((step, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 90}>
              <div className={styles.processStep}>
                <span className={styles.stepNum}>{String(idx + 1).padStart(2, "0")}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
