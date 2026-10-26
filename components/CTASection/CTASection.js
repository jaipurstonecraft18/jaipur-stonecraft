import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton/SecondaryButton";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { siteConfig } from "@/content/site";
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
  const directPhoneHref = `tel:${(siteConfig?.contact?.phone || "+91 9664388920").replace(/\s+/g, "")}`;

  const isQuoteOrInquiry = (text = "", href = "") => {
    const t = String(text || "").toLowerCase();
    const h = String(href || "").toLowerCase();
    return (
      t.includes("quote") ||
      t.includes("inquire") ||
      t.includes("enquire") ||
      h.includes("type=quote")
    );
  };

  const finalPrimaryText = isQuoteOrInquiry(primaryCtaText, primaryCtaHref) ? "Call Now" : primaryCtaText;
  const finalPrimaryHref = isQuoteOrInquiry(primaryCtaText, primaryCtaHref) ? directPhoneHref : primaryCtaHref;

  const finalSecondaryText = isQuoteOrInquiry(secondaryCtaText, secondaryCtaHref) ? "Call Now" : secondaryCtaText;
  const finalSecondaryHref = isQuoteOrInquiry(secondaryCtaText, secondaryCtaHref) ? directPhoneHref : secondaryCtaHref;

  return (
    <Section background={background} spacing="large">
      <Container>
        <ScrollReveal animation="fade-up">
          <div className={styles.content}>
            <h2 className={styles.heading}>{heading}</h2>
            {description && <p className={`large ${styles.description}`}>{description}</p>}
            <div className={styles.actions}>
              {finalPrimaryText && finalPrimaryHref && (
                <PrimaryButton
                  href={finalPrimaryHref}
                  variant={background === "dark" ? "bronze" : "charcoal"}
                  aria-label={finalPrimaryText === "Call Now" ? `Call Now: Jaipur Stonecraft at ${siteConfig.contact.phone}` : undefined}
                >
                  {finalPrimaryText}
                </PrimaryButton>
              )}
              {finalSecondaryText && finalSecondaryHref && (
                <SecondaryButton
                  href={finalSecondaryHref}
                  variant={background === "dark" ? "cream" : "charcoal"}
                  aria-label={finalSecondaryText === "Call Now" ? `Call Now: Jaipur Stonecraft at ${siteConfig.contact.phone}` : undefined}
                >
                  {finalSecondaryText}
                </SecondaryButton>
              )}
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </Section>
  );
}
