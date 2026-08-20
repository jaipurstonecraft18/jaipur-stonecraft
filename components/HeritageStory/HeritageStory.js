import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./HeritageStory.module.css";

export default function HeritageStory({ heroImage }) {
  const imgSrc = heroImage?.url || "/images/collections/custom.png";
  const imgAlt = heroImage?.alt || "Sculpted marble portrait bust in Jaipur Stonecraft atelier";

  return (
    <Section background="light" spacing="standard" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {/* Left Column: Large Editorial Image */}
          <ScrollReveal animation="fade-up" className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={styles.image}
                loading="lazy"
              />
            </div>
            <div className={styles.accentBadge}>
              <div className={styles.badgeNumber}>Family</div>
              <div className={styles.badgeText}>Generational Lineage in Stone</div>
            </div>
          </ScrollReveal>

          {/* Right Column: Editorial Narrative */}
          <ScrollReveal animation="fade-up" delay={150} className={styles.textCol}>
            <div>
              <span className="eyebrow">THE JAIPUR STONECRAFT STORY</span>
              <h2 className={styles.heading}>Generational Heritage. Modern Precision.</h2>
            </div>

            <div className={styles.paragraphs}>
              <p>
                Jaipur Stonecraft is a modern brand built upon generations of family stone-carving lineage in Rajasthan. For decades, master carvers in our family lineage have chiseled sacred idols, royal court reliefs, and intricate temple architecture across northern India.
              </p>
              <p>
                Operating directly from our atelier in Jaipur, we pair historical hand-chiseling methods with modern architectural CAD drawings. This synthesis allows us to deliver museum-grade marble sculptures and structural masonry for private estates, public sacred shrines, and art collectors worldwide.
              </p>
            </div>

            <div className={styles.ctaWrapper}>
              <PrimaryButton href="/our-story" variant="bronze">
                Discover Our Story
              </PrimaryButton>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
