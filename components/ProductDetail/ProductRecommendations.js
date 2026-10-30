import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import { categoriesData } from "@/content/categories-data.js";
import ProductImageFrame from "@/components/ProductImageFrame/ProductImageFrame";
import styles from "./ProductRecommendations.module.css";

export default function ProductRecommendations({ 
  relatedProducts = [], 
  categoryName = "", 
  collectionSlug = "", 
  subcategorySlug = "",
  categorySlug = "",
  categoryHref = ""
}) {
  if (!relatedProducts || relatedProducts.length === 0) return null;

  const headingText = categoryName
    ? `More from the ${categoryName} Collection`
    : "More Related Atelier Creations";

  // Resolve canonical 3-level category URL dynamically
  let viewAllHref = categoryHref;
  if (!viewAllHref) {
    if (collectionSlug && subcategorySlug && categorySlug) {
      viewAllHref = `/collections/${collectionSlug}/${subcategorySlug}/${categorySlug}`;
    } else if (categorySlug && categoriesData[categorySlug]) {
      const cat = categoriesData[categorySlug];
      viewAllHref = `/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`;
    } else if (collectionSlug && subcategorySlug) {
      viewAllHref = `/collections/${collectionSlug}/${subcategorySlug}`;
    } else if (collectionSlug) {
      viewAllHref = `/collections/${collectionSlug}`;
    } else {
      viewAllHref = "/collections";
    }
  }

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
                    <ProductImageFrame
                      src={getImageVariantUrl(rel.imageSrc, "display")}
                      alt={rel.name || "Hand-carved stone sculpture"}
                      aspectRatio="4 / 5"
                      sizes="(max-width: 576px) 50vw, (max-width: 991px) 33vw, (max-width: 1440px) 22vw, 320px"
                      quality={88}
                      className={styles.imageFrame}
                    >
                      <span className={styles.favoriteIcon} aria-hidden="true">♡</span>
                    </ProductImageFrame>
                  </Link>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                      <Link href={relHref} className={styles.titleLink}>
                        {rel.name}
                      </Link>
                    </h3>
                    
                    <span className={styles.priceTag}>
                      Custom sizes available
                    </span>

                    <div className={styles.cardFooter}>
                      <Link href={relHref} className={styles.viewLink}>
                        Enquire &rarr;
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
