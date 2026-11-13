import Link from "next/link";
import Container from "@/components/Container/Container";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton/SecondaryButton";
import styles from "./LandingHero.module.css";

export default function LandingHero({
  eyebrow = "Direct Jaipur Atelier • Master Shilpkar Heritage",
  title,
  lead,
  breadcrumbs = [],
  highlights = [
    { label: "Material Quality", value: "Premium White Marble Selection" },
    { label: "Artisan Pedigree", value: "Generational Jaipur Sculptors" },
    { label: "Custom Scale", value: "6 Inches to 8+ Feet Temple Scale" },
    { label: "Packaging & Delivery", value: "International Packaging Available" }
  ],
  whatsappText = "Hello Jaipur Stonecraft, I would like to inquire about handcrafted marble statues."
}) {
  const encodedWa = encodeURIComponent(whatsappText);

  return (
    <section className={styles.heroSection}>
      <Container>
        {breadcrumbs.length > 0 && (
          <div className={styles.breadcrumbWrapper}>
            <Breadcrumbs items={breadcrumbs} renderJsonLd={false} />
          </div>
        )}

        <div className={styles.heroContent}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.lead}>{lead}</p>

          {highlights.length > 0 && (
            <div className={styles.highlightsGrid}>
              {highlights.map((h, i) => (
                <div key={i} className={styles.highlightCard}>
                  <span className={styles.highlightLabel}>{h.label}</span>
                  <span className={styles.highlightValue}>{h.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <PrimaryButton href="#available-designs" variant="charcoal">
              Explore Available Designs
            </PrimaryButton>
            <SecondaryButton href="#custom-inquiry" variant="outline">
              Request Bespoke Sizing
            </SecondaryButton>
            <a
              href={`https://wa.me/918690471802?text=${encodedWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappButton}
              aria-label="Direct WhatsApp Consultation with Jaipur Atelier"
            >
              <svg className={styles.whatsappIcon} viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.088-1.78-.387-1.393-.578-2.316-1.996-2.385-2.088-.07-.092-.563-.748-.563-1.425 0-.677.355-1.01.482-1.147.127-.137.28-.173.373-.173.093 0 .186.002.267.006.085.004.199-.033.31.233.116.279.395.962.43 1.031.034.07.057.151.011.242-.046.091-.07.148-.139.229-.07.081-.147.18-.21.242-.07.07-.143.146-.062.285.081.139.36 5.95 1.056 1.215.892.795 1.644 1.042 1.877 1.157.232.115.367.098.503-.058.136-.157.58-.675.736-.907.156-.232.311-.194.524-.115.213.08 1.353.638 1.586.754.233.116.388.174.446.272.058.098.058.568-.086.973z"/>
              </svg>
              WhatsApp Atelier
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
