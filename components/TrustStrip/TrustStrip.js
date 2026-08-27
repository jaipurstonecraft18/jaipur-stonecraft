import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./TrustStrip.module.css";

const defaultIcons = [
  (
    <svg key="1" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.3">
      <path d="M12 21C12 21 8 16 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 16 12 21 12 21Z" />
      <path d="M12 21C12 21 5 18 3 13C2 10.5 3.5 8 6 8C8.5 8 11 10.5 12 13" />
      <path d="M12 21C12 21 19 18 21 13C22 10.5 20.5 8 18 8C15.5 8 13 10.5 12 13" />
      <circle cx="12" cy="18" r="1" fill="#B87B31" />
    </svg>
  ),
  (
    <svg key="2" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.3">
      <path d="M12 3L4 9V21H20V9L12 3Z" />
      <path d="M12 3V9" />
      <path d="M9 21V13H15V21" />
      <path d="M12 13A2 2 0 1 0 12 9A2 2 0 0 0 12 13Z" />
    </svg>
  ),
  (
    <svg key="3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.3">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.6 9H20.4" />
      <path d="M3.6 15H20.4" />
      <path d="M11.5 3C9 7 9 17 11.5 21" />
      <path d="M12.5 3C15 7 15 17 12.5 21" />
    </svg>
  ),
  (
    <svg key="4" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.3">
      <path d="M6 3L2 9L12 21L22 9L18 3H6Z" />
      <path d="M11 3L8 9L12 21L16 9L13 3" />
      <path d="M2 9H22" />
    </svg>
  )
];

const defaultAchievements = [
  { value: "3+", label: "Generations of Craft" },
  { value: "500+", label: "Master Artisans in Atelier" },
  { value: "25+", label: "Countries Shipped & Installed" },
  { value: "1000+", label: "Bespoke Commissions Delivered" }
];

export default function TrustStrip({ stats }) {
  const displayStats = Array.isArray(stats) && stats.length > 0 ? stats : defaultAchievements;

  return (
    <section id="trust-strip" className={styles.section} aria-label="Key Achievements">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.floatingCard}>
            {displayStats.map((item, idx) => (
              <div key={item.label || idx} className={styles.statCol}>
                <div className={styles.iconBox}>{defaultIcons[idx % defaultIcons.length]}</div>
                <div className={styles.textBox}>
                  <span className={styles.statNumber}>{item.value || item.number}</span>
                  <span className={styles.statLabel}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
