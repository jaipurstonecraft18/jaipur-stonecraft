import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

export default function StoryLineageSection({ data = {} }) {
  const badge = data.badge || "OUR HERITAGE";
  const heading = data.heading || "Passing Down the Chisel";
  const rawImage = data.imageSrc || "/images/craftsmanship/step-02-shape-precision.jpg";
  const imageSrc = getImageVariantUrl(rawImage, "display") || rawImage;
  const pullQuote = data.pullQuote || "It never was, nor will be, only about time. It knows not the material gain. Actually, true beauty speaks when a true master crafts every stroke of the hammer.";
  const p1 = data.paragraph1 || "In the historic stone hubs of Rajasthan, hand carving is far more than an occupation — it is an oral lineage passed down from master to apprentice across generations.";
  const p2 = data.paragraph2 || "For decades, our family carved sacred deity idols, temple arches, sandstone jali lattices, screens, and palace facades for royal trusts and noble patrons throughout Jaipur, Makrana, and Bharatpur.";
  const p3 = data.paragraph3 || "This generational foundation taught us how to select stones, how raw blocks are sculpted into human expressions, and everything where marble and bliss converge. The physical mastery of manual chiseling remains the beating heart of our work today.";

  return (
    <section className={styles.lineageSection} aria-label="Our Heritage">
      <Container>
        <div className={styles.lineageGrid}>
          {/* Left Image: Artisan Chiseling Stone */}
          <div className={styles.lineageVisual}>
            <ScrollReveal animation="fade-up">
              <div className={styles.lineageImageFrame}>
                <Image
                  src={imageSrc}
                  alt="Master artisan hands chiseling white marble block in Jaipur atelier"
                  fill
                  sizes="(max-width: 991px) 100vw, 45vw"
                  className={styles.lineageImage}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Right Editorial Story */}
          <div className={styles.lineageContent}>
            <ScrollReveal animation="fade-up" delay={150}>
              <span className={styles.sectionChapterBadge}>{badge}</span>
              <h2 className={styles.sectionHeading}>{heading}</h2>
              
              <div className={styles.lineageBody}>
                <p>{p1}</p>
                <p>{p2}</p>

                {/* Italic Quote Box */}
                {pullQuote && (
                  <div className={styles.pullQuoteBox}>
                    &ldquo;{pullQuote}&rdquo;
                  </div>
                )}

                <p>{p3}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
