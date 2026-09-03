import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

const defaultIcons = [
  (
    <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    </svg>
  ),
  (
    <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  (
    <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  (
    <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  )
];

const defaultStatsList = [
  { value: "3+", label: "Generations of Stone Carving Heritage" },
  { value: "500+", label: "Skilled Artisans Associated Across Rajasthan" },
  { value: "25+", label: "Countries Our Sculptures Have Reached" },
  { value: "1000+", label: "Custom Sculptures & Architectural Projects Delivered" }
];

export default function StoryTransitionDark({ data = {} }) {
  const stats = Array.isArray(data.stats) && data.stats.length > 0 ? data.stats : defaultStatsList;

  return (
    <section className={styles.darkTransitionSection} aria-label="Brand Heritage Statistics">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.statsBar}>
            {stats.map((stat, idx) => (
              <div key={stat.value || idx} className={styles.statCol}>
                <div className={styles.statIcon}>{defaultIcons[idx % defaultIcons.length]}</div>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                {idx < stats.length - 1 && <div className={styles.statDivider} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
