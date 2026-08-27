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
              <a href={`tel:${siteConfig.contact.phone}`} className={styles.utilityLink}>
                {siteConfig.contact.phone}
              </a>
              <span className={styles.utilityDot}>•</span>
              <a href={`mailto:${siteConfig.contact.email}`} className={styles.utilityLink}>
                {siteConfig.contact.email}
              </a>
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

          <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
            <Link
              href="/contact?type=quote"
              className={styles.goldenQuoteButton}
              style={{ display: "flex", width: "100%", textAlign: "center", justifyContent: "center", padding: "0.85rem", minHeight: "46px" }}
              onClick={() => setIsOpen(false)}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </header>

      {/* HEADER END */}
    </>
  );
}

