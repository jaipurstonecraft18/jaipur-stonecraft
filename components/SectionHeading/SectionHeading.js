import styles from "./SectionHeading.module.css";

export default function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left", // "left" | "center"
  className = "",
  headingLevel = "h2", // "h1" | "h2" | "h3"
}) {
  const HeadingTag = headingLevel;

  return (
    <div className={`${styles.wrapper} ${styles[align]} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {heading && <HeadingTag className={styles.heading}>{heading}</HeadingTag>}
      {description && <p className={`large ${styles.description}`}>{description}</p>}
    </div>
  );
}
