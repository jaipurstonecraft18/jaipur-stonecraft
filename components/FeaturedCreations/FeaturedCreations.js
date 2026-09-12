import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import styles from "./FeaturedCreations.module.css";

export const DEFAULT_GRID_CLASSES = [
  "tileGanesha",
  "tileQuote1",
  "tileSaiBaba",
  "tileQuote2",
  "tileKrishna",
  "tileQuote3",
  "tileBust",
  "tileMandir",
  "tileQuote4",
  "tileNandi"
];

export const defaultMosaicItems = [
  {
    id: "1",
    type: "image",
    src: "/images/brand/heritage-ganesha.webp",
    alt: "White Marble Lord Ganesha Statue adorned with marigolds",
    title: "White Marble Ganesha Murti",
    gridClass: "tileGanesha",
    isActive: true
  },
  {
    id: "2",
    type: "quote",
    stars: 5,
    quote: "The detailing, finish and divine presence of the idol is beyond words. Truly exceptional work.",
    author: "Rajesh S.",
    location: "Jaipur",
    gridClass: "tileQuote1",
    isActive: true
  },
  {
    id: "3",
    type: "image",
    src: "/images/creations/sai-baba-seated.webp",
    alt: "Seated Sai Baba White Marble Sculpture",
    title: "Sai Baba Devotional Statue",
    gridClass: "tileSaiBaba",
    isActive: true
  },
  {
    id: "4",
    type: "quote",
    stars: 5,
    quote: "Beautifully crafted with incredible attention to detail and delivered with care.",
    author: "Meera K.",
    location: "Delhi",
    gridClass: "tileQuote2",
    isActive: true
  },
  {
    id: "5",
    type: "image",
    src: "/images/creations/krishna-alcove.webp",
    alt: "Lord Krishna Marble Statue in Temple Alcove",
    title: "Krishna Mandir Alcove Sculpture",
    gridClass: "tileKrishna",
    isActive: true
  },
  {
    id: "6",
    type: "quote",
    stars: 5,
    quote: "The portrait statue captured every detail perfectly. We are extremely happy!",
    author: "Amit P.",
    location: "Mumbai",
    gridClass: "tileQuote3",
    isActive: true
  },
  {
    id: "7",
    type: "image",
    src: "/images/collections/hero-sculptures-group.webp",
    alt: "Hand-Carved Marble Portrait Bust Sculpture",
    title: "Bespoke Portrait Bust",
    gridClass: "tileBust",
    isActive: true
  },
  {
    id: "8",
    type: "image",
    src: "/images/creations/marble-home-mandir.webp",
    alt: "Custom Carved White Marble Home Mandir Temple",
    title: "Custom Home Mandir Sanctuary",
    gridClass: "tileMandir",
    isActive: true
  },
  {
    id: "9",
    type: "quote",
    stars: 5,
    quote: "Our temple is now complete because of your amazing art.",
    author: "Shyam Family",
    location: "Bangalore",
    gridClass: "tileQuote4",
    isActive: true
  },
  {
    id: "10",
    type: "image",
    src: "/images/creations/black-nandi-statue.webp",
    alt: "Hand-Carved Black Marble Nandi Bull Sculpture",
    title: "Black Marble Nandi Murti",
    gridClass: "tileNandi",
    isActive: true
  }
];

export default function FeaturedCreations({ sectionData = null }) {
  const eyebrow = sectionData?.eyebrow || "CRAFTED FOR REAL SPACES";
  const heading = sectionData?.heading || "From Our Hands to Your World.";
  const description = sectionData?.description || "A glimpse of sculptures and creations crafted for our valued clients and the spaces they cherish.";
  const ctaText = sectionData?.ctaText || "View All Creations";
  const ctaHref = sectionData?.ctaHref || "/projects";

  const rawItems = Array.isArray(sectionData?.items) && sectionData.items.length > 0
    ? sectionData.items
    : defaultMosaicItems;

  const activeItems = rawItems.filter((item) => item.isActive !== false);

  const getGridClass = (item, idx) => {
    if (item.gridClass && item.isCustomSlot && styles[item.gridClass]) {
      return styles[item.gridClass];
    }
    const slotKey = DEFAULT_GRID_CLASSES[idx % DEFAULT_GRID_CLASSES.length];
    return styles[slotKey] || "";
  };

  return (
    <section className={styles.section} aria-label="Customer Creations and Reviews">
      <Container>
        <div className={styles.outerContainer}>
          {/* Section Header */}
          <ScrollReveal animation="fade-up">
            <div className={styles.headerWrapper}>
              <span className={styles.eyebrow}>{eyebrow}</span>
              <h2 className={styles.heading}>{heading}</h2>
              <p className={styles.description}>{description}</p>
            </div>
          </ScrollReveal>

          {/* Mosaic Grid */}
          <div className={styles.mosaicGrid}>
            {activeItems.map((item, idx) => (
              <ScrollReveal
                key={item.id || idx}
                animation="fade-up"
                delay={idx * 40}
                className={getGridClass(item, idx)}
              >
                {item.type === "image" ? (
                  <div className={styles.imageCard}>
                    {item.src && (
                      <Image
                        src={getImageVariantUrl(item.src, "card")}
                        alt={item.alt || item.title || "Jaipur Stonecraft creation"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.cardImage}
                        loading="lazy"
                      />
                    )}
                    <div className={styles.imageOverlay}>
                      <span className={styles.imageTitle}>{item.title || ""}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.quoteCard}>
                    <div
                      className={styles.starRow}
                      aria-label={`${item.stars || 5} out of 5 stars`}
                    >
                      {[...Array(Math.max(1, Math.min(5, Number(item.stars) || 5)))].map((_, i) => (
                        <span key={i} className={styles.star}>
                          ★
                        </span>
                      ))}
                    </div>
                    <blockquote className={styles.quoteText}>
                      &ldquo;{item.quote || ""}&rdquo;
                    </blockquote>
                    <div className={styles.quoteAuthor}>
                      &mdash; {item.author || item.clientName || "Valued Client"}
                      {(item.location || item.clientLocation) ? (
                        <>
                          , <span className={styles.location}>{item.location || item.clientLocation}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA Button */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.ctaWrapper}>
              <Link href={ctaHref} className={styles.ctaButton}>
                <span>{ctaText}</span>
                <span className={styles.arrow} aria-hidden="true">
                  &rarr;
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

