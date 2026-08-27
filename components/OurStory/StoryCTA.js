import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { siteConfig } from "@/content/site";
import styles from "./OurStory.module.css";

export default function StoryCTA() {
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
                src="/images/craftsmanship/artisan-hands.png"
                alt=""
                fill
                sizes="100vw"
                className={styles.ctaBgImage}
              />
              <div className={styles.ctaBgOverlay} />
            </div>

            <div className={styles.ctaContentGrid}>
              <div className={styles.ctaTextCol}>
                <span className={styles.ctaEyebrow}>LET&apos;S CREATE TOGETHER</span>
                <h2 className={styles.ctaHeading}>
                  Bring Your Architectural Vision to Stone
                </h2>
                <p className={styles.ctaDesc}>
                  Connect directly with our Jaipur design office to discuss custom commissions, 
                  CAD blueprint coordination, or raw stone block selection.
                </p>
              </div>

              <div className={styles.ctaActionCol}>
                <Link href="/contact?type=custom" className={styles.primaryGoldButton}>
                  <span>Discuss a Commission</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.secondaryOutlineButton}
                >
                  <span>WhatsApp Coordinator</span>
                </a>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
