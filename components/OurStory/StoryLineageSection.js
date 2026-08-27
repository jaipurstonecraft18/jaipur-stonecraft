import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./OurStory.module.css";

export default function StoryLineageSection() {
  return (
    <section className={styles.lineageSection} aria-label="Our Heritage">
      <Container>
        <div className={styles.lineageGrid}>
          {/* Left Image: Artisan Chiseling Stone */}
          <div className={styles.lineageVisual}>
            <ScrollReveal animation="fade-up">
              <div className={styles.lineageImageFrame}>
                <Image
                  src="/images/craftsmanship/step-02-shape-precision.jpg"
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
              <span className={styles.sectionChapterBadge}>OUR HERITAGE</span>
              <h2 className={styles.sectionHeading}>Passing Down the Chisel</h2>
              
              <div className={styles.lineageBody}>
                <p>
                  In the historic stone hubs of Rajasthan, hand carving is far more than an occupation — 
                  it is an oral lineage passed down from master to apprentice across generations.
                </p>
                <p>
                  For decades, our family carved sacred deity idols, temple arches, sandstone jali lattices, 
                  screens, and palace facades for royal trusts and noble patrons throughout Jaipur, Makrana, and Bharatpur.
                </p>

                {/* Italic Quote Box */}
                <div className={styles.pullQuoteBox}>
                  &ldquo;It never was, nor will be, only about time. It knows not the material gain. 
                  Actually, true beautiful speaks when true master every stroke of the hammer.&rdquo;
                </div>

                <p>
                  This generational foundation taught us how to select stones, how raw blocks are sculpted 
                  into human expressions, and everything where marble and bliss converge. The physical mastery 
                  of manual chiseling remains the beating heart of our work today.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
