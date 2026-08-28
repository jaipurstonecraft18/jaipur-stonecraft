import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CraftProcess.module.css";

const defaultJourneySteps = [
  {
    step: "01",
    title: "SELECT THE FINEST STONE",
    description: "Handpicked premium marble chosen for its purity, strength, and timeless beauty.",
    imageSrc: "/images/craftsmanship/step-01-select-stone.jpg",
    alt: "Raw white marble stone blocks stacked in quarry",
  },
  {
    step: "02",
    title: "SHAPE WITH PRECISION",
    description: "Artisans carve the form with care, bringing the first life to the stone.",
    imageSrc: "/images/craftsmanship/step-02-shape-precision.jpg",
    alt: "Artisan hands chiseling initial contours into white marble",
  },
  {
    step: "03",
    title: "REFINE THE DETAILS",
    description: "Every detail is meticulously carved to perfection, giving it character and grace.",
    imageSrc: "/images/craftsmanship/step-03-refine-details.jpg",
    alt: "Master carver chiseling intricate deity facial expressions",
  },
  {
    step: "04",
    title: "POLISH TO PERFECTION",
    description: "Surface is smoothed and polished to enhance the natural beauty of marble.",
    imageSrc: "/images/craftsmanship/step-04-polish-perfection.jpg",
    alt: "Hand polishing smooth white marble sculpture surface with water",
  },
  {
    step: "05",
    title: "A MASTERPIECE IS BORN",
    description: "A timeless creation, ready to be cherished for generations.",
    imageSrc: "/images/brand/heritage-ganesha.jpg",
    alt: "Completed white marble Ganesha murti masterpiece",
  },
];

const defaultCraftValues = [
  {
    title: "Generations of Skill",
    description: "Decades of inherited knowledge, passed down with pride.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A359" strokeWidth="1.4">
        <path d="M12 3L4 9V21H20V9L12 3Z" />
        <path d="M9 21V13H15V21" />
      </svg>
    ),
  },
  {
    title: "Attention to Every Detail",
    description: "Nothing is too small to matter when perfection is our promise.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A359" strokeWidth="1.4">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" fill="#D4A359" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    title: "Time-Honored Techniques",
    description: "Traditional methods combined with modern understanding.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A359" strokeWidth="1.4">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: "Crafted with Devotion",
    description: "Every piece is a labor of love, carrying blessings and intent.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D4A359" strokeWidth="1.4">
        <path d="M12 21C12 21 7 16 7 12C7 9.2 9.2 7 12 7C14.8 7 17 9.2 17 12C17 16 12 21 12 21Z" />
        <circle cx="12" cy="12" r="2" fill="#D4A359" />
      </svg>
    ),
  },
];

