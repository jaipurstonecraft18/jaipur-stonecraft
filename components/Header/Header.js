"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "@/components/Container/Container";
import SearchOverlay from "@/components/SearchOverlay/SearchOverlay";
import { siteConfig } from "@/content/site";
import styles from "./Header.module.css";

// 1. Collections Dropdown Data (Real 6 Level-1 Collections)
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

// 2. Marble Hub Dropdown Data (Real Marble Hub Pages)
const marbleDropdownItems = [
  {
    title: "White Marble Deity Statues",
    href: "/marble/statues",
    description: "Makrana white marble deity idols & bespoke masonic portrait busts",
  },
  {
    title: "Marble Ganesh Idols",
    href: "/marble/ganesh",
    description: "Lord Ganesha statues carved from single-block white marble",
  },
  {
    title: "Lord Shiva Statues & Lingams",
    href: "/marble/shiva",
    description: "Meditating Shiva statues & hand-turned Shiva Lingams",
  },
  {
    title: "Courtyard Fountains & Basins",
    href: "/marble/fountains",
    description: "Tiered white marble fountains & carved lotus basins",
  },
  {
    title: "Custom Marble Home Temples",
    href: "/marble/home-mandirs",
    description: "Bespoke white marble mandirs & pooja sanctuary arches",
  },
];

export default function Header({ theme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'collections' | 'marble' | null
  const [mobileAccordion, setMobileAccordion] = useState({ collections: false, marble: false });
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
            {/* ZONE 1: Brand Logo */}
            <Link href="/" className={styles.logo} aria-label="Jaipur Stonecraft Home">
              JAIPUR STONECRAFT
            </Link>

            {/* ZONE 2: Desktop Navigation Links with Luxury Dropdowns */}
            <nav className={styles.desktopNav} aria-label="Desktop Navigation">
              <ul className={styles.navList}>
                {siteConfig.navigation.map((item) => {
                  const isCollections = item.label === "Collections";
                  const isMarble = item.label === "Marble Hub";
                  const hasDropdown = isCollections || isMarble;
                  const dropdownKey = isCollections ? "collections" : isMarble ? "marble" : null;
                  const isDropdownActive = activeDropdown === dropdownKey;

                  if (hasDropdown) {
                    return (
                      <li
                        key={item.href}
                        className={`${styles.navItemHasDropdown} ${isDropdownActive ? styles.dropdownOpen : ""}`}
                        onMouseEnter={() => handleMouseEnter(dropdownKey)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <Link
                          href={item.href}
                          className={`${styles.navLink} ${pathname.startsWith(item.href) ? styles.active : ""}`}
                          aria-expanded={isDropdownActive}
                          aria-haspopup="true"
                        >
                          <span>{item.label}</span>
                          <span className={styles.dropdownCaret} aria-hidden="true">&#9662;</span>
                        </Link>

                        {/* Dropdown Panel */}
                        <div
                          className={`${styles.dropdownPanel} ${isDropdownActive ? styles.show : ""}`}
                          onMouseEnter={() => handleMouseEnter(dropdownKey)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className={styles.dropdownGrid}>
                            {(isCollections ? collectionsDropdownItems : marbleDropdownItems).map((sub) => (
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

                          <div className={styles.dropdownFooter} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                            <Link
                              href={item.href}
                              className={styles.dropdownFooterLink}
                              onClick={() => setActiveDropdown(null)}
                            >
                              {isCollections ? "View All Collections \u2192" : "Explore Marble Hub \u2192"}
                            </Link>
                            {isCollections && (
                              <Link
                                href="/products"
                                className={styles.dropdownFooterLink}
                                style={{ color: "var(--color-bronze)" }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                Full Product Catalogue &rarr;
                              </Link>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ZONE 3: Action Controls (Search + Request Quote CTA + Mobile Hamburger) */}
            <div className={styles.navActions}>
              {/* Search Trigger Button */}
              <button
                className={styles.searchIconButton}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search overlay"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>

              {/* Redesigned Request a Quote Control */}
              <Link
                href="/contact?type=quote"
                className={styles.quoteControl}
              >
                Request a Quote
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

        {/* Mobile Navigation Drawer with Accordion Support */}
        <div className={styles.mobileDrawer} aria-hidden={!isOpen}>
          <ul className={styles.mobileNavList}>
            {siteConfig.navigation.map((item) => {
              const isCollections = item.label === "Collections";
              const isMarble = item.label === "Marble Hub";
              const key = isCollections ? "collections" : isMarble ? "marble" : null;
              const isExpanded = key ? mobileAccordion[key] : false;

              if (key) {
                return (
                  <li key={item.href} className={styles.mobileNavItem}>
                    <div className={styles.mobileNavHeader}>
                      <Link
                        href={item.href}
                        className={styles.mobileNavLink}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                      <button
                        className={styles.mobileAccordionToggle}
                        onClick={() => toggleMobileAccordion(key)}
                        aria-label={`Toggle ${item.label} sub-items`}
                      >
                        {isExpanded ? "\u2212" : "+"}
                      </button>
                    </div>

                    {isExpanded && (
                      <ul className={styles.mobileSubList}>
                        {(isCollections ? collectionsDropdownItems : marbleDropdownItems).map((sub) => (
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
                            href={item.href}
                            className={styles.mobileSubLink}
                            style={{ color: "var(--color-bronze)", fontWeight: 600 }}
                            onClick={() => setIsOpen(false)}
                          >
                            {isCollections ? "View All Collections \u2192" : "Explore Marble Hub \u2192"}
                          </Link>
                        </li>
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div style={{ marginTop: "auto" }}>
            <Link
              href="/contact?type=quote"
              className={styles.quoteControl}
              style={{ display: "flex", width: "100%", textAlign: "center", justifyContent: "center", padding: "0.85rem" }}
              onClick={() => setIsOpen(false)}
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY COMPONENT */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
