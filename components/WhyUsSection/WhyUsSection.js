import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./WhyUsSection.module.css";

const pillars = [
  {
    number: "01 /",
    title: "Direct Atelier Workshop",
    text: "Carved entirely in our Jaipur workshop, guaranteeing manufacturer pricing and direct oversight without broker markups.",
  },
  {
    number: "02 /",
    title: "Generational Expertise",
    text: "Family stone-carving traditions passed down through generations, combining historical masonic sculpting with modern precision.",
  },
  {
    number: "03 /",
    title: "Bespoke Customization",
    text: "Capable of scaling any blueprint, CAD drawing, or hand sketch into solid stone with exact dimensional tolerances.",
  },
  {
    number: "04 /",
    title: "Uncompromised Quality Control",
    text: "Quarry-direct high-density stone selection, verifying zero structural fissures prior to chiseling.",
  },
  {
    number: "05 /",
    title: "Global Export Logistics",
    text: "Heavy heat-treated ISPM-15 wooden crates, shock-absorption wraps, and full international ocean freight clearance.",
  },
];

export default function WhyUsSection() {
  return (
    <Section background="light" spacing="standard" className={styles.section}>
      <Container>
        <div className={styles.grid}>
          {/* Left Column: Typographic Overview & CTA */}
          <ScrollReveal animation="fade-up" className={styles.leftCol}>
            <div>
              <span className="eyebrow">ATELIER STANDARDS</span>
              <h2 className={styles.heading}>Crafted in Jaipur. Created for the World.</h2>
            </div>
            <p className={styles.description}>
              We deliver global masonic capability with manufacturer pricing, backed by generations of family commitment to sacred and architectural stone artistry.
            </p>
            <div>
              <PrimaryButton href="/contact?type=custom" variant="bronze">
                Discuss Your Custom Project
              </PrimaryButton>
            </div>
          </ScrollReveal>

          {/* Right Column: 5 Typographic Numbered Pillars */}
          <div className={styles.rightCol}>
            {pillars.map((p, idx) => (
              <ScrollReveal key={p.title} animation="fade-up" delay={idx * 70}>
                <div className={styles.pillarRow}>
                  <div className={styles.pillarNum}>{p.number}</div>
                  <div className={styles.pillarContent}>
                    <h3 className={styles.pillarTitle}>{p.title}</h3>
                    <p className={styles.pillarText}>{p.text}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
