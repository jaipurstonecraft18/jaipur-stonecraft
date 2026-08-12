import styles from "./Container.module.css";

export default function Container({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component className={`${styles.container} ${className}`} {...props}>
      {children}
    </Component>
  );
}
