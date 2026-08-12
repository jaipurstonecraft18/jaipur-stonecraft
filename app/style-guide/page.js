"use client";

import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton/SecondaryButton";
import TextLink from "@/components/TextLink/TextLink";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./page.module.css";

export default function StyleGuide() {
  return (
    <>
      {/* 1. HEADER SECTION (Light background) */}
      <Section background="light" spacing="standard">
        <Container>
          <header className={styles.guideHeader}>
            <span className="eyebrow">Design System Spec</span>
            <h1>Jaipur Stonecraft Style Guide</h1>
            <p className="large" style={{ marginTop: "1rem", color: "rgba(26, 25, 24, 0.7)" }}>
              Core typography scale, color variables, spacing primitives, buttons, and animations.
            </p>
          </header>

          <div className={styles.grid}>
            
            {/* Color Palette Sub-Section */}
            <div className={styles.subSection}>
              <h2 className={styles.subSectionTitle}>1. Color Palette</h2>
              <div className={styles.swatchGrid}>
                
                <div className={styles.swatchCard}>
                  <div className={styles.swatchColor} style={{ backgroundColor: "#1A1918" }} />
                  <div className={styles.swatchDetails}>
                    <h4>Charcoal Black</h4>
                    <p>#1A1918</p>
                    <p>--color-charcoal</p>
                  </div>
                </div>

                <div className={styles.swatchCard}>
                  <div className={styles.swatchColor} style={{ backgroundColor: "#FCFBF9", border: "1px solid #E8E4DF" }} />
                  <div className={styles.swatchDetails}>
                    <h4>Warm Cream</h4>
                    <p>#FCFBF9</p>
                    <p>--color-cream</p>
                  </div>
                </div>

                <div className={styles.swatchCard}>
                  <div className={styles.swatchColor} style={{ backgroundColor: "#9E7B4F" }} />
                  <div className={styles.swatchDetails}>
                    <h4>Champagne Bronze</h4>
                    <p>#9E7B4F</p>
                    <p>--color-bronze</p>
                  </div>
                </div>

                <div className={styles.swatchCard}>
                  <div className={styles.swatchColor} style={{ backgroundColor: "#E8E4DF" }} />
                  <div className={styles.swatchDetails}>
                    <h4>Raw Stone Grey</h4>
                    <p>#E8E4DF</p>
                    <p>--color-stone-grey</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Typography Scale Sub-Section */}
            <div className={styles.subSection}>
              <h2 className={styles.subSectionTitle}>2. Typography</h2>
              <div className={styles.typoList}>
                
                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Heading 1</span>
                  <h1>Generational Stone Art</h1>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Heading 2</span>
                  <h2>Sacred & Custom Sculptures</h2>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Heading 3</span>
                  <h3>Architectural Elements & Jali</h3>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Heading 4</span>
                  <h4>Luxury Stone Objects</h4>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Body Large</span>
                  <p className="large">
                    This is body large text, designed for introductions, subheaders, and editorial statements that need breathing room.
                  </p>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Body Regular</span>
                  <p>
                    This is standard body copy. It is designed using Inter, which provides clean, highly legible presentation for technical specifications, descriptions, and story paragraphs.
                  </p>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Body Small</span>
                  <p className="small">
                    This is small body copy. It is used for captions, details, dimensions, materials, and secondary meta statements.
                  </p>
                </div>

                <div className={styles.typoRow}>
                  <span className={styles.typoLabel}>Eyebrow Label</span>
                  <span className="eyebrow" style={{ margin: 0 }}>
                    Generational Craftsmanship
                  </span>
                </div>

              </div>
            </div>

            {/* Interactive Components / Buttons Sub-Section */}
            <div className={styles.subSection}>
              <h2 className={styles.subSectionTitle}>3. Interactive Primitives</h2>
              <div className={styles.buttonShowcase}>
                
                {/* Light Background Showcase */}
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Light Context Buttons</h3>
                  <div className={styles.buttonGroup}>
                    <PrimaryButton variant="charcoal">
                      Primary Charcoal
                    </PrimaryButton>
                    <PrimaryButton variant="bronze">
                      Primary Bronze
                    </PrimaryButton>
                    <SecondaryButton variant="charcoal">
                      Secondary Charcoal
                    </SecondaryButton>
                    <SecondaryButton variant="bronze">
                      Secondary Bronze
                    </SecondaryButton>
                    <TextLink href="#" arrow>
                      Text Link
                    </TextLink>
                  </div>
                </div>

                {/* Dark Background Showcase */}
                <div className={styles.darkBox}>
                  <div className={styles.darkBoxTitle}>Dark Context Buttons</div>
                  <div className={styles.buttonGroup}>
                    <PrimaryButton variant="cream">
                      Primary Cream
                    </PrimaryButton>
                    <PrimaryButton variant="bronze">
                      Primary Bronze
                    </PrimaryButton>
                    <SecondaryButton variant="cream">
                      Secondary Cream
                    </SecondaryButton>
                    <SecondaryButton variant="bronze">
                      Secondary Bronze
                    </SecondaryButton>
                    <TextLink href="#" arrow style={{ color: "var(--color-cream)" }}>
                      Text Link Cream
                    </TextLink>
                  </div>
                </div>

              </div>
            </div>

            {/* Layout Systems & Spacing Sub-Section */}
            <div className={styles.subSection}>
              <h2 className={styles.subSectionTitle}>4. Spacing & Container Primitives</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                
                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Responsive Container (Max 1280px)</h3>
                  <div className={styles.layoutOutline}>
                    Content inside the Container component aligns horizontally and maintains padding boundaries.
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Spacing Tokens Scale</h3>
                  <div className={styles.spacingDemo}>
                    <div className={styles.spacingBar} style={{ width: "20%" }}>XS (0.5rem / 8px)</div>
                    <div className={styles.spacingBar} style={{ width: "40%" }}>SM (1rem / 16px)</div>
                    <div className={styles.spacingBar} style={{ width: "60%" }}>MD (1.5rem / 24px)</div>
                    <div className={styles.spacingBar} style={{ width: "80%" }}>LG (2rem / 32px)</div>
                    <div className={styles.spacingBar} style={{ width: "100%" }}>XL (3rem / 48px)</div>
                  </div>
                </div>

              </div>
            </div>

            {/* Animations Reveal Sub-Section */}
            <div className={styles.subSection}>
              <h2 className={styles.subSectionTitle}>5. Micro-Animations (Scroll Reveal)</h2>
              <p className="small" style={{ marginBottom: "1.5rem" }}>
                Scroll down or refresh the page to see the viewport entry animation utilities. Respects user motion preferences.
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                
                <ScrollReveal animation="fade" delay={100}>
                  <div style={{ padding: "1.5rem", border: "1px solid var(--color-stone-grey)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Fade Reveal</h4>
                    <p className="small">Triggered with opacity transitioning from 0 to 1.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-up" delay={200}>
                  <div style={{ padding: "1.5rem", border: "1px solid var(--color-stone-grey)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Fade-Up Reveal</h4>
                    <p className="small">Translates y-axis position upward with simultaneous opacity transition.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade-scale" delay={300}>
                  <div style={{ padding: "1.5rem", border: "1px solid var(--color-stone-grey)", backgroundColor: "rgba(0,0,0,0.01)" }}>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Fade-Scale Reveal</h4>
                    <p className="small">Gently scales up from 0.96 with opacity fade.</p>
                  </div>
                </ScrollReveal>

              </div>
            </div>

          </div>
        </Container>
      </Section>

      {/* 2. SECTION SPACE DEMO (Grey background, standard spacing) */}
      <Section background="grey" spacing="standard">
        <Container>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Section Spacing Demo: Grey standard</h2>
          <p>
            This section uses the <code>{"background=\"grey\""}</code> and <code>{"spacing=\"standard\""}</code> presets. It provides clean containment with a default vertical padding based on responsive section clamp rules.
          </p>
        </Container>
      </Section>

      {/* 3. SECTION SPACE DEMO (Dark background, large spacing) */}
      <Section background="dark" spacing="large">
        <Container style={{ textAlign: "center" }}>
          <span className="eyebrow" style={{ color: "var(--color-bronze)" }}>Editorial Layout</span>
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Section Spacing Demo: Dark large</h2>
          <p style={{ maxWidth: "700px", margin: "0 auto 2rem" }}>
            This section uses the <code>{"background=\"dark\""}</code> and <code>{"spacing=\"large\""}</code> presets. Large spacing increases section padding by 1.5x, creating standard luxury editorial breathing room on larger screens.
          </p>
          <PrimaryButton variant="cream" href="/">
            Back to Home
          </PrimaryButton>
        </Container>
      </Section>
    </>
  );
}
