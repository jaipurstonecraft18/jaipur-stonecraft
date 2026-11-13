import Link from "next/link";
import Container from "@/components/Container/Container";
import ProductCard from "@/components/ProductCard/ProductCard";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import styles from "./LandingShowcaseGrid.module.css";

export default function LandingShowcaseGrid({
  id = "available-designs",
  eyebrow = "Curated Masterpieces",
  title = "Available Hand-Carved Designs",
  subtitle = "Each creation is hand-sculpted by master artisans from single-quarry blocks of pure natural marble in our Jaipur atelier.",
  products = [],
  categoryLink = null,
  categoryLinkLabel = "Explore Complete Catalogue Hierarchy"
}) {
  const hasProducts = products && products.length > 0;

  return (
    <section id={id} className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
        </div>

        <div className={styles.grid}>
          {hasProducts &&
            products.map((product) => {
              const productCategory = product.primaryCategorySlug || product.parentCategory || "hindu-sculptures";
              const detailHref = `/designs/${productCategory}/${product.slug}`;
              const materialDisplay = product.primaryMaterial?.name || product.attributes?.stoneVariety || "Makrana Pure White Marble";

              return (
                <ProductCard
                  key={product.slug}
                  href={detailHref}
                  name={product.name}
                  category={product.primaryCategorySlug ? product.primaryCategorySlug.replace(/-/g, " ") : "Sacred Sculpture"}
                  material={materialDisplay}
                  imageSrc={product.imageSrc}
                  imageAlt={product.imageAlt || `Hand-carved ${product.name} in solid ${materialDisplay} from Jaipur atelier`}
                />
              );
            })}

          {/* Bespoke Commission Card */}
          <div className={styles.customCommissionCard}>
            <span className={styles.commissionBadge}>Bespoke Sizing</span>
            <h3 className={styles.commissionTitle}>Custom Dimensions & Mudras</h3>
            <p className={styles.commissionText}>
              Do you require specific shrine proportions, custom shringar, or an exact temple scale? Our master sculptors carve bespoke murtis tailored to your sanctuary.
            </p>
            <PrimaryButton href="#custom-inquiry" variant="charcoal">
              Request Custom Quote
            </PrimaryButton>
          </div>
        </div>

        {categoryLink && (
          <div className={styles.catalogueFooter}>
            <p className={styles.catalogueNote}>
              Looking for a wider selection of designs, archival works, or custom commissions?
            </p>
            <Link href={categoryLink} className={styles.catalogueLink}>
              {categoryLinkLabel} →
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
