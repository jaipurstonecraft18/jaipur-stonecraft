import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CollectionDetail.module.css";

export default function CollectionMetricsBar({ metrics = [] }) {
  if (!metrics || metrics.length === 0) return null;

  return (
    <section className={styles.metricsSection} aria-label="Collection Specifications">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.metricsGrid}>
            {metrics.map((item, idx) => (
              <div key={idx} className={styles.metricItem}>
                <span className={styles.metricLabel}>{item.label}</span>
                <span className={styles.metricValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
