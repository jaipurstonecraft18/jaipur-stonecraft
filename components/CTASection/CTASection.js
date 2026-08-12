import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton/SecondaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./CTASection.module.css";

export default function CTASection({
  heading,
  description,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
  background = "dark",
}) {
  return (
    <Section background={background} spacing="large">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.content}>
            <h2 className={styles.heading}>{heading}</h2>
            {description && <p className={`large ${styles.description}`}>{description}</p>}
            <div className={styles.actions}>
              {primaryCtaText && primaryCtaHref && (
                <PrimaryButton
                  href={primaryCtaHref}
                  variant={background === "dark" ? "bronze" : "charcoal"}
                >
                  {primaryCtaText}
                </PrimaryButton>
              )}
              {secondaryCtaText && secondaryCtaHref && (
                <SecondaryButton
                  href={secondaryCtaHref}
                  variant={background === "dark" ? "cream" : "charcoal"}
                >
                  {secondaryCtaText}
                </SecondaryButton>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
