import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CapabilitiesSection.module.css";

const capabilities = [
  {
    title: "Sacred Sculpture",
    description: "Devotional deity murtis, temple statues, divine figures, and portrait busts chiseled strictly to iconographic proportions.",
    items: ["Deity Statues", "Ganesh & Shiva Murtis", "Jain Tirthankaras", "Portrait Busts"],
  },
  {
    title: "Architectural Masonry",
    description: "Structural pillars, carved arches, shikhara domes, and open-work jali screens engineered for heritage and contemporary buildings.",
    items: ["Temple Pillars", "Shikhara Domes", "Carved Arches", "Intricate Jali Screens"],
  },
  {
    title: "Art & Reliefs",
    description: "Flat-panel stone murals, temple wall reliefs, decorative friezes, and high-relief carving for interior and exterior walls.",
    items: ["Temple Wall Murals", "Carved Wall Reliefs", "Spiritual Friezes", "3D Carved Panels"],
  },
  {
    title: "Décor & Objects",
    description: "Bespoke stone furniture, hand-carved lotus basins, tiered fountains, and luxury stone objects for residential and hospitality spaces.",
    items: ["Tiered Fountains", "Lotus Basins", "Stone Planters", "Custom Furniture"],
  },
];

export default function CapabilitiesSection() {
  return (
    <Section background="light" spacing="standard" className={styles.section}>
      <Container>
        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="WHAT WE CREATE"
            heading="Beyond the Statue."
            description="From single sacred deity sculptures to massive temple domes, wall murals, and custom stone décor, our atelier shapes natural stone for every scale."
            align="center"
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {capabilities.map((cap, idx) => (
            <ScrollReveal key={cap.title} animation="fade-up" delay={idx * 80}>
              <div className={styles.categoryBlock}>
                <h3 className={styles.catTitle}>{cap.title}</h3>
                <p className={styles.catDesc}>{cap.description}</p>
                <ul className={styles.itemList}>
                  {cap.items.map((item) => (
                    <li key={item} className={styles.itemChip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
