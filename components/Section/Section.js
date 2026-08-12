import styles from "./Section.module.css";

export default function Section({
  children,
  background = "light",
  spacing = "standard",
  className = "",
  as: Component = "section",
  ...props
}) {
  const sectionClass = `${styles.section} ${styles[background]} ${styles[spacing]} ${className}`;

  return (
    <Component className={sectionClass} {...props}>
      {children}
    </Component>
  );
}
