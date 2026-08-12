import Container from "@/components/Container/Container";
import Section from "@/components/Section/Section";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionHeading from "@/components/SectionHeading/SectionHeading";
import ContactForm from "@/components/ContactForm/ContactForm";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { siteConfig } from "@/content/site";
import styles from "./page.module.css";

export const metadata = {
  title: "Contact Our Office — Jaipur Stonecraft",
  description: "Request a custom pricing quote, discuss architectural stone scales, or arrange marble quarry samples shipment with our Jaipur studio.",
  alternates: {
    canonical: "https://jaipurstonecraft.com/contact",
  },
  openGraph: {
    title: "Contact Our Office — Jaipur Stonecraft",
    description: "Request a custom pricing quote, discuss architectural stone scales, or arrange marble quarry samples shipment with our Jaipur studio.",
    url: "https://jaipurstonecraft.com/contact",
    siteName: "Jaipur Stonecraft",
    type: "website",
    images: [
      {
        url: "https://placehold.co/1200x630/E8E4DF/1A1918?text=Contact+Jaipur+Stonecraft",
        width: 1200,
        height: 630,
        alt: "Contact Jaipur Stonecraft",
      },
    ],
  },
};

export default function Contact() {
  const { phone, email, whatsapp, whatsappLink, address } = siteConfig.contact;

  return (
    <Section background="light" spacing="standard" className="page-offset">
      <Container>
        <Breadcrumbs items={[{ label: "Contact" }]} />

        <ScrollReveal animation="fade-up">
          <SectionHeading
            eyebrow="Get In Touch"
            heading="Contact Our Jaipur Office"
            description="Whether you need a custom-carved temple structure or are planning a residential landscape fountain, our design coordinators are ready to help."
            headingLevel="h1"
          />
        </ScrollReveal>

        <div className={styles.grid}>
          {/* Left Column: Contact Channels */}
          <ScrollReveal animation="fade-up" className={styles.infoCol}>
            <div className={styles.channelGroup}>
              <h3 className={styles.channelTitle}>Direct Channels</h3>
              
              <div className={styles.channel}>
                <span className={styles.icon}>✉</span>
                <div>
                  <span className={styles.label}>Email Address</span>
                  <a href={`mailto:${email}`} className={styles.link}>
                    {email}
                  </a>
                </div>
              </div>

              <div className={styles.channel}>
                <span className={styles.icon}>📞</span>
                <div>
                  <span className={styles.label}>Phone Number</span>
                  <a href={`tel:${phone}`} className={styles.link}>
                    {phone}
                  </a>
                </div>
              </div>

              <div className={styles.channel}>
                <span className={styles.icon}>💬</span>
                <div>
                  <span className={styles.label}>WhatsApp Chat</span>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    {whatsapp}
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.channelGroup}>
              <h3 className={styles.channelTitle}>Atelier Studio Location</h3>
              <div className={styles.channel}>
                <span className={styles.icon}>📍</span>
                <div>
                  <span className={styles.label}>Jaipur Address</span>
                  <p className={styles.addressText}>{address}</p>
                </div>
              </div>
            </div>

            <div className={styles.businessCard}>
              <h4>Atelier Hours</h4>
              <p className="small">
                Our workshop operates Monday through Saturday, 9:00 AM to 6:00 PM (IST). Technical drawing reviews and custom estimations are coordinated directly with our carving leads.
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: General Inquiry Form */}
          <ScrollReveal animation="fade-up" delay={150} className={styles.formCol}>
            <div className={styles.formCard}>
              <h3 className={styles.formTitle}>Send an Inquiry</h3>
              <ContactForm formType="general" />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </Section>
  );
}
