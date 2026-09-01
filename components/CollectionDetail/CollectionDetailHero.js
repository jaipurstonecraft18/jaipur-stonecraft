import Image from "next/image";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CollectionDetail.module.css";

export default function CollectionDetailHero({ collection, heroData }) {
  const {
    eyebrow = "ATELIER COLLECTION",
    tagline = "Handcrafted with Generational Devotion & Masonic Precision",
    heroImageSrc = collection.imageSrc || collection.image_src || "/images/collections/hero-sculptures-group.webp"
  } = heroData || {};

  return (
    <header className={styles.heroBannerHeader}>
      {/* Background Dimmed Cover Image */}
      <div className={styles.heroBannerBgWrapper}>
        <Image
          src={heroImageSrc}
          alt={`${collection.name} cover`}
          fill
          unoptimized
          priority
          sizes="100vw"
          className={styles.heroBannerBgImage}
        />
        <div className={styles.heroBannerOverlay} />
      </div>

      {/* Foreground Content */}
      <Container style={{ position: "relative", zIndex: 3 }}>
        <div className={styles.heroBannerContent}>
          <div className={styles.breadcrumbsWrapperDark}>
            <Breadcrumbs
              items={[
                { label: "Collections", href: "/collections" },
                { label: collection.name },
              ]}
              theme="dark"
            />
          </div>

          <ScrollReveal animation="fade-up">
            <span className={styles.eyebrowBadgeGold}>{eyebrow}</span>
            <h1 className={styles.heroBannerTitle}>{collection.name}</h1>
            <p className={styles.heroBannerTagline}>{tagline}</p>
            <p className={styles.heroBannerDescription}>{collection.description}</p>
          </ScrollReveal>
        </div>
      </Container>
    </header>
  );
}
