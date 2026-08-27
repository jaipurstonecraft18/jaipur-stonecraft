import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/content/site";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductCustomizationBanner.module.css";

export default function ProductCustomizationBanner({ design }) {
  const productName = design?.name || "Statue";
  const whatsappMessage = encodeURIComponent(
    `Hello Jaipur Stonecraft, I would like to discuss a custom dimension or custom version of "${productName}".`
  );
  const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsapp}?text=${whatsappMessage}`;

  return (
    <section className={styles.bannerSection} aria-label="Custom Order Consultation">
      {/* Dark Texture Overlay Background */}
      <div className={styles.bgFrame} aria-hidden="true">
        <Image
          src="/images/craftsmanship/artisan-hands.png"
          alt=""
          fill
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.bgOverlay} />
      </div>

      <div className={styles.container}>
        <ScrollReveal animation="fade-up">
          <div className={styles.bannerGrid}>
            {/* Left Content Column */}
            <div className={styles.contentCol}>
              <h2 className={styles.heading}>
                Looking for a Custom {productName}?
              </h2>
              <p className={styles.description}>
                We create each statue in any size, posture or marble as per your requirement. 
                Share your ideas and our experts will guide you.
              </p>

              <div className={styles.actionRow}>
                <Link href={`/contact?type=custom&design=${design?.slug || ""}`} className={styles.goldBtn}>
                  Request a Custom Quote
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.outlineBtn}
                >
                  Talk to Our Expert
                </a>
              </div>
            </div>

            {/* Right Badges Column */}
            <div className={styles.badgesCol}>
              <div className={styles.badgeItem}>
                <div className={styles.badgeIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 3v18M15 3v18" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Personalized Design</span>
              </div>

              <div className={styles.badgeItem}>
                <div className={styles.badgeIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Expert Guidance</span>
              </div>

              <div className={styles.badgeItem}>
                <div className={styles.badgeIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className={styles.badgeLabel}>Secure Shipping Worldwide</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
