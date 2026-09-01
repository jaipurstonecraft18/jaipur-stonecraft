import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./FeaturedCreations.module.css";

const mosaicItems = [
  {
    id: 1,
    type: "image",
    src: "/images/brand/heritage-ganesha.jpg",
    alt: "White Marble Lord Ganesha Statue adorned with marigolds",
    title: "White Marble Ganesha Murti",
    gridClass: styles.tileGanesha,
  },
  {
    id: 2,
    type: "quote",
    stars: 5,
    quote: "The detailing, finish and divine presence of the idol is beyond words. Truly exceptional work.",
    author: "Rajesh S.",
    location: "Jaipur",
    gridClass: styles.tileQuote1,
  },
  {
    id: 3,
    type: "image",
    src: "/images/creations/sai-baba-seated.jpg",
    alt: "Seated Sai Baba White Marble Sculpture",
    title: "Sai Baba Devotional Statue",
    gridClass: styles.tileSaiBaba,
  },
  {
    id: 4,
    type: "quote",
    stars: 5,
    quote: "Beautifully crafted with incredible attention to detail and delivered with care.",
    author: "Meera K.",
    location: "Delhi",
    gridClass: styles.tileQuote2,
  },
  {
    id: 5,
    type: "image",
    src: "/images/creations/krishna-alcove.jpg",
    alt: "Lord Krishna Marble Statue in Temple Alcove",
    title: "Krishna Mandir Alcove Sculpture",
    gridClass: styles.tileKrishna,
  },
  {
    id: 6,
    type: "quote",
    stars: 5,
    quote: "The portrait statue captured every detail perfectly. We are extremely happy!",
    author: "Amit P.",
    location: "Mumbai",
    gridClass: styles.tileQuote3,
  },
  {
    id: 7,
    type: "image",
    src: "/images/collections/hero-sculptures-group.webp",
    alt: "Hand-Carved Marble Portrait Bust Sculpture",
    title: "Bespoke Portrait Bust",
    gridClass: styles.tileBust,
  },
  {
    id: 8,
    type: "image",
    src: "/images/creations/marble-home-mandir.jpg",
    alt: "Custom Carved White Marble Home Mandir Temple",
    title: "Custom Home Mandir Sanctuary",
    gridClass: styles.tileMandir,
  },
  {
    id: 9,
    type: "quote",
    stars: 5,
    quote: "Our temple is now complete because of your amazing art.",
    author: "Shyam Family",
    location: "Bangalore",
    gridClass: styles.tileQuote4,
  },
  {
    id: 10,
    type: "image",
    src: "/images/creations/black-nandi-statue.jpg",
    alt: "Hand-Carved Black Marble Nandi Bull Sculpture",
    title: "Black Marble Nandi Murti",
    gridClass: styles.tileNandi,
  },
];

export default function FeaturedCreations() {
  return (
    <section className={styles.section} aria-label="Featured Creations">
      <Container>
        <div className={styles.outerContainer}>
          {/* Section Header */}
          <ScrollReveal animation="fade-up">
            <div className={styles.headerWrapper}>
              <span className={styles.eyebrow}>CRAFTED FOR REAL SPACES</span>
              <h2 className={styles.heading}>From Our Hands to Your World.</h2>
              <p className={styles.description}>
                A glimpse of sculptures and creations crafted for our valued clients and the spaces they cherish.
              </p>
            </div>
          </ScrollReveal>

          {/* Mosaic Grid */}
          <div className={styles.mosaicGrid}>
            {mosaicItems.map((item, idx) => (
              <ScrollReveal key={item.id} animation="fade-up" delay={idx * 40} className={item.gridClass}>
                {item.type === "image" ? (
                  <div className={styles.imageCard}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.cardImage}
                      loading="lazy"
                    />
                    <div className={styles.imageOverlay}>
                      <span className={styles.imageTitle}>{item.title}</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.quoteCard}>
                    <div className={styles.starRow} aria-label={`${item.stars} out of 5 stars`}>
                      {[...Array(item.stars)].map((_, i) => (
                        <span key={i} className={styles.star}>★</span>
                      ))}
                    </div>
                    <blockquote className={styles.quoteText}>
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <div className={styles.quoteAuthor}>
                      &mdash; {item.author}, <span className={styles.location}>{item.location}</span>
                    </div>
                  </div>
                )}
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA Button */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className={styles.ctaWrapper}>
              <Link href="/projects" className={styles.ctaButton}>
                <span>View All Creations</span>
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}
