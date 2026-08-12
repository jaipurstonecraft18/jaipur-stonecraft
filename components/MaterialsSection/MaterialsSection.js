import Container from "@/components/Container/Container";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./MaterialsSection.module.css";

const materials = [
  {
    name: "Makrana White Marble",
    description: "Pure calcium carbonate white marble sourced directly from Makrana, legendary for its dense structure and translucent divine aura.",
  },
  {
    name: "Bansi & Dholpur Sandstone",
    description: "Rich pink and beige sandstones carved for heritage temple pillars, decorative jali screens, and exterior facade masonry.",
  },
  {
    name: "Engineered & Composite Stone",
    description: "Custom engineered marble and composite stone blocks specified for high-durability modern interior architectural fittings.",
  },
  {
    name: "Custom Regional Stone",
    description: "Specialized regional natural stones including Black Marble, Kota Stone, and custom quarried Rajasthan blocks.",
  },
];

export default function MaterialsSection() {
  return (
    <section className={styles.section} aria-label="Stone Materials Selection">
      <Container>
        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="SELECT MATERIALS"
            heading="The Stone Behind the Craft"
            description="We source high-durability blocks directly from historical quarries across Rajasthan, selecting only dense, unblemished stone for hand chiseling."
            align="center"
          />
        </ScrollReveal>

        <div className={styles.materialsGrid}>
          {materials.map((mat, idx) => (
            <ScrollReveal key={mat.name} animation="fade-up" delay={idx * 60}>
              <div className={styles.materialCard}>
                <h3 className={styles.matName}>{mat.name}</h3>
                <p className={styles.matDesc}>{mat.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal animation="fade-up" delay={240}>
          <div className={styles.ctaWrapper}>
            <PrimaryButton href="/marble" variant="bronze">
              Explore the Marble Hub &rarr;
            </PrimaryButton>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
