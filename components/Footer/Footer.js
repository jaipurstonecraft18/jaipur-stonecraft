import Link from "next/link";
import Container from "@/components/Container/Container";
import { siteConfig } from "@/content/site";
import styles from "./Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          {/* Column 1: Brand Info */}
          <div className={styles.colBrand}>
            <Link href="/" className={styles.logo} aria-label="Jaipur Stonecraft Home">
              JAIPUR STONECRAFT
            </Link>
            <p className={styles.brandDesc}>
              {siteConfig.description}
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className={styles.colNav}>
            <h4 className={styles.colTitle}>Explore</h4>
            <ul className={styles.linkList}>
              {siteConfig.navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Collections links */}
          <div className={styles.colNav}>
            <h4 className={styles.colTitle}>Collections</h4>
            <ul className={styles.linkList}>
              {siteConfig.collections.map((item, idx) => (
                <li key={`${item.label}-${idx}`}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Social Info */}
          <div className={styles.colContact}>
            <h4 className={styles.colTitle}>Inquiries</h4>
            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>Email:</span>{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className={styles.link}>
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <span className={styles.contactLabel}>Phone:</span>{" "}
                <a href={`tel:${siteConfig.contact.phone}`} className={styles.link}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <span className={styles.contactLabel}>Address:</span>{" "}
                <span className={styles.contactText}>{siteConfig.contact.address}</span>
              </li>
            </ul>
            <div className={styles.socials}>
              <a
                href={siteConfig.contact.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Instagram"
              >
                Instagram
              </a>
              <span className={styles.divider}>•</span>
              <a
                href={siteConfig.contact.pinterest}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label="Follow us on Pinterest"
              >
                Pinterest
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className={styles.bottomRow}>
          <p className={styles.copyright}>
            © {currentYear} Jaipur Stonecraft. All rights reserved.
          </p>
          <ul className={styles.legalList}>
            {siteConfig.legal.map((item, idx) => (
              <li key={`${item.label}-${idx}`}>
                <Link href={item.href} className={styles.legalLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
