import Link from "next/link";
import styles from "./PrimaryButton.module.css";

export default function PrimaryButton({
  children,
  onClick,
  href,
  type = "button",
  variant = "charcoal", // "charcoal" | "bronze" | "cream"
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
