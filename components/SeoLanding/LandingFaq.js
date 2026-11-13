import Container from "@/components/Container/Container";
import styles from "./LandingFaq.module.css";

export default function LandingFaq({
  id = "faq",
  eyebrow = "Knowledge & Buying Guidance",
  title = "Frequently Asked Questions",
  description = "Essential questions answered regarding stone authenticity, custom commissions, Vastu guidelines, and safe worldwide delivery.",
  faqs = []
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section id={id} className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>

        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <details key={idx} className={styles.faqItem} open={idx === 0}>
              <summary className={styles.faqQuestion}>
                <span>{faq.question}</span>
                <span className={styles.faqIcon} aria-hidden="true">+</span>
              </summary>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
