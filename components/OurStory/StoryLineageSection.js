import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { getImageVariantUrl } from "@/lib/utils/image-utils.js";
import styles from "./OurStory.module.css";

const defaultMilestones = [
  {
    tag: "3+ GENERATIONS",
    title: "Generations of Family Craft",
    desc: "A family lineage rooted in Rajasthan, working with authentic Makrana white marble and regional sandstones.",
    imageSrc: "/images/brand/heritage-ganesha.webp"
  },
  {
    tag: "HAND TO HAND",
    title: "Passed Down Through Hands",
    desc: "Traditional carving knowledge, sacred stone sculpting, and manual chiseling skills carried forward across generations.",
    imageSrc: "/images/collections/custom.webp"
  },
  {
    tag: "LIVING ATELIER",
    title: "The Workshop Today",
    desc: "Our Jaipur atelier continues this living tradition, carving sacred deity murties, architectural stonework, and custom pieces.",
    imageSrc: "/images/collections/hero-sculptures-group.webp"
  }
];

export default function StoryLineageSection({ data = {} }) {
  const chapter = data.chapter || "CHAPTER 02";
  const heading = data.heading || "A Craft Passed Hand to Hand";
  const narrative = data.paragraph1 || "For more than three generations, our family and artisans have carried forward the knowledge, skills and values of traditional stonecraft — learning not just techniques, but a way of seeing, feeling and respecting stone.";
  const linkText = data.linkText || "Our Heritage";
  const linkHref = data.linkHref || "/craftsmanship";
  const milestones = Array.isArray(data.milestones) && data.milestones.length > 0 ? data.milestones : defaultMilestones;

  return (
    <section id="chapter-02" className={styles.lineageSection} aria-label="Chapter 02: A Craft Passed Hand to Hand">
      <Container>
        {/* Editorial Story Header */}
        <div className={styles.lineageHeaderLayout}>
          <div className={styles.lineageIntroCol}>
            <ScrollReveal animation="fade-up">
              <span className={styles.chapterEyebrow}>{chapter}</span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={80}>
              <h2 className={styles.chapterHeading}>{heading}</h2>
            </ScrollReveal>
          </div>

          <div className={styles.lineageIntroCol}>
            <ScrollReveal animation="fade-up" delay={120}>
              <p className={styles.chapterText}>{narrative}</p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={160}>
              <Link href={linkHref} className={styles.editorialLink}>
                <span>{linkText}</span>
                <span className={styles.editorialLinkArrow} aria-hidden="true">&rarr;</span>
              </Link>
            </ScrollReveal>
          </div>
        </div>

        {/* Desktop 3-Pillar Horizontal Heritage Grid */}
        <div className={styles.lineageCardsGrid}>
          {milestones.map((item, idx) => {
            const rawImg = item.imageSrc || defaultMilestones[idx % defaultMilestones.length].imageSrc;
            const imgSrc = getImageVariantUrl(rawImg, "display") || rawImg;

            return (
              <ScrollReveal key={item.tag || idx} animation="fade-up" delay={idx * 80}>
                <div className={styles.lineageCard}>
                  <div className={styles.lineageCardThumb}>
                    <Image
                      src={imgSrc}
                      alt={item.imageAlt || `${item.tag} - ${item.title}`}
                      fill
                      unoptimized
                      sizes="(max-width: 991px) 100vw, 33vw"
                      className={styles.lineageCardImage}
                    />
                  </div>
                  <div className={styles.lineageCardMeta}>
                    <span className={styles.lineageCardTag}>{item.tag}</span>
                    <h3 className={styles.lineageCardTitle}>{item.title}</h3>
                    <p className={styles.lineageCardDesc}>{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Mobile Vertical Connected Timeline */}
        <div className={styles.mobileLineageTimeline}>
          {milestones.map((item, idx) => (
            <div key={item.tag || idx} className={styles.mobileTimelineNode}>
              <div className={styles.mobileTimelineDot} aria-hidden="true" />
              <span className={styles.mobileTimelineTag}>{item.tag}</span>
              <h3 className={styles.mobileTimelineTitle}>{item.title}</h3>
              <p className={styles.mobileTimelineDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
