import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProductSubtleCraftsmanship.module.css";

const processSequence = [
  {
    step: "Select",
    sub: "Finest Marble",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    step: "Carve",
    sub: "By Hand",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    step: "Refine",
    sub: "Every Detail",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" fill="var(--color-bronze)" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    step: "Finish",
    sub: "To Perfection",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
        <path d="M12 21C12 21 7 16 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 16 12 21 12 21Z" />
        <circle cx="12" cy="12" r="2" fill="var(--color-bronze)" />
      </svg>
    ),
  },
];

export default function ProductSubtleCraftsmanship({ design }) {
  const materialName = design?.primaryMaterial ? design.primaryMaterial.name : "Makrana Marble";

  const productDetailCards = [
    {
      title: "Material",
      sub: materialName,
      desc: `Premium-quality stone sourced directly from ${design?.primaryMaterial ? design.primaryMaterial.origin : "Makrana, Rajasthan"}.`,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      ),
    },
    {
      title: "Craftsmanship",
      sub: "100% Hand-Carved",
      desc: "Carved by master artisans with decades of inherited experience.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
    {
      title: "Customization",
      sub: "Made to Your Size",
      desc: "We create statues in any size as per your exact requirements.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 3v18M15 3v18" />
        </svg>
      ),
    },
    {
      title: "Finish",
      sub: "Polished with Care",
      desc: "Smooth polished finish with fine detailing and natural shine.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      title: "Ideal For",
      sub: "Home, Temple & Gifting",
      desc: "Perfect for temples, home altars, spiritual spaces and gifting.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      title: "Care",
      sub: "Easy to Maintain",
      desc: "Wipe with soft, dry cloth. Keep away from harsh chemicals.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bronze)" strokeWidth="1.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* 1. DARK WARM ATELIER BANNER (REFERENCE SECTION 2) */}
      <section className={styles.atelierSection} aria-label="Atelier Craftsmanship">
        <div className={styles.container}>
          <ScrollReveal animation="fade-up">
            <div className={styles.bannerGrid}>
              {/* Left Photo */}
              <div className={styles.imageCol}>
                <div className={styles.imageFrame}>
                  <Image
                    src="/images/craftsmanship/step-02-shape-precision.jpg"
                    alt="Master carver hand chiseling marble sculpture in Jaipur workshop"
                    fill
                    sizes="(max-width: 991px) 100vw, 40vw"
                    className={styles.bannerImage}
                  />
                </div>
              </div>

              {/* Right Story & 4-Step Sequence */}
              <div className={styles.contentCol}>
                <h2 className={styles.bannerHeading}>
                  Crafted with Devotion. Carved to Perfection.
                </h2>
                <p className={styles.bannerDesc}>
                  Each sculpture is hand-carved by skilled artisans using traditional techniques passed down 
                  through generations. Time, patience and precision bring divine forms to life in marble.
                </p>

                {/* 4-Step Linear Sequence */}
                <div className={styles.sequenceTrack}>
                  {processSequence.map((item, idx) => (
                    <div key={item.step} className={styles.seqNodeWrapper}>
                      <div className={styles.seqNode}>
                        <div className={styles.seqCircle}>{item.icon}</div>
                        <span className={styles.seqTitle}>{item.step}</span>
                        <span className={styles.seqSub}>{item.sub}</span>
                      </div>
                      {idx < processSequence.length - 1 && (
                        <span className={styles.seqArrow} aria-hidden="true">&rarr;</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. PRODUCT DETAILS 6-CARD GRID (REFERENCE SECTION 3) */}
      <section className={styles.detailsSection} aria-label="Product Specifications">
        <div className={styles.container}>
          <ScrollReveal animation="fade-up">
            <div className={styles.detailsHeader}>
              <h2 className={styles.sectionTitle}>Product Details</h2>
              <div className={styles.ornamentDivider} aria-hidden="true">✦</div>
            </div>
          </ScrollReveal>

          <div className={styles.cardsGrid}>
            {productDetailCards.map((card, idx) => (
              <ScrollReveal key={card.title} animation="fade-up" delay={idx * 40}>
                <div className={styles.detailCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardIcon}>{card.icon}</div>
                    <div>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      <span className={styles.cardSub}>{card.sub}</span>
                    </div>
                  </div>
                  <p className={styles.cardDesc}>{card.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
