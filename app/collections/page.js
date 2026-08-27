import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getAllCollections } from "@/content/collections";
import styles from "@/components/CollectionsOverview/CollectionsOverview.module.css";

export const metadata = {
  title: "Bespoke Stonecraft Collections — Jaipur Stonecraft Atelier",
  description: "Explore the 6 main stonecraft collections carved in white marble, sandstone & limestone by master sculptors in Jaipur, India.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/collections",
  },
  openGraph: {
    title: "Bespoke Stonecraft Collections — Jaipur Stonecraft Atelier",
    description: "Explore the 6 main stonecraft collections carved in white marble, sandstone & limestone by master sculptors in Jaipur, India.",
    url: "https://jaipurstonecraft.com/collections",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://jaipurstonecraft.com/images/collections/hero-sculptures-group.webp",
        width: 1200,
        height: 630,
        alt: "Jaipur Stonecraft Atelier bespoke white marble sculptures and architectural stonework",
      },
    ],
  },
};

export default async function CollectionsPage() {
  const allCollectionsList = await getAllCollections();
  
  // Create quick slug map for reliable collection access
  const colMap = {};
  allCollectionsList.forEach((c) => {
    colMap[c.slug] = c;
  });

  const spotlight = colMap["sculptures-statues"] || allCollectionsList[0];
  const majorOne = colMap["wall-art-reliefs"] || allCollectionsList[1];
  const majorTwo = colMap["temples-architectural-stonework"] || allCollectionsList[2];
  
  const trioOne = colMap["fountains-water-features"] || allCollectionsList[3];
  const trioTwo = colMap["decorative-stone-art"] || allCollectionsList[4];
  const trioThree = colMap["custom-bespoke-creations"] || allCollectionsList[5];

  return (
    <div className={styles.pageWrapper}>
      {/* 1. ELEGANT INTRO SECTION */}
      <section className={styles.introSection}>
        <Container>
          <div className={styles.introContainer}>
            <div className={styles.breadcrumbWrapper}>
              <Breadcrumbs items={[{ label: "Collections" }]} />
            </div>

            <ScrollReveal animation="fade-up">
              <span className={styles.eyebrow}>CURATED ATELIER PORTFOLIO</span>
              <h1 className={styles.heading}>The Stonecraft Gallery</h1>
              <p className={styles.description}>
                Every creation originates from hand-selected raw stone blocks in Jaipur. Explore our six core collections spanning sacred deity statuary, high-relief wall murals, architectural temple masonry, and bespoke client commissions.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* 2. EDITORIAL COLLECTIONS SHOWCASE */}
      <section className={styles.collectionsSection}>
        <Container>
          {/* SECTION HEADER 1: FLAGSHIP SPOTLIGHT */}
          <ScrollReveal animation="fade-up">
            <div className={styles.sectionDivider}>
              <h2 className={styles.sectionTitle}>Flagship Collection</h2>
              <div className={styles.sectionLine} />
            </div>
          </ScrollReveal>

          {/* FEATURE 1: SPOTLIGHT HERO (Sculptures & Statues) */}
          {spotlight && (
            <ScrollReveal animation="fade-up">
              <div className={styles.spotlightCard}>
                <Link
                  href={`/collections/${spotlight.slug}`}
                  className={styles.overlayCardLink}
                  aria-label={`Explore ${spotlight.name} Collection`}
                />
                <div className={styles.spotlightImageWrapper}>
                  <Image
                    src={spotlight.imageSrc || "/images/collections/hero-sculptures-group.jpg"}
                    alt={spotlight.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className={styles.spotlightImage}
                    priority
                  />
                </div>

                <div className={styles.spotlightContent}>
                  <span className={styles.badge}>Devotional & Fine Art</span>
                  <h3 className={styles.collectionTitle}>{spotlight.name}</h3>
                  <p className={styles.collectionDesc}>{spotlight.description}</p>

                  {spotlight.subcategories && spotlight.subcategories.length > 0 && (
                    <>
                      <span className={styles.subcatHeader}>Explore Sub-Collections:</span>
                      <div className={styles.pillsContainer}>
                        {spotlight.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/collections/${spotlight.slug}/${sub.slug}`}
                            className={styles.pill}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  )}

                  <Link href={`/collections/${spotlight.slug}`} className={styles.primaryLink}>
                    <span>View Full {spotlight.name} Collection</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          )}

          {/* SECTION HEADER 2: ARCHITECTURAL & WALL ART */}
          <ScrollReveal animation="fade-up">
            <div className={styles.sectionDivider} style={{ marginTop: "1rem" }}>
              <h2 className={styles.sectionTitle}>Architectural & Wall Art</h2>
              <div className={styles.sectionLine} />
            </div>
          </ScrollReveal>

          {/* FEATURE 2: 2-COLUMN ASYMMETRIC GRID */}
          <div className={styles.twoColGrid}>
            {majorOne && (
              <ScrollReveal animation="fade-up">
                <div className={styles.featureCard}>
                  <Link
                    href={`/collections/${majorOne.slug}`}
                    className={styles.overlayCardLink}
                    aria-label={`Explore ${majorOne.name} Collection`}
                  />
                  <div className={styles.featureImageWrapper}>
                    <Image
                      src={majorOne.imageSrc || "/images/collections/wall-art-relief.jpg"}
                      alt={majorOne.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.featureImage}
                    />
                  </div>
                  <div className={styles.featureContent}>
                    <span className={styles.badge} style={{ fontSize: "0.68rem" }}>High-Relief Murals</span>
                    <h3 className={styles.featureTitle}>{majorOne.name}</h3>
                    <p className={styles.featureDesc}>{majorOne.description}</p>

                    {majorOne.subcategories && (
                      <div className={styles.pillsContainer} style={{ marginBottom: "1.25rem" }}>
                        {majorOne.subcategories.slice(0, 3).map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/collections/${majorOne.slug}/${sub.slug}`}
                            className={styles.pill}
                            style={{ fontSize: "0.76rem" }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    <Link href={`/collections/${majorOne.slug}`} className={styles.secondaryLink}>
                      <span>Explore Wall Art & Reliefs</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {majorTwo && (
              <ScrollReveal animation="fade-up" delay={150}>
                <div className={styles.featureCard}>
                  <Link
                    href={`/collections/${majorTwo.slug}`}
                    className={styles.overlayCardLink}
                    aria-label={`Explore ${majorTwo.name} Collection`}
                  />
                  <div className={styles.featureImageWrapper}>
                    <Image
                      src={majorTwo.imageSrc || "/images/collections/temples-architectural.jpg"}
                      alt={majorTwo.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={styles.featureImage}
                    />
                  </div>
                  <div className={styles.featureContent}>
                    <span className={styles.badge} style={{ fontSize: "0.68rem" }}>Sanctuary & Masonry</span>
                    <h3 className={styles.featureTitle}>{majorTwo.name}</h3>
                    <p className={styles.featureDesc}>{majorTwo.description}</p>

                    {majorTwo.subcategories && (
                      <div className={styles.pillsContainer} style={{ marginBottom: "1.25rem" }}>
                        {majorTwo.subcategories.slice(0, 3).map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/collections/${majorTwo.slug}/${sub.slug}`}
                            className={styles.pill}
                            style={{ fontSize: "0.76rem" }}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}

                    <Link href={`/collections/${majorTwo.slug}`} className={styles.secondaryLink}>
                      <span>Explore Temple Architecture</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* SECTION HEADER 3: WATER, ACCENTS & CUSTOM WORK */}
          <ScrollReveal animation="fade-up">
            <div className={styles.sectionDivider}>
              <h2 className={styles.sectionTitle}>Water Features, Décor & Bespoke Work</h2>
              <div className={styles.sectionLine} />
            </div>
          </ScrollReveal>

          {/* FEATURE 3: 3-COLUMN TRIO GRID */}
          <div className={styles.threeColGrid}>
            {trioOne && (
              <ScrollReveal animation="fade-up">
                <div className={styles.trioCard}>
                  <Link
                    href={`/collections/${trioOne.slug}`}
                    className={styles.overlayCardLink}
                    aria-label={`Explore ${trioOne.name} Collection`}
                  />
                  <div className={styles.trioImageWrapper}>
                    <Image
                      src={trioOne.imageSrc || "/images/collections/garden.png"}
                      alt={trioOne.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className={styles.trioImage}
                    />
                  </div>
                  <div className={styles.trioContent}>
                    <h3 className={styles.trioTitle}>{trioOne.name}</h3>
                    <p className={styles.trioDesc}>{trioOne.description}</p>
                    <Link href={`/collections/${trioOne.slug}`} className={styles.secondaryLink}>
                      <span>Explore Fountains</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {trioTwo && (
              <ScrollReveal animation="fade-up" delay={120}>
                <div className={styles.trioCard}>
                  <Link
                    href={`/collections/${trioTwo.slug}`}
                    className={styles.overlayCardLink}
                    aria-label={`Explore ${trioTwo.name} Collection`}
                  />
                  <div className={styles.trioImageWrapper}>
                    <Image
                      src={trioTwo.imageSrc || "/images/collections/luxury.png"}
                      alt={trioTwo.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className={styles.trioImage}
                    />
                  </div>
                  <div className={styles.trioContent}>
                    <h3 className={styles.trioTitle}>{trioTwo.name}</h3>
                    <p className={styles.trioDesc}>{trioTwo.description}</p>
                    <Link href={`/collections/${trioTwo.slug}`} className={styles.secondaryLink}>
                      <span>Explore Stone Décor</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {trioThree && (
              <ScrollReveal animation="fade-up" delay={240}>
                <div className={`${styles.trioCard} ${styles.bespokeCard}`}>
                  <Link
                    href="/contact?type=custom"
                    className={styles.overlayCardLink}
                    aria-label="Commission Custom Work"
                  />
                  <div className={styles.trioImageWrapper}>
                    <Image
                      src={trioThree.imageSrc || "/images/collections/custom.png"}
                      alt={trioThree.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className={styles.trioImage}
                    />
                  </div>
                  <div className={styles.trioContent}>
                    <span className={styles.bespokeBadge}>Bespoke Studio</span>
                    <h3 className={styles.trioTitle}>{trioThree.name}</h3>
                    <p className={styles.trioDesc}>{trioThree.description}</p>
                    <Link href="/contact?type=custom" className={`${styles.secondaryLink} ${styles.bespokeLink}`}>
                      <span>Commission Custom Work</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </Container>
      </section>

      {/* 3. CLOSING TRANSITION SECTION */}
      <section className={styles.bespokeCTASection}>
        <Container>
          <div className={styles.ctaBox}>
            <ScrollReveal animation="fade-up">
              <span className={styles.ctaEyebrow}>TAILORED MASONRY & ARTISTRY</span>
              <h2 className={styles.ctaHeading}>Have a Custom Architectural Vision?</h2>
              <p className={styles.ctaDesc}>
                Whether you possess a hand sketch, architect&apos;s CAD drawing, or photo reference, our Jaipur atelier guides your project from block selection to global site installation.
              </p>
              <div className={styles.ctaButtonGroup}>
                <Link href="/contact?type=custom" className={styles.goldButton}>
                  <span>Discuss a Bespoke Commission</span>
                  <span>&rarr;</span>
                </Link>
                <Link href="/craftsmanship" className={styles.outlineButton}>
                  <span>Learn About Our Craftsmanship</span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </div>
  );
}
