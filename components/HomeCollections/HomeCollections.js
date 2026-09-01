import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./HomeCollections.module.css";

export default function HomeCollections({ collections }) {
  const colMap = {};
  if (Array.isArray(collections)) {
    collections.forEach((c) => {
      colMap[c.slug] = c;
    });
  }

  const spotlight = colMap["sculptures-statues"] || collections?.[0] || {};
  const wallArt = colMap["wall-art-reliefs"] || collections?.[1] || {};
  const temples = colMap["temples-architectural-stonework"] || collections?.[2] || {};
  const fountains = colMap["fountains-water-features"] || collections?.[3] || {};
  const decor = colMap["decorative-stone-art"] || collections?.[4] || {};
  const custom = colMap["custom-bespoke-creations"] || collections?.[5] || {};

  const spotlightImg = spotlight.imageSrc || "/images/collections/hero-sculptures-group.webp";
  const wallArtImg = wallArt.imageSrc || "/images/collections/wall-art-relief.webp";
  const templesImg = temples.imageSrc || "/images/collections/temples-architectural.webp";
  const fountainsImg = fountains.imageSrc || "/images/collections/garden.webp";
  const decorImg = decor.imageSrc || "/images/collections/luxury.webp";
  const customImg = custom.imageSrc || "/images/collections/custom.webp";

  const spotlightTitle = spotlight.name || "Sculptures & Statues";
  const wallArtTitle = wallArt.name || "Wall Art & Reliefs";
  const templesTitle = temples.name || "Temples & Architectural Stonework";
  const fountainsTitle = fountains.name || "Fountains & Water Features";
  const decorTitle = decor.name || "Decorative Stone Art";
  const customTitle = custom.name || "Custom & Bespoke Creations";

  const spotlightDesc = spotlight.description || "Hand-carved deity statues, spiritual figures, human portraits, and animal sculptures.";
  const wallArtDesc = wallArt.description || "Spiritual relief panels, cultural heritage murals, decorative stone wall art, and custom fusion reliefs.";
  const templesDesc = temples.description || "Bespoke marble temples, temple architecture, carved pillars, jali screens, and stone structural elements.";
  const fountainsDesc = fountains.description || "Hand-carved fountains, sculptural water features, cascading stone walls, and poolside waterfalls.";
  const decorDesc = decor.description || "Interior marble accents, carved stone vases, pendants, tabletop collectibles, and outdoor garden art.";
  const customDesc = custom.description || "Commissioned deity statues, memorial portal backs, and full-scale custom architectural projects.";

  return (
    <section className={styles.section} aria-label="Our Collections">
      <Container>
        {/* Section Header Introduction */}
        <ScrollReveal animation="fade-up">
          <div className={styles.headerWrapper}>
            <span className={styles.eyebrow}>OUR COLLECTIONS</span>
            <h2 className={styles.heading}>
              Crafted for Every Space. <br className={styles.desktopBreak} />
              Carved for Every Story.
            </h2>

            {/* Gold Floral Line Ornament */}
            <div className={styles.ornamentLine} aria-hidden="true">
              <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
                <line x1="0" y1="8" x2="46" y2="8" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.45" />
                <circle cx="60" cy="8" r="3" fill="#B87B31" />
                <path d="M60 2 Q63 8 60 14 Q57 8 60 2Z" fill="#B87B31" fillOpacity="0.5" />
                <line x1="74" y1="8" x2="120" y2="8" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.45" />
              </svg>
            </div>

            <p className={styles.description}>
              Explore the range of stone artistry our atelier creates. <br className={styles.desktopBreak} />
              Each collection is handcrafted from select, high-durability blocks.
            </p>
          </div>
        </ScrollReveal>

        {/* 1. FEATURED HERO COLLECTION PANEL (Top Big Card) */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className={styles.featuredCard}>
            <Link
              href={`/collections/${spotlight.slug || "sculptures-statues"}`}
              className={styles.overlayCardLink}
              aria-label={`Explore ${spotlightTitle} Collection`}
            />
            <div className={styles.featuredImageCol}>
              <Image
                src={spotlightImg}
                alt={spotlightTitle}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 55vw"
                className={styles.featuredImage}
                priority
              />
            </div>
            <div className={styles.featuredTextCol}>
              <div>
                <span className={styles.featuredEyebrow}>FEATURED COLLECTIONS</span>
                <h3 className={styles.featuredTitle}>{spotlightTitle}</h3>
                <p className={styles.featuredDesc}>{spotlightDesc}</p>

                {/* Subcategory Pill Tags */}
                {spotlight.subcategories && spotlight.subcategories.length > 0 ? (
                  <div className={styles.pillGrid}>
                    {spotlight.subcategories.slice(0, 4).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/collections/${spotlight.slug || "sculptures-statues"}/${sub.slug}`}
                        className={styles.pill}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className={styles.pillGrid}>
                    <Link href="/collections/sculptures-statues/hindu-sculptures" className={styles.pill}>
                      Hindu Sculpture
                    </Link>
                    <Link href="/collections/sculptures-statues/buddhist-jain-sculptures" className={styles.pill}>
                      Buddhist & Jain Sculpture
                    </Link>
                    <Link href="/collections/sculptures-statues/human-portrait-sculptures" className={styles.pill}>
                      Human & Portrait Sculpture
                    </Link>
                    <Link href="/collections/sculptures-statues/classical-artistic-sculptures" className={styles.pill}>
                      Classical & Artistic Sculpture
                    </Link>
                  </div>
                )}
              </div>

              <Link href={`/collections/${spotlight.slug || "sculptures-statues"}`} className={styles.featuredLink}>
                <span>Explore {spotlightTitle}</span>
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. MIDDLE ROW — 2 COLUMNS */}
        <div className={styles.twoColRow}>
          <ScrollReveal animation="fade-up" delay={150}>
            <div className={styles.collectionCard}>
              <Link
                href={`/collections/${wallArt.slug || "wall-art-reliefs"}`}
                className={styles.overlayCardLink}
                aria-label={`Explore ${wallArtTitle} Collection`}
              />
              <div className={styles.cardImageWrapper}>
                <Image
                  src={wallArtImg}
                  alt={wallArtTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconBadge}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M12 4v16M4 12h16" strokeDasharray="1 2" />
                    <circle cx="12" cy="12" r="3" fill="#B87B31" fillOpacity="0.25" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{wallArtTitle}</h3>
                <p className={styles.cardDesc}>{wallArtDesc}</p>
                <Link href={`/collections/${wallArt.slug || "wall-art-reliefs"}`} className={styles.cardLink}>
                  <span>Browse Collection</span>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.collectionCard}>
              <Link
                href={`/collections/${temples.slug || "temples-architectural-stonework"}`}
                className={styles.overlayCardLink}
                aria-label={`Explore ${templesTitle} Collection`}
              />
              <div className={styles.cardImageWrapper}>
                <Image
                  src={templesImg}
                  alt={templesTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconBadge}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M12 3L4 9V21H20V9L12 3Z" />
                    <path d="M9 21V13H15V21" />
                    <circle cx="12" cy="10" r="1.5" fill="#B87B31" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{templesTitle}</h3>
                <p className={styles.cardDesc}>{templesDesc}</p>
                <Link href={`/collections/${temples.slug || "temples-architectural-stonework"}`} className={styles.cardLink}>
                  <span>Browse Collection</span>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 3. BOTTOM ROW — 3 COLUMNS */}
        <div className={styles.threeColRow}>
          <ScrollReveal animation="fade-up" delay={250}>
            <div className={styles.collectionCard}>
              <Link
                href={`/collections/${fountains.slug || "fountains-water-features"}`}
                className={styles.overlayCardLink}
                aria-label={`Explore ${fountainsTitle} Collection`}
              />
              <div className={styles.cardImageWrapper}>
                <Image
                  src={fountainsImg}
                  alt={fountainsTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconBadge}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M12 4v8M8 12c0 2.2 1.8 4 4 4s4-1.8 4-4" />
                    <path d="M5 20h14" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{fountainsTitle}</h3>
                <p className={styles.cardDesc}>{fountainsDesc}</p>
                <Link href={`/collections/${fountains.slug || "fountains-water-features"}`} className={styles.cardLink}>
                  <span>Browse Collection</span>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className={styles.collectionCard}>
              <Link
                href={`/collections/${decor.slug || "decorative-stone-art"}`}
                className={styles.overlayCardLink}
                aria-label={`Explore ${decorTitle} Collection`}
              />
              <div className={styles.cardImageWrapper}>
                <Image
                  src={decorImg}
                  alt={decorTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconBadge}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M12 21C12 21 7 16 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 16 12 21 12 21Z" />
                    <circle cx="12" cy="12" r="2" fill="#B87B31" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{decorTitle}</h3>
                <p className={styles.cardDesc}>{decorDesc}</p>
                <Link href={`/collections/${decor.slug || "decorative-stone-art"}`} className={styles.cardLink}>
                  <span>Browse Collection</span>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={350}>
            <div className={styles.collectionCard}>
              <Link
                href={`/collections/${custom.slug || "custom-bespoke-creations"}`}
                className={styles.overlayCardLink}
                aria-label={`Explore ${customTitle} Collection`}
              />
              <div className={styles.cardImageWrapper}>
                <Image
                  src={customImg}
                  alt={customTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconBadge}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#B87B31" strokeWidth="1.4">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 className={styles.cardTitle}>{customTitle}</h3>
                <p className={styles.cardDesc}>{customDesc}</p>
                <Link href={`/collections/${custom.slug || "custom-bespoke-creations"}`} className={styles.cardLink}>
                  <span>Browse Collection</span>
                  <span className={styles.arrow} aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Section Bottom Floral Ornament Divider */}
        <div className={styles.bottomDivider} aria-hidden="true">
          <svg width="140" height="20" viewBox="0 0 140 20" fill="none">
            <line x1="0" y1="10" x2="50" y2="10" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.35" />
            <circle cx="70" cy="10" r="3.5" fill="#B87B31" fillOpacity="0.6" />
            <path d="M70 3 Q74 10 70 17 Q66 10 70 3Z" fill="#B87B31" fillOpacity="0.4" />
            <line x1="90" y1="10" x2="140" y2="10" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.35" />
          </svg>
        </div>
      </Container>
    </section>
  );
}
