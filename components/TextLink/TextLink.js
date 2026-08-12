import Link from "next/link";
import styles from "./TextLink.module.css";

export default function TextLink({
  children,
  href,
  arrow = false,
  className = "",
  ...props
}) {
  const linkClass = `${styles.link} ${className}`;

  return (
    <Link href={href} className={linkClass} {...props}>
      <span className={styles.text}>{children}</span>
      {arrow && <span className={styles.arrow} aria-hidden="true">&nbsp;&rarr;</span>}
    </Link>
  );
}
