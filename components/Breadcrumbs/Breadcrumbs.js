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
      />
      <nav className={`${styles.breadcrumbsNav} ${theme === "dark" ? styles.darkTheme : ""}`} aria-label="Breadcrumb">
        <ul className={styles.breadcrumbs}>
          <li>
            <Link href="/" className={styles.link}>
              Home
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className={styles.item}>
                <span className={styles.separator} aria-hidden="true">/</span>
                {isLast || !item.href ? (
                  <span className={styles.current} aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link href={item.href} className={styles.link}>
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
