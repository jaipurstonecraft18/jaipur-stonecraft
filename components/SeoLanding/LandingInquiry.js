"use client";

import { useState } from "react";
import Container from "@/components/Container/Container";
import styles from "./LandingInquiry.module.css";

export default function LandingInquiry({
  id = "custom-inquiry",
  eyebrow = "Commission & Consult",
  title = "Inquire About a Handcrafted Marble Statue",
  description = "Speak directly with our Jaipur atelier. Share your sanctuary dimensions, desired posture, and material preference for personalized advisory and quotation.",
  landingPageName = "Marble Statue Inquiry",
  defaultMarble = "Makrana Pure White Marble"
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dimensions: "",
    marbleType: defaultMarble,
    sanctuaryType: "Home Mandir",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const compiledMessage = `[SEO Landing: ${landingPageName}]
Sanctuary Type: ${formData.sanctuaryType}
Requested Dimensions: ${formData.dimensions || "Not specified"}
Marble Preference: ${formData.marbleType}
Client Notes: ${formData.message || "General custom inquiry"}`;

      const res = await fetch("/api/admin/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          inquiryType: (landingPageName ? landingPageName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "seo-landing"),
          message: compiledMessage
        })
      });

      if (!res.ok) {
        throw new Error("Unable to send inquiry at this moment.");
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Something went wrong. Please reach out via WhatsApp or call us directly at +91 8690471802.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const waPrefill = encodeURIComponent(
    `Hello Jaipur Stonecraft, I am inquiring from the ${landingPageName} page regarding a custom handcrafted statue.`
  );

  return (
    <section id={id} className={styles.sectionWrapper}>
      <Container>
        <div className={styles.headerWrapper}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h2 className={styles.sectionTitle}>{title}</h2>
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </div>

        <div className={styles.containerGrid}>
          {/* Main Form */}
          <div className={styles.formCard}>
            {isSuccess ? (
              <div className={styles.successCard}>
                <div className={styles.successIcon}>✓</div>
                <h3 className={styles.successTitle}>Inquiry Received</h3>
                <p className={styles.successText}>
                  Thank you for contacting Jaipur Stonecraft. Our master artisan coordination team will review your specifications and contact you within 24 hours with dimension guidance and stone availability.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. Ramesh Patel"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">Phone / WhatsApp *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="name@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="dimensions">Desired Height / Sizing</label>
                  <input
                    id="dimensions"
                    name="dimensions"
                    type="text"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="e.g. 18 inches / 2.5 feet / 4 feet"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="marbleType">Marble Selection</label>
                  <select
                    id="marbleType"
                    name="marbleType"
                    value={formData.marbleType}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Makrana Pure White Marble">Makrana Pure White Marble (Sangemarmar)</option>
                    <option value="Black Bhainslana Marble">Black Bhainslana Marble</option>
                    <option value="Super White Vietnam Marble">Super White Vietnam Marble</option>
                    <option value="Not Sure / Need Advice">Not Sure / Require Artisan Advice</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="sanctuaryType">Sanctuary Placement</label>
                  <select
                    id="sanctuaryType"
                    name="sanctuaryType"
                    value={formData.sanctuaryType}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Home Mandir">Home Mandir / Residential Shrine</option>
                    <option value="Temple Trust / Public Mandir">Public Temple / Community Mandir</option>
                    <option value="Architectural Foyer / Lobby">Architectural Foyer / Cultural Art Space</option>
                    <option value="Garden Sanctuary">Garden / Outdoor Pavilion</option>
                  </select>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label} htmlFor="message">Specific Posture, Mudra or Custom Details</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Describe desired pose, dimensions, decorative gold-finish detailing, or specific project requirements..."
                  />
                </div>

                {errorMessage && (
                  <div className={`${styles.fullWidth} ${styles.errorText}`}>
                    {errorMessage}
                  </div>
                )}

                <div className={styles.fullWidth}>
                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? "Submitting Inquiry..." : "Submit Custom Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className={styles.sidebar}>
            <a
              href={`https://wa.me/918690471802?text=${waPrefill}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBanner}
            >
              <div>
                <div className={styles.waTitle}>Direct WhatsApp Consultation</div>
                <div className={styles.waSub}>Chat with master sculptors • Instant photos & sizing</div>
              </div>
              <svg className={styles.waIconLarge} viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.088-1.78-.387-1.393-.578-2.316-1.996-2.385-2.088-.07-.092-.563-.748-.563-1.425 0-.677.355-1.01.482-1.147.127-.137.28-.173.373-.173.093 0 .186.002.267.006.085.004.199-.033.31.233.116.279.395.962.43 1.031.034.07.057.151.011.242-.046.091-.07.148-.139.229-.07.081-.147.18-.21.242-.07.07-.143.146-.062.285.081.139.36 5.95 1.056 1.215.892.795 1.644 1.042 1.877 1.157.232.115.367.098.503-.058.136-.157.58-.675.736-.907.156-.232.311-.194.524-.115.213.08 1.353.638 1.586.754.233.116.388.174.446.272.058.098.058.568-.086.973z"/>
              </svg>
            </a>

            <div className={styles.atelierCard}>
              <h3 className={styles.atelierTitle}>Jaipur Stonecraft Atelier</h3>
              <p className={styles.atelierText}>
                Generational stonecraft studio and export facility based in Jaipur, Rajasthan. Serving private collectors, architects, and temples across India and worldwide.
              </p>
              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <span>📍</span>
                  <span>Kartarpura, Gopal Pura Mode, Jaipur, Rajasthan 302015</span>
                </li>
                <li className={styles.contactItem}>
                  <span>📞</span>
                  <a href="tel:+918690471802" className={styles.contactLink}>+91 8690471802</a>
                </li>
                <li className={styles.contactItem}>
                  <span>✉️</span>
                  <a href="mailto:Jaipurstonecraft18@gmail.com" className={styles.contactLink}>Jaipurstonecraft18@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
