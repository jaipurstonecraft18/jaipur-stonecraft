"use client";

import Container from "@/components/Container/Container";
import styles from "./WorldCategoryTabs.module.css";

// Minimal fine line-art SVGs consistent with brand design tokens
function CategoryIcon({ categoryId }) {
  switch (categoryId) {
    case "all":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "sculptures":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 4.5C10 9.5 8 8 8 6a4 4 0 0 1 4-4Z" />
          <path d="M6 21v-3a6 6 0 0 1 12 0v3" />
          <path d="M9 14h6" />
        </svg>
      );
    case "architectural":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 4h16" />
          <path d="M6 4v16" />
          <path d="M18 4v16" />
          <path d="M3 20h18" />
          <path d="M10 8v8" />
          <path d="M14 8v8" />
        </svg>
      );
    case "jalis":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6" />
          <path d="M12 15v6" />
          <path d="M3 12h6" />
          <path d="M15 12h6" />
        </svg>
      );
    case "fountains":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2v6" />
          <path d="M5 8c0 3.87 3.13 7 7 7s7-3.13 7-7H5Z" />
          <path d="M3 15c0 4.42 4.03 8 9 8s9-3.58 9-8H3Z" />
        </svg>
      );
    case "custom":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m14 7 3 3-9 9H5v-3l9-9Z" />
          <path d="M17 4l3 3" />
          <circle cx="6" cy="18" r="1" />
        </svg>
      );
    default:
      return null;
  }
}

export default function WorldCategoryTabs({ categories = [], activeTab = "all", onSelectTab }) {
  return (
    <nav className={styles.tabsWrapper} aria-label="Our World Category Navigation">
      <Container>
        <div className={styles.scrollContainer} role="tablist">
          <ul className={styles.tabsList}>
            {categories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    role="tab"
                    id={`tab-${cat.id}`}
                    aria-selected={isActive}
                    aria-controls="gallery-grid"
                    tabIndex={isActive ? 0 : -1}
                    className={`${styles.tabButton} ${isActive ? styles.active : ""}`}
                    onClick={() => onSelectTab(cat.id)}
                  >
                    <span className={styles.iconWrapper}>
                      <CategoryIcon categoryId={cat.id} />
                    </span>
                    <span className={styles.tabLabel}>{cat.label}</span>
                    {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </nav>
  );
}
