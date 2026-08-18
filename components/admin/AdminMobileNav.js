"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import styles from "@/app/admin/admin.module.css";

export default function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      {/* DESKTOP HEADER (> 768px) */}
      <header className={`${styles.topHeader} ${styles.desktopOnly}`}>
        {/* Left: Brand Badge */}
        <div className={styles.brandNav}>
          <Link href="/admin" className={styles.brandTitle}>
            Jaipur Stonecraft
          </Link>
          <span className={styles.brandDivider} />
          <span className={styles.studioBadge}>ADMIN</span>
        </div>

        {/* Center: Logically Grouped Workspace Navigation */}
        <nav className={styles.navLinks}>
          <Link href="/admin" className={`${styles.navLink} ${pathname === "/admin" ? styles.navLinkActive : ""}`}>
            Dashboard
          </Link>
          <Link href="/admin/products" className={`${styles.navLink} ${pathname.startsWith("/admin/products") && pathname !== "/admin/products/new" ? styles.navLinkActive : ""}`}>
            Products
          </Link>
          <Link href="/admin/catalogue" className={`${styles.navLink} ${pathname === "/admin/catalogue" ? styles.navLinkActive : ""}`}>
            Catalogue
          </Link>
          <Link href="/admin/content" className={`${styles.navLink} ${pathname === "/admin/content" ? styles.navLinkActive : ""}`}>
            Content
          </Link>
          <Link href="/admin/media" className={`${styles.navLink} ${pathname === "/admin/media" ? styles.navLinkActive : ""}`}>
            Media
          </Link>
        </nav>

        {/* Right: Primary Action & Utilities */}
        <div className={styles.topActions}>
          <Link
            href="/admin/products/new"
            className={styles.primaryBtn}
            style={{ padding: "0.3rem 0.75rem", fontSize: "0.78rem", minHeight: "32px", borderRadius: "4px" }}
          >
            + Add Product
          </Link>
          <Link href="/" target="_blank" className={styles.publicSiteLink}>
            View Website ↗
          </Link>
          <LogoutButton />
        </div>
      </header>

      {/* MOBILE HEADER BAR (<= 768px) */}
      <div className={`${styles.mobileNavHeader} ${styles.mobileOnly}`}>
        <button onClick={toggleDrawer} className={styles.hamburgerBtn} aria-label="Open Navigation Menu">
          ☰
        </button>

        <Link href="/admin" className={styles.brandTitle} style={{ fontSize: "1.1rem" }}>
          Jaipur Stonecraft
        </Link>

        <Link
          href="/admin/products/new"
          className={styles.primaryBtn}
          style={{ padding: "0.35rem 0.65rem", fontSize: "0.75rem", minHeight: "36px" }}
        >
          + Add
        </Link>
      </div>

      {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
      {isOpen && (
        <>
          <div className={styles.mobileDrawerOverlay} onClick={toggleDrawer} />
          <aside className={styles.mobileDrawerContent}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <span className={styles.brandTitle} style={{ fontSize: "1.15rem" }}>
                Admin Studio
              </span>
              <button
                onClick={toggleDrawer}
                style={{ background: "none", border: "none", color: "#FFF", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginTop: "0.5rem", marginBottom: "0.2rem" }}>CORE WORKSPACE</div>
              <Link
                href="/admin"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin" ? styles.mobileDrawerLinkActive : ""}`}
              >
                📊 Dashboard Overview
              </Link>
              <Link
                href="/admin/products"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/products" ? styles.mobileDrawerLinkActive : ""}`}
              >
                🗿 All Products
              </Link>
              <Link
                href="/admin/products/new"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/products/new" ? styles.mobileDrawerLinkActive : ""}`}
                style={{ color: "var(--color-bronze)", fontWeight: "600" }}
              >
                ⚡ + Add New Product Draft
              </Link>
              <Link
                href="/admin/health"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/health" ? styles.mobileDrawerLinkActive : ""}`}
              >
                🩺 Product Health Queue
              </Link>

              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "1px", color: "#888", marginTop: "0.85rem", marginBottom: "0.2rem" }}>CATALOGUE & MEDIA</div>
              <Link
                href="/admin/catalogue"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/catalogue" ? styles.mobileDrawerLinkActive : ""}`}
              >
                🏷️ Catalogue & Taxonomy
              </Link>
              <Link
                href="/admin/content"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/content" ? styles.mobileDrawerLinkActive : ""}`}
              >
                🖼️ Website Content
              </Link>
              <Link
                href="/admin/media"
                onClick={toggleDrawer}
                className={`${styles.mobileDrawerLink} ${pathname === "/admin/media" ? styles.mobileDrawerLinkActive : ""}`}
              >
                📁 Shared Media Inspector
              </Link>
            </nav>

            <div style={{ marginTop: "auto", borderTop: "1px solid #333", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Link
                href="/"
                target="_blank"
                className={styles.publicSiteLink}
                style={{ width: "100%", justifyContent: "center" }}
              >
                View Public Website ↗
              </Link>
              <LogoutButton />
            </div>
          </aside>
        </>
      )}
    </>
  );
}
