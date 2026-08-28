"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container/Container";
import HeaderSearchDropdown from "@/components/Search/HeaderSearchDropdown";
import { siteConfig } from "@/content/site";
import styles from "./Header.module.css";

// Collections Dropdown Data (Real Level-1 Collections)
const collectionsDropdownItems = [
  {
    title: "Sculptures & Statues",
    href: "/collections/sculptures-statues",
    description: "Hand-carved deity idols, divine statues, human portraits & art busts",
  },
  {
    title: "Wall Art & Reliefs",
    href: "/collections/wall-art-reliefs",
    description: "Spiritual stone wall murals & architectural reliefs carved in high relief",
  },
  {
    title: "Temples & Architectural Stonework",
    href: "/collections/temples-architectural-stonework",
    description: "Custom marble home mandirs, temple arches & masonic stone pillars",
  },
  {
    title: "Fountains & Water Features",
    href: "/collections/fountains-water-features",
    description: "Classical tiered stone fountains & courtyard lotus basins",
  },
  {
    title: "Decorative Stone Art",
    href: "/collections/decorative-stone-art",
    description: "Carved stone planters, pedestals & luxury architectural decor",
  },
  {
    title: "Custom & Bespoke Creations",
    href: "/collections/custom-bespoke-creations",
    description: "Commission custom dimensional carvings from blueprints & sketches",
  },
];

