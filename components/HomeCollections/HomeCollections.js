import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getAllCollections } from "@/content/collections";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./HomeCollections.module.css";

export default async function HomeCollections() {
  const collectionsList = await getAllCollections();

  // 1. Hero Spotlight Collection: Sculptures & Statues
  const heroSpotlight = collectionsList.find((col) => col.slug === "sculptures-statues") || collectionsList[0];

  // 2. Two Featured Collections: Temples & Architectural Stonework, Wall Art & Reliefs
  const featuredTwo = collectionsList.filter(
    (col) => col.slug === "temples-architectural-stonework" || col.slug === "wall-art-reliefs"
  );

  // 3. Three Standard Collections: Fountains, Decorative Art, Custom & Bespoke
  const standardThree = collectionsList.filter(
    (col) =>
      col.slug !== heroSpotlight.slug &&
      !featuredTwo.some((f) => f.slug === col.slug)
  );

  return (
    <Section background="light" spacing="standard" className={styles.section}>
      <Container>
        {/* Section Heading */}
        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="OUR COLLECTIONS"
            heading="Crafted for Every Space. Carved for Every Story."
            description="Explore the range of stone artistry our atelier creates. Each collection is handcrafted from select, high-durability blocks."
            align="center"
          />
        </ScrollReveal>

        {/* 1. HERO SPOTLIGHT CARD (Asymmetric Row 1) */}
        {heroSpotlight && (
          <ScrollReveal animation="fade-up">
            <Link href={`/collections/${heroSpotlight.slug}`} className={styles.heroSpotlightCard}>
              <div className={styles.spotlightImageWrapper}>
                <Image
                  src={getImageVariantUrl(heroSpotlight.imageSrc, "display")}
                  alt={heroSpotlight.name}
                  fill
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.spotlightImage}
                  loading="lazy"
                />
              </div>

              <div className={styles.spotlightContent}>
                <div>
                  <span className="eyebrow" style={{ color: "var(--color-bronze)", marginBottom: "var(--spacing-xxs)" }}>
                    Featured Collection
                  </span>
                  <h3 className={styles.spotlightTitle}>{heroSpotlight.name}</h3>
                  <p className={styles.spotlightDesc}>{heroSpotlight.description}</p>

                  {/* Subcategories preview chips */}
                  {heroSpotlight.subcategories && heroSpotlight.subcategories.length > 0 && (
                    <div className={styles.subcatChips}>
                      {heroSpotlight.subcategories.slice(0, 4).map((sub) => (
                        <span key={sub.slug} className={styles.chip}>
                          {sub.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.spotlightLink}>
                  <span>Explore {heroSpotlight.name}</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </Link>
          </ScrollReveal>
        )}

        {/* 2. TWO-COLUMN FEATURED GRID (Row 2) */}
        {featuredTwo.length > 0 && (
          <div className={styles.twoColGrid}>
            {featuredTwo.map((col, idx) => (
              <ScrollReveal key={col.slug} animation="fade-up" delay={idx * 100}>
                <Link href={`/collections/${col.slug}`} className={styles.gridCard}>
                  <div className={styles.gridImageWrapper}>
                    <Image
                      src={getImageVariantUrl(col.imageSrc, "display")}
                      alt={col.name}
                      fill
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.gridImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.gridContent}>
                    <div>
                      <h3 className={styles.gridTitle}>{col.name}</h3>
                      <p className={styles.gridDesc}>{col.description}</p>
                    </div>
                    <span className={styles.gridLink}>
                      Browse Collection &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* 3. THREE-COLUMN STANDARD GRID (Row 3) */}
        {standardThree.length > 0 && (
          <div className={styles.threeColGrid}>
            {standardThree.map((col, idx) => (
              <ScrollReveal key={col.slug} animation="fade-up" delay={idx * 80}>
                <Link href={`/collections/${col.slug}`} className={styles.gridCard}>
                  <div className={styles.gridImageWrapper}>
                    <Image
                      src={getImageVariantUrl(col.imageSrc, "card")}
                      alt={col.name}
                      fill
                      quality={88}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={styles.gridImage}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.gridContent}>
                    <div>
                      <h3 className={styles.gridTitle}>{col.name}</h3>
                      <p className={styles.gridDesc}>{col.description}</p>
                    </div>
                    <span className={styles.gridLink}>
                      Browse Collection &rarr;
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
