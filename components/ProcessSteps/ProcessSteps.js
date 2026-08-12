import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ProcessSteps.module.css";

export default function ProcessSteps({ steps = [] }) {
  // Default 5-step process if none provided
  const defaultSteps = [
    { title: "Discuss", description: "Coordinate project constraints and dimensional bounds." },
    { title: "Design", description: "Confirm scaled blueprint layouts and draft mockups." },
    { title: "Craft", description: "Master craftsmen chisel from solid raw blocks of stone." },
    { title: "Inspect", description: "Dimensional tolerance check and surface protection." },
    { title: "Deliver", description: "Coordinate ocean logistics and placement instructions." }
  ];

  const activeSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className={styles.container}>
      {activeSteps.map((step, idx) => (
        <ScrollReveal
          key={step.title}
          animation="fade-up"
          delay={idx * 80}
          className={styles.stepCard}
        >
          <div className={styles.header}>
            <span className={styles.number}>
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className={styles.line}></div>
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{step.title}</h3>
            <p className={styles.description}>{step.description}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
}