export default function Header({ theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'collections' | null
  const [mobileAccordion, setMobileAccordion] = useState({ collections: false });
  const hoverTimer = useRef(null);

  const [socialState, setSocialState] = useState({
    instagram: siteConfig.social?.instagram || "https://instagram.com/jaipurstonecraft",
    facebook: siteConfig.social?.facebook || "https://facebook.com/jaipurstonecraft",
    pinterest: siteConfig.social?.pinterest || "https://pinterest.com/jaipurstonecraft",
    youtube: siteConfig.social?.youtube || "https://youtube.com/@jaipurstonecraft",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.social_links) {
          const s = data.settings.social_links;
          setSocialState({
            instagram: s.instagram || siteConfig.social?.instagram,
            facebook: s.facebook || siteConfig.social?.facebook,
            pinterest: s.pinterest || siteConfig.social?.pinterest,
            youtube: s.youtube || siteConfig.social?.youtube,
          });
        }
      })
      .catch(() => {});
  }, []);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile drawer and dropdowns on navigation
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsOpen(false);
    setIsSearchOpen(false);
    setActiveDropdown(null);
  }

  // Auto-theme resolver: transparent for homepage, light for inner pages
  const headerTheme = theme || (pathname === "/" ? "transparent" : "light");
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll to transition header styling smoothly
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Mouse Enter/Leave Handlers with timer buffer for smooth transitions
  const handleMouseEnter = (name) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const toggleMobileAccordion = (key) => {
    setMobileAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const headerClass = `${styles.header} ${styles[headerTheme]} ${isScrolled ? styles.scrolled : ""} ${isOpen ? styles.menuOpen : ""}`;

  return (
    <>
      <header className={headerClass}>
        {/* 1. TOP UTILITY BAR */}
        <div className={styles.utilityBar}>
          <Container className={styles.utilityContainer}>
            <div className={styles.utilityLeft}>
              <span>Handcrafted in Jaipur, India</span>
              <span className={styles.utilityDot}>•</span>
              <span>Generational Craftsmanship</span>
              <span className={styles.utilityDot}>•</span>
              <span>Worldwide Delivery</span>
            </div>

            <div className={styles.utilityRight}>
              <a href={`tel:${siteConfig.contact.phone}`} className={styles.utilityLink} aria-label={`Call us at ${siteConfig.contact.phone}`}>
                {siteConfig.contact.phone}
              </a>
              <span className={styles.utilityDot}>•</span>
              <div className={styles.utilitySocials} aria-label="Social media links">
                <a
                  href={socialState.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.utilitySocialLink}
                  aria-label="Jaipur Stonecraft on Instagram"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a
                  href={socialState.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.utilitySocialLink}
                  aria-label="Jaipur Stonecraft on Facebook"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href={socialState.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.utilitySocialLink}
                  aria-label="Jaipur Stonecraft on Pinterest"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 3.99-.28 1.19.6 2.16 1.78 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.86-2.06-4.87-5.01-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.39 2.14.89 2.74.1.12.11.23.08.35-.09.37-.29 1.2-.33 1.36-.05.23-.17.27-.4.17-1.5-.69-2.44-2.88-2.44-4.65 0-3.78 2.75-7.25 7.92-7.25 4.16 0 7.39 2.97 7.39 6.92 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.76-1.38l-.75 2.85c-.27 1.05-1 2.35-1.5 3.15 1.12.34 2.31.53 3.55.53 6.61 0 11.99-5.37 11.99-12C24 5.37 18.63 0 12 0z"/>
                  </svg>
                </a>
                <a
                  href={socialState.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.utilitySocialLink}
                  aria-label="Jaipur Stonecraft on YouTube"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </Container>
        </div>

        {/* 2. MAIN NAVIGATION BAR */}
        <div className={styles.mainNavWrapper}>
          <Container className={styles.navContainer}>
            {/* ZONE 1: Left - Brand Logo */}
            <Link href="/" className={styles.logo} aria-label="Jaipur Stonecraft Home">
              <svg className={styles.logoIcon} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" fill="var(--color-bronze)" fillOpacity="0.25" stroke="var(--color-bronze)"/>
                <circle cx="12" cy="12" r="3" fill="var(--color-bronze)"/>
              </svg>
              <span>JAIPUR STONECRAFT</span>
            </Link>

            {/* ZONE 2: Center - Main Navigation (Exactly 5 Items) */}
            <nav className={styles.desktopNav} aria-label="Desktop Navigation">
              <ul className={styles.navList}>
                {/* 1st: Home */}
                <li>
                  <Link href="/" className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}>
                    Home
                  </Link>
                </li>

                {/* 2nd: Collections ⌄ */}
                <li
                  className={`${styles.navItemHasDropdown} ${activeDropdown === "collections" ? styles.dropdownOpen : ""}`}
                  onMouseEnter={() => handleMouseEnter("collections")}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href="/collections"
                    className={`${styles.navLink} ${pathname.startsWith("/collections") ? styles.active : ""}`}
                    aria-expanded={activeDropdown === "collections"}
                    aria-haspopup="true"
                  >
                    <span>Collections</span>
                    <span className={styles.dropdownCaret} aria-hidden="true">&#9662;</span>
                  </Link>
                  <div
                    className={`${styles.dropdownPanel} ${activeDropdown === "collections" ? styles.show : ""}`}
                    onMouseEnter={() => handleMouseEnter("collections")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={styles.dropdownGrid}>
                      {collectionsDropdownItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={styles.dropdownItem}
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className={styles.dropdownItemTitle}>{sub.title}</span>
                          <span className={styles.dropdownItemDesc}>{sub.description}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>

                {/* 3rd: Craftsmanship */}
                <li>
                  <Link href="/craftsmanship" className={`${styles.navLink} ${pathname.startsWith("/craftsmanship") ? styles.active : ""}`}>
                    Craftsmanship
                  </Link>
                </li>

                {/* 4th: Our World */}
                <li>
                  <Link href="/our-world" className={`${styles.navLink} ${pathname.startsWith("/our-world") ? styles.active : ""}`}>
                    Our World
                  </Link>
                </li>

                {/* 5th: Our Story */}
                <li>
                  <Link href="/our-story" className={`${styles.navLink} ${pathname === "/our-story" ? styles.active : ""}`}>
                    Our Story
                  </Link>
                </li>
              </ul>
            </nav>

            {/* ZONE 3: Right - Action Area (Search Icon + Get a Quote CTA) */}
            <div className={styles.navActions} style={{ position: "relative" }}>
              <button
                className={styles.actionIconButton}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label={isSearchOpen ? "Close search" : "Open search"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* NON-INTRUSIVE LAZY-LOADED POPOVER SEARCH */}
              <HeaderSearchDropdown
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
              />

              {/* Refined Golden Pill "Get a Quote" Button */}
              <Link
                href="/contact?type=quote"
                className={styles.goldenQuoteButton}
              >
                Get a Quote
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                className={styles.hamburger}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
              </button>
            </div>
          </Container>
        </div>

        {/* Mobile Navigation Drawer Backdrop */}
        <div
          className={`${styles.mobileBackdrop} ${isOpen ? styles.backdropOpen : ""}`}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Navigation Drawer */}
        <div className={styles.mobileDrawer} aria-hidden={!isOpen}>
          <div className={styles.mobileDrawerHeader}>
            <span className={styles.mobileDrawerTitle}>JAIPUR STONECRAFT</span>
            <button
              className={styles.mobileCloseButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              &times;
            </button>
          </div>

          <ul className={styles.mobileNavList}>
            {/* 1. Home */}
            <li>
              <Link href="/" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                Home
              </Link>
            </li>

            {/* 2. Collections (Accordion) */}
            <li className={styles.mobileNavItem}>
              <div className={styles.mobileNavHeader}>
                <Link href="/collections" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                  Collections
                </Link>
                <button
                  className={styles.mobileAccordionToggle}
                  onClick={() => toggleMobileAccordion("collections")}
                  aria-label="Toggle Collections sub-items"
                >
                  {mobileAccordion.collections ? "\u2212" : "+"}
                </button>
              </div>

              {mobileAccordion.collections && (
                <ul className={styles.mobileSubList}>
                  {collectionsDropdownItems.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className={styles.mobileSubLink}
                        onClick={() => setIsOpen(false)}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/collections"
                      className={styles.mobileSubLink}
                      style={{ color: "var(--color-bronze)", fontWeight: 600 }}
                      onClick={() => setIsOpen(false)}
                    >
                      View All Collections &rarr;
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* 3. Craftsmanship */}
            <li>
              <Link href="/craftsmanship" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                Craftsmanship
              </Link>
            </li>

            {/* 4. Our World */}
            <li>
              <Link href="/our-world" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                Our World
              </Link>
            </li>

            {/* 5. Our Story */}
            <li>
              <Link href="/our-story" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                Our Story
              </Link>
            </li>
          </ul>

          <div style={{ marginTop: "1.5rem", paddingTop: "0.5rem", paddingBottom: "1.5rem" }}>
            <Link
              href="/contact?type=quote"
              className={styles.goldenQuoteButton}
              style={{ display: "flex", width: "100%", textAlign: "center", justifyContent: "center", padding: "0.8rem", minHeight: "44px" }}
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>

            {/* Mobile Navigation CONNECT WITH US Social Area */}
            <div className={styles.mobileSocialSection}>
              <span className={styles.mobileSocialEyebrow}>CONNECT WITH US</span>
              <div className={styles.mobileSocialGrid}>
                <a
                  href={socialState.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  aria-label="Jaipur Stonecraft on Instagram"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>Instagram</span>
                </a>

                <a
                  href={socialState.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  aria-label="Jaipur Stonecraft on Facebook"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span>Facebook</span>
                </a>

                <a
                  href={socialState.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  aria-label="Jaipur Stonecraft on Pinterest"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 3.99-.28 1.19.6 2.16 1.78 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.86-2.06-4.87-5.01-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.39 2.14.89 2.74.1.12.11.23.08.35-.09.37-.29 1.2-.33 1.36-.05.23-.17.27-.4.17-1.5-.69-2.44-2.88-2.44-4.65 0-3.78 2.75-7.25 7.92-7.25 4.16 0 7.39 2.97 7.39 6.92 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.76-1.38l-.75 2.85c-.27 1.05-1 2.35-1.5 3.15 1.12.34 2.31.53 3.55.53 6.61 0 11.99-5.37 11.99-12C24 5.37 18.63 0 12 0z"/>
                  </svg>
                  <span>Pinterest</span>
                </a>

                <a
                  href={socialState.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  aria-label="Jaipur Stonecraft on YouTube"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HEADER END */}
    </>
  );
}

