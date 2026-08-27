import Link from "next/link";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CollectionDetail.module.css";
import { siteConfig } from "@/content/site";

export default function CollectionCTA({ ctaData = {}, collectionSlug = "" }) {
  const {
    eyebrow = "CUSTOM STONECRAFT COMMISSION",
    heading = "Commission a Bespoke Creation",
    description = "Collaborate with our master sculptors to tailor dimensions, stone block selection, and masonic carving details.",
    primaryCtaText = "Discuss Your Project",
    primaryCtaHref = `/contact?type=custom&collection=${collectionSlug}`,
    secondaryCtaText = "WhatsApp Designer",
    secondaryCtaHref = siteConfig?.contact?.whatsappLink || "https://wa.me/917014753278"
  } = ctaData;

  return (
    <section className={styles.ctaSection} aria-label="Commission CTA">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.ctaContainer}>
            <span className={styles.ctaEyebrow}>{eyebrow}</span>
            <h2 className={styles.ctaHeading}>{heading}</h2>
            <p className={styles.ctaDesc}>{description}</p>

            <div className={styles.ctaButtonGroup}>
              <Link href={primaryCtaHref} className={styles.primaryGoldButton}>
                <span>{primaryCtaText}</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <a
                href={secondaryCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryOutlineButton}
              >
                <span>{secondaryCtaText}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
