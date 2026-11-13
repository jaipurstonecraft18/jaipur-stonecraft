import Link from "next/link";
import Container from "@/components/Container/Container";
import styles from "./LandingInternalLinks.module.css";

export default function LandingInternalLinks({
  eyebrow = "Connected Atelier Architecture",
  title = "Explore Sacred Sculptures & Architectural Stonework",
  groups = []
}) {
  if (!groups || groups.length === 0) return null;

  return (
    <section className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>

        <div className={styles.linksGrid}>
          {groups.map((group, gIdx) => (
            <div key={gIdx} className={styles.linkGroup}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.list}>
                {group.links.map((link, lIdx) => (
                  <li key={lIdx} className={styles.linkItem}>
                    <Link href={link.href} className={styles.anchor}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
