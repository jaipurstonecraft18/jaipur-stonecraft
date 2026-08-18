import Image from "next/image";
import Container from "@/components/Container/Container";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CraftProcess.module.css";

const steps = [
  {
    number: "01 /",
    title: "Select & Quarry",
    description: "Inspecting raw Makrana white marble, Bansi pink sandstone, and natural stone blocks directly at Rajasthan quarries for mineral uniformity and zero structural flaws.",
  },
  {
    number: "02 /",
    title: "Shape & Proportion",
    description: "Grid-mapping dimensional ratios using traditional Shilpa Shastra iconography guidelines and modern architectural CAD blueprints.",
  },
  {
    number: "03 /",
    title: "Chisel & Carve",
    description: "Master craftsmen spend hundreds of hours hand-chiseling intricate deity facial expressions, flowing robes, and geometric lattice jali screens.",
  },
  {
    number: "04 /",
    title: "Polish & Detail",
    description: "Progressive hand polishing using natural emery powders and water baths, producing honed matte or deep mirror-reflecting luster.",
  },
];

export default function CraftProcess() {
  return (
    <section className={styles.section} aria-label="Our Craftsmanship Process">
      <Container>
        {/* Section Heading */}
        <ScrollReveal animation="fade-up">
          <div className={styles.headingWrapper}>
            <span className="eyebrow" style={{ color: "var(--color-bronze)" }}>
              THE CRAFT
            </span>
            <h2 className={styles.heading}>The Chisel & The Legacy</h2>
            <p className={styles.subHeading}>
              Every sculpture and architectural element undergoes a rigorous, time-tested carving journey inside our Jaipur workshop.
            </p>
          </div>
        </ScrollReveal>

        {/* Grid: Typographic Timeline + Workshop Visual */}
        <div className={styles.grid}>
          {/* Left Column: Typographic Process Timeline */}
          <div className={styles.stepsContainer}>
            {steps.map((step, idx) => (
              <ScrollReveal key={step.title} animation="fade-up" delay={idx * 100}>
                <div className={styles.stepItem}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div className={styles.stepContent}>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Right Column: Workshop Image */}
          <ScrollReveal animation="fade-up" delay={200} className={styles.workshopCol}>
            <div className={styles.workshopImageWrapper}>
              <Image
                src="/images/craftsmanship/artisan-hands.png"
                alt="Artisan hands chiseling white marble details in Jaipur workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.workshopImage}
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* CTA Button */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className={styles.ctaRow}>
            <PrimaryButton href="/craftsmanship" variant="bronze">
              Explore Our Craft
            </PrimaryButton>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
