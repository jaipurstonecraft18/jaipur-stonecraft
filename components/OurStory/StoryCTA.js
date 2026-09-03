import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import { siteConfig } from "@/content/site";
import styles from "./OurStory.module.css";

export default function StoryCTA({ data = {} }) {
  const eyebrow = data.eyebrow || "LET'S CREATE TOGETHER";
  const heading = data.heading || "Bring Your Architectural Vision to Stone";
  const desc = data.desc || data.description || "Connect directly with our Jaipur design office to discuss custom commissions, CAD blueprint coordination, or raw stone block selection.";
  const rawBgImage = data.imageSrc || "/images/craftsmanship/artisan-hands.png";
  const bgImage = getImageVariantUrl(rawBgImage, "display") || rawBgImage;
  const primaryText = data.primaryCtaText || "Discuss a Commission";
  const primaryHref = data.primaryCtaHref || "/contact?type=custom";
  const secondaryText = data.secondaryCtaText || "WhatsApp Coordinator";

  const whatsappMessage = encodeURIComponent(
    "Hello Jaipur Stonecraft, I have reviewed your story and would like to discuss an architectural commission or custom sculpture project."
  );
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <section className={styles.ctaSection} aria-label="Brand Story Call to Action">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.ctaCard}>
            {/* Background Texture Overlay */}
            <div className={styles.ctaBgFrame} aria-hidden="true">
              <Image
                src={bgImage}
                alt="Jaipur Stonecraft artisan hands chiseling stone"
                fill
                sizes="100vw"
                className={styles.ctaBgImage}
              />
              <div className={styles.ctaBgOverlay} />
            </div>

            <div className={styles.ctaContentGrid}>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaEyebrow}>{eyebrow}</span>
                <h2 className={styles.ctaHeading}>{heading}</h2>
                <p className={styles.ctaDesc}>{desc}</p>
              </div>

              <div className={styles.ctaActionCol}>
                <Link href={primaryHref} className={styles.primaryGoldButton}>
                  <span>{primaryText}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryOutlineButton}
                >
                  <span>{secondaryText}</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
