import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

const defaultIcons = [
  // 01. Respect for Material (Stone monolith / Gem / Material)
  (
    <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.25">
      <polygon points="12 2 2 8.5 12 15 22 8.5 12 2" />
      <polyline points="2 15.5 12 22 22 15.5" />
    </svg>
  ),
  // 02. Knowledge in Hands (Handcraft / Chisel tool)
  (
    <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.25">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  // 03. Honest Craft (Integrity badge / Authentic seal)
  (
    <svg key="3" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.25">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <circle cx="12" cy="12" r="2" fill="var(--color-bronze)" />
    </svg>
  ),
  // 04. Precision with Purpose (Compass / Geometry / Architectural grid)
  (
    <svg key="4" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.25">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  )
];

const defaultPrinciples = [
  {
    num: "01",
    title: "Respect for the Material",
    desc: "We work with authentic natural stones — Makrana marble, Bansi Paharpur pink sandstone, and Dholpur stone — honouring their natural character and timeless durability."
  },
  {
    num: "02",
    title: "Knowledge in the Hands",
    desc: "Skills passed through generations of manual chiseling, refined through continuous temple and sculpture practice."
  },
  {
    num: "03",
    title: "Honest Craft",
    desc: "Every statue, wall mural, and architectural piece is carved with care, authenticity, and attention to detail."
  },
  {
    num: "04",
    title: "Precision with Purpose",
    desc: "Traditional carving skill united with architectural care for sacred sanctuaries and contemporary spaces."
  }
];

export default function StoryValuesSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 04";
  const heading = data.heading || "What We Carry Forward";
  const values = Array.isArray(data.values) && data.values.length > 0 ? data.values : defaultPrinciples;

  return (
    <section id="chapter-04" className={styles.valuesSection} aria-label="Chapter 04: What We Carry Forward">
      <Container>
        {/* Centered Chapter Header */}
        <div className={styles.valuesHeader}>
          <ScrollReveal animation="fade-up">
            <span className={styles.chapterEyebrow}>{chapter}</span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={80}>
            <h2 className={styles.chapterHeading}>{heading}</h2>
          </ScrollReveal>
        </div>

        {/* 4 Editorial Columns / Rows */}
        <div className={styles.valuesGrid}>
          {values.map((val, idx) => (
            <ScrollReveal key={val.num || idx} animation="fade-up" delay={idx * 60}>
              <div className={styles.valueCol}>
                <div className={styles.valueIconWrap} aria-hidden="true">
                  {defaultIcons[idx % defaultIcons.length]}
                </div>
                <span className={styles.valueNum}>{val.num || `0${idx + 1}`}</span>
                <h3 className={styles.valueTitle}>{val.title}</h3>
                <p className={styles.valueDesc}>{val.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
