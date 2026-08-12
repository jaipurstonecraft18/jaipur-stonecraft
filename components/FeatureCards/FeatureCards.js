import styles from "./FeatureCards.module.css";

export default function FeatureCards({ features = [] }) {
  if (!features || features.length === 0) return null;

  return (
    <div className={styles.grid}>
      {features.map((feature, idx) => (
        <div key={`${feature.title}-${idx}`} className={styles.card}>
          <div className={styles.headerRow}>
            <span className={styles.number}>0{idx + 1}</span>
            <span className={styles.dividerLine}></span>
          </div>
          <h3 className={styles.title}>{feature.title}</h3>
          <p className={styles.desc}>{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
