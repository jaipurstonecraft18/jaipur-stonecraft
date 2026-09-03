import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

const defaultIcons = [
  (
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <path d="M12 21C12 21 7 16 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 16 12 21 12 21Z" />
      <circle cx="12" cy="12" r="2" fill="var(--color-bronze)" />
    </svg>
  ),
  (
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  (
    <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  (
    <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18M15 3v18" />
    </svg>
  )
];

const defaultValuesList = [
  {
    num: "01",
    title: "Artisan Dignity",
    desc: "We support fair compensation, health security, and comfortable workspace conditions in our Jaipur studio."
  },
  {
    num: "02",
    title: "In-House Production",
    desc: "Every statue, wall mural, and architectural piece is carved entirely in our owned Jaipur workshop."
  },
  {
    num: "03",
    title: "Authentic Materials",
    desc: "We source authentic Makrana white marble, Bansi Paharpur pink sandstone, and Dholpur beige stone directly."
  },
  {
    num: "04",
    title: "Precision & Tolerance",
    desc: "We bridge ancient Shilpa Shastra proportions with modern 3D CAD modeling for accuracy and installation perfection."
  }
];

export default function StoryValuesSection({ data = {} }) {
  const eyebrow = data.eyebrow || "OUR VALUES";
  const heading = data.heading || "Principles Behind Every Chisel";
  const values = Array.isArray(data.values) && data.values.length > 0 ? data.values : defaultValuesList;

  return (
    <section className={styles.valuesSection} aria-label="Our Core Principles">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.valuesHeader}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.valuesHeading}>{heading}</h2>
            <div className={styles.ornamentDivider} aria-hidden="true">✦</div>
          </div>
        </ScrollReveal>

        {/* 4-Column Values Grid */}
        <div className={styles.valuesGrid}>
          {values.map((val, idx) => (
            <ScrollReveal key={val.num || idx} animation="fade-up" delay={idx * 60}>
              <div className={styles.valueCard}>
                <span className={styles.valueNum}>{val.num || `0${idx + 1}`}</span>
                <div className={styles.valueIcon}>{defaultIcons[idx % defaultIcons.length]}</div>
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