export default function CraftProcess({ sectionData }) {
  const data = {
    eyebrow: "THE ART OF CRAFTSMANSHIP",
    heading: "Where Tradition\nMeets Mastery.",
    description: "Every masterpiece begins with passion, precision, and the hands of our skilled artisans. Experience the timeless journey of stone transformed into divinity.",
    heroImageSrc: "/images/hero/hero-krishna-artisan.jpg",
    storyTitle: "Hands That Create.\nHearts That Care.",
    storyDesc: "Our artisans are the soul of Jaipur Stonecraft. With generations of experience and unwavering dedication, they pour their heart into every chisel stroke.",
    storyScriptAccent: "Built on Tradition. Perfected by Time.",
    storyImageSrc: "/images/collections/hero-sculptures-group.webp",
    journeySteps: defaultJourneySteps,
    ...sectionData,
  };

  const stepsList = Array.isArray(data.journeySteps) && data.journeySteps.length > 0 ? data.journeySteps : defaultJourneySteps;

  return (
    <section className={styles.section} aria-label="Craftsmanship">
      <Container>
        {/* Dark Warm Atelier Container */}
        <div className={styles.outerContainer}>
          {/* PART 1: MAIN CRAFTSMANSHIP HERO AREA */}
          <div className={styles.heroGrid}>
            {/* Left Content Side */}
            <ScrollReveal animation="fade-up">
              <div className={styles.heroContent}>
                <span className={styles.eyebrow}>{data.eyebrow}</span>
                <h2 className={styles.heading} style={{ whiteSpace: "pre-line" }}>
                  {data.heading}
                </h2>
                <p className={styles.description}>
                  {data.description}
                </p>

                {/* Craftsmanship Statement Badge Box */}
                <div className={styles.badgeBox}>
                  <div className={styles.mandalaIcon} aria-hidden="true">
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                      <circle cx="22" cy="22" r="18" stroke="#D4A359" strokeWidth="1" strokeDasharray="2 2" />
                      <circle cx="22" cy="22" r="10" stroke="#D4A359" strokeWidth="1" />
                      <path d="M22 4 L22 40 M4 22 L40 22" stroke="#D4A359" strokeWidth="1" strokeOpacity="0.4" />
                      <circle cx="22" cy="22" r="4" fill="#D4A359" fillOpacity="0.4" />
                    </svg>
                  </div>
                  <div>
                    <span className={styles.badgeTitle}>100% HANDCRAFTED EXCELLENCE</span>
                    <p className={styles.badgeSub}>No machines. No shortcuts. Just pure skill and devotion.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right Visual Side */}
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.heroImageWrapper}>
                <Image
                  src={data.heroImageSrc || "/images/hero/hero-krishna-artisan.jpg"}
                  alt="Master artisan chiseling white marble sculpture in Jaipur workshop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={styles.heroImage}
                  priority
                />
              </div>
            </ScrollReveal>
          </div>

          {/* PART 2: THE CRAFTING JOURNEY (5 Arch Steps) */}
          <div className={styles.journeySection}>
            <ScrollReveal animation="fade-up">
              <div className={styles.journeyHeader}>
                <span className={styles.eyebrow}>OUR CRAFTING JOURNEY</span>
                <div className={styles.ornamentLine} aria-hidden="true">
                  <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
                    <line x1="0" y1="8" x2="46" y2="8" stroke="#D4A359" strokeWidth="1" strokeOpacity="0.45" />
                    <circle cx="60" cy="8" r="3" fill="#D4A359" />
                    <path d="M60 2 Q63 8 60 14 Q57 8 60 2Z" fill="#D4A359" fillOpacity="0.5" />
                    <line x1="74" y1="8" x2="120" y2="8" stroke="#D4A359" strokeWidth="1" strokeOpacity="0.45" />
                  </svg>
                </div>
              </div>
            </ScrollReveal>

            <div className={styles.journeyGrid}>
              {stepsList.map((step, idx) => (
                <ScrollReveal key={step.step || idx} animation="fade-up" delay={idx * 80}>
                  <div className={styles.journeyCard}>
                    {/* Arch Framed Image */}
                    <div className={styles.archWrapper}>
                      <Image
                        src={step.imageSrc || defaultJourneySteps[idx]?.imageSrc || "/images/craftsmanship/step-01-select-stone.jpg"}
                        alt={step.title || "Crafting step"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        className={styles.archImage}
                        loading="lazy"
                      />
                      <span className={styles.stepBadge}>{step.step || `0${idx + 1}`}</span>
                    </div>

                    <div className={styles.stepContent}>
                      <span className={styles.stepNumText}>{step.step || `0${idx + 1}`}</span>
                      <h3 className={styles.stepTitle}>{step.title}</h3>
                      <p className={styles.stepDesc}>{step.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* PART 3: BEHIND EVERY CREATION (Human Story & Craft Values) */}
          <div className={styles.storyContainer}>
            <div className={styles.storyGrid}>
              {/* Left Profile Photo */}
              <ScrollReveal animation="fade-up">
                <div className={styles.storyImageWrapper}>
                  <Image
                    src={data.storyImageSrc || "/images/collections/hero-sculptures-group.webp"}
                    alt="White marble goddess facial profile carved by master artisan"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className={styles.storyImage}
                    loading="lazy"
                  />
                </div>
              </ScrollReveal>

              {/* Right Story Content */}
              <ScrollReveal animation="fade-up" delay={150}>
                <div className={styles.storyContent}>
                  <span className={styles.eyebrow}>BEHIND EVERY CREATION</span>
                  <h3 className={styles.storyTitle} style={{ whiteSpace: "pre-line" }}>
                    {data.storyTitle}
                  </h3>
                  <p className={styles.storyDesc}>
                    {data.storyDesc}
                  </p>
                  <p className={styles.scriptAccent}>{data.storyScriptAccent}</p>

                  {/* 4 Craft Values Grid */}
                  <div className={styles.valuesGrid}>
                    {defaultCraftValues.map((val) => (
                      <div key={val.title} className={styles.valueItem}>
                        <div className={styles.valueIcon}>{val.icon}</div>
                        <div>
                          <h4 className={styles.valueTitle}>{val.title}</h4>
                          <p className={styles.valueDesc}>{val.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* PART 4: SECTION BOTTOM PROMISE TRANSITION BANNER */}
        <ScrollReveal animation="fade-up">
          <div className={styles.promiseBanner}>
            <div className={styles.bannerContent}>
              <h3 className={styles.bannerHeading}>
                From Raw Stone to Divine Beauty, <br />
                <span className={styles.bannerSubHeading}>That is the Jaipur Stonecraft Promise.</span>
              </h3>
              <Link href="/collections" className={styles.bannerCta}>
                <span>EXPLORE OUR CREATIONS</span>
                <span className={styles.arrow} aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
