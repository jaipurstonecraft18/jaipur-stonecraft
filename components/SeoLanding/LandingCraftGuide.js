import Container from "@/components/Container/Container";
import styles from "./LandingCraftGuide.module.css";

export default function LandingCraftGuide({
  eyebrow = "Material Integrity & Lineage",
  title = "The Art of Hand-Sculpting in Natural White Marble",
  description = "A sacred moorti is not merely a statue; it is an enduring devotional creation. At Jaipur Stonecraft, our artisans combine traditional sculptural knowledge with careful stone selection to carve statues of lasting beauty.",
  pillars = []
}) {
  return (
    <section className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>

        {pillars && pillars.length > 0 && (
          <div className={styles.cardsGrid}>
            {pillars.map((pillar, idx) => (
              <div key={idx} className={styles.card}>
                <span className={styles.cardNumber}>0{idx + 1}</span>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardText}>{pillar.text}</p>
                {pillar.highlights && pillar.highlights.length > 0 && (
                  <ul className={styles.cardList}>
                    {pillar.highlights.map((item, hIdx) => (
                      <li key={hIdx} className={styles.cardListItem}>
                        <span className={styles.bullet}>•</span> {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
