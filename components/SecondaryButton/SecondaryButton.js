import Link from "next/link";
import styles from "./SecondaryButton.module.css";

export default function SecondaryButton({
  children,
  onClick,
  href,
  type = "button",
  variant = "charcoal", // "charcoal" | "cream" | "bronze"
  className = "",
  disabled = false,
  ...props
}) {
  const btnClass = `${styles.button} ${styles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={btnClass} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={btnClass}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
