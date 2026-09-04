import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils";
import styles from "./CollectionDetail.module.css";

function getSubCoverImage(sub, col, variant = "card") {
  let url = "/images/collections/hero-sculptures-group.webp";
  if (sub?.imageSrc && typeof sub.imageSrc === "string" && !sub.imageSrc.includes("placehold.co")) {
    url = sub.imageSrc;
  } else if (col?.imageSrc && typeof col.imageSrc === "string" && !col.imageSrc.includes("placehold.co")) {
    url = col.imageSrc;
  }
  return getImageVariantUrl(url, variant);
}

export default function SubcollectionExploration({ collection }) {
  const subcategories = collection.subcategories || [];
  if (subcategories.length === 0) return null;

  const featuredSub = subcategories[0];
  const remainingSubs = subcategories.slice(1);

  return (
    <section className={styles.subcollectionsSection} aria-label="Explore Collection Categories">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>SUB-COLLECTIONS & CATEGORIES</span>
            <h2 className={styles.sectionTitle}>Explore {collection.name}</h2>
            <p className={styles.sectionDesc}>
              Discover specialized carving domains within our {collection.name.toLowerCase()} atelier portfolio.
            </p>
          </div>
        </ScrollReveal>

        {/* 1. FEATURED SUB-COLLECTION (Item #01 - Big Banner Card) */}
        {featuredSub && (
          <ScrollReveal animation="fade-up" delay={100}>
            <div className={styles.featuredSubCard}>
              <Link
                href={`/collections/${collection.slug}/${featuredSub.slug}`}
                className={styles.cardOverlayLink}
                aria-label={`Explore ${featuredSub.name}`}
              />
              <div className={styles.featuredSubImageWrapper}>
                <Image
                  src={getSubCoverImage(featuredSub, collection, "display")}
                  alt={featuredSub.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className={styles.subImage}
                  priority
                />
              </div>

              <div className={styles.featuredSubContent}>
                <span className={styles.indexBadge}>01</span>
                <h3 className={styles.subTitle}>{featuredSub.name}</h3>
                <p className={styles.subDesc}>{featuredSub.description}</p>
                <div className={styles.exploreLink}>
                  <span>Explore Sub-Collection</span>
                  <span aria-hidden="true">&rarr;</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 2. REMAINING SUB-COLLECTIONS (Items #02+ - Adaptive Grid) */}
        {remainingSubs.length > 0 && (
          <div className={styles.subGrid}>
            {remainingSubs.map((sub, idx) => {
              const indexStr = String(idx + 2).padStart(2, "0");
              return (
                <ScrollReveal key={sub.slug} animation="fade-up" delay={idx * 60}>
                  <div className={styles.subCard}>
                    <Link
                      href={`/collections/${collection.slug}/${sub.slug}`}
                      className={styles.cardOverlayLink}
                      aria-label={`Explore ${sub.name}`}
                    />
                    <div className={styles.subCardImageWrapper}>
                      <Image
                        src={getSubCoverImage(sub, collection, "card")}
                        alt={sub.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={styles.subImage}
                      />
                    </div>

                    <div className={styles.subCardBody}>
                      <div>
                        <div className={styles.subCardHeader}>
                          <h3 className={styles.subCardTitle}>{sub.name}</h3>
                          <span className={styles.subCardIndex}>{indexStr}</span>
                        </div>
                        <p className={styles.subCardDesc}>{sub.description}</p>
                      </div>

                      <div className={styles.exploreLink}>
                        <span>View Category</span>
                        <span aria-hidden="true">&rarr;</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
