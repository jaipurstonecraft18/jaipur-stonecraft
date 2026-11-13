import Container from "@/components/Container/Container";
import styles from "./LandingSizingGuide.module.css";

export default function LandingSizingGuide({
  eyebrow = "Practical Specifications",
  title = "Sizing, Placement & Sanctuary Engineering",
  description = "Selecting the appropriate statue scale depends on sanctuary dimensions, altar ceiling clearance, and daily darshan perspective.",
  tiers = [
    {
      tag: "Home Mandir",
      height: "9″ to 21″",
      placement: "Apartment & Villa Shrines",
      details: "Ideal for indoor home mandirs. Hand-chiseled facial features remain sharp even at intimate scales. Fits within standard wooden or marble ghar-mandirs.",
      specs: "Weight: 8kg – 35kg • Base: Compact single block • Abhishek: Daily water/milk compliant"
    },
    {
      tag: "Grand Residence",
      height: "24″ to 42″",
      placement: "Dedicated Puja Rooms & Lobbies",
      details: "Monumental focal piece for large prayer halls or architectural foyers. Allows multi-tiered jewelry, detailed garment folds, and elaborate lotus pedestals.",
      specs: "Weight: 50kg – 180kg • Base: Integrated Choki • Abhishek: Full ceremonial compliant"
    },
    {
      tag: "Temple Sanctuary",
      height: "48″ to 84″+",
      placement: "Public Temples & Cultural Trusts",
      details: "Life-sized or larger sacred idols sculpted in accordance with temple trust sthapana protocols. Monolithic single-block quarrying ensures spiritual and structural longevity.",
      specs: "Weight: 250kg – 1,200kg+ • Base: Custom engineered plinth • Rigging & dry-fit verified"
    }
  ],
  logisticsTitle = "International Packaging & Transportation",
  logisticsText = "Jaipur Stonecraft prepares orders for delivery across India and internationally in accordance with applicable shipping requirements. Our team is available to assist with packaging and transportation arrangements for your statue.",
  logisticsPoints = [
    "International packaging available for orders worldwide",
    "Careful preparation taking applicable shipping requirements into account",
    "Attention given to protecting sculptures during transportation",
    "Contact our atelier to discuss shipping arrangements for your specific order"
  ]
}) {
  return (
    <section className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>

        <div className={styles.tiersGrid}>
          {tiers.map((tier, idx) => (
            <div key={idx} className={styles.tierCard}>
              <span className={styles.tierTag}>{tier.tag}</span>
              <div className={styles.tierHeight}>{tier.height}</div>
              <h3 className={styles.tierPlacement}>{tier.placement}</h3>
              <p className={styles.tierDetails}>{tier.details}</p>
              {tier.specs && <div className={styles.specsBox}>{tier.specs}</div>}
            </div>
          ))}
        </div>

        <div className={styles.logisticsCard}>
          <div>
            <h3 className={styles.logisticsTitle}>{logisticsTitle}</h3>
            <p className={styles.logisticsText}>{logisticsText}</p>
          </div>
          <div>
            <ul className={styles.logisticsList}>
              {logisticsPoints.map((point, pIdx) => (
                <li key={pIdx} className={styles.logisticsItem}>
                  <span className={styles.checkIcon}>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
