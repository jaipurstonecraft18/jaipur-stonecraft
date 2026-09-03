import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryFutureSection({ data = {} }) {
  const eyebrow = data.eyebrow || "OUR VISION";
  const title = data.heading || data.title || "Carving Indian Heritage for the World";
  const rawImage = data.imageSrc || "/images/collections/temples-architectural.webp";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const lead = data.leadQuote || "Our vision is to serve as the global bridge for master Indian stonework — showcasing centuries of hand-carved heritage while creating art that finds its place in spiritual spaces, luxury residences, and public monuments across the world.";
  const sub = data.subcopy || "We partner with architects, interior designers, temple trusts, and private collectors who value raw material integrity, ancestral craftsmanship, and flawless execution.";

  return (
    <section className={styles.futureSection} aria-label="Our Vision">
      <Container>
        <div className={styles.futureGrid}>
          {/* Left Vision Content */}
          <div className={styles.futureContent}>
            <ScrollReveal animation="fade-up">
              <span className={styles.futureEyebrow}>{eyebrow}</span>
              <h2 className={styles.futureTitle}>{title}</h2>
              <div className={styles.ornamentDividerLeft} aria-hidden="true">✦</div>
              
              <p className={styles.futureLead}>
                &ldquo;{lead}&rdquo;
              </p>
              
              <p className={styles.futureSub}>
                {sub}
              </p>
            </ScrollReveal>
          </div>

          {/* Right Heritage Architecture Photo */}
          <div className={styles.futureVisual}>
            <ScrollReveal animation="fade-up" delay={150}>
              <div className={styles.futureImageFrame}>
                <Image
                  src={imageSrc}
                  alt="Carved sandstone chhatri pavilion representing Indian stonecraft heritage"
                  fill
                  sizes="(max-width: 991px) 100vw, 45vw"
                  className={styles.futureImage}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
