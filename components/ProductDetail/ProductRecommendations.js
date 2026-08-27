import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductRecommendations.module.css";

export default function ProductRecommendations({ relatedProducts = [], categoryName = "", collectionSlug = "", categorySlug = "" }) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  const headingText = categoryName
    ? `More from the ${categoryName} Collection`
    : "More Related Atelier Creations";

  const viewAllHref = collectionSlug && categorySlug 
    ? `/collections/${collectionSlug}/${categorySlug}` 
    : "/collections";

  return (
    <section className={styles.recommendSection} aria-label="Related Product Recommendations">
      <div className={styles.container}>
        <ScrollReveal animation="fade-up">
          <div className={styles.header}>
            <h2 className={styles.heading}>{headingText}</h2>
            <div className={styles.ornamentDivider} aria-hidden="true">✦</div>
          </div>
        </ScrollReveal>

        {/* 6-Card Grid (Matching Design Reference) */}
        <div className={styles.recommendGrid}>
          {relatedProducts.map((rel, idx) => {
            const relHref = `/designs/${rel.parentCategory || "stonecraft"}/${rel.slug}`;
            return (
              <ScrollReveal key={rel.slug || idx} animation="fade-up" delay={idx * 40}>
                <div className={styles.card}>
                  <Link href={relHref} className={styles.imageLink} tabIndex={-1}>
                    <div className={styles.imageFrame}>
                      <Image
                        src={rel.imageSrc}
                        alt={rel.name || "Hand-carved stone sculpture"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 16vw"
                        className={styles.cardImage}
                        loading="lazy"
                      />
                      <span className={styles.favoriteIcon} aria-hidden="true">♡</span>
                    </div>
                  </Link>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                      <Link href={relHref} className={styles.titleLink}>
                        {rel.name}
                      </Link>
                    </h3>
                    
                    <span className={styles.priceTag}>
                      {rel.price ? `from ₹ ${rel.price}` : "Custom Made to Order"}
                    </span>

                    <div className={styles.cardFooter}>
                      <Link href={relHref} className={styles.viewLink}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* View All Collection Sculptures Button */}
        <div className={styles.btnRow}>
          <Link href={viewAllHref} className={styles.viewAllBtn}>
            View All {categoryName ? `${categoryName} Sculptures` : "Creations"}
          </Link>
        </div>
      </div>
    </section>
  );
}
