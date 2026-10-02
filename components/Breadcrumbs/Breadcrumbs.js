import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

export default function Breadcrumbs({ items = [], theme = "light" }) {
  if (!items || items.length === 0) return null;

  const baseUrl = "https://jaipurstonecraft.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      ...items.map((item, idx) => ({
        "@type": "ListItem",
        "position": idx + 2,
        "name": item.label,
        ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />
      <nav
        className={`${styles.breadcrumbsNav} ${theme === "dark" ? styles.darkTheme : ""}`}
        aria-label="Breadcrumb"
        suppressHydrationWarning
      >
        <ul className={styles.breadcrumbs} suppressHydrationWarning>
          <li suppressHydrationWarning>
            <Link href="/" className={styles.link} suppressHydrationWarning>
              Home
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className={styles.item} suppressHydrationWarning>
                <span className={styles.separator} aria-hidden="true" suppressHydrationWarning>/</span>
                {isLast || !item.href ? (
                  <span className={styles.current} aria-current="page" suppressHydrationWarning>
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={styles.link} suppressHydrationWarning>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

