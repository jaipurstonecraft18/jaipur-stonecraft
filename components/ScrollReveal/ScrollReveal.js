"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

export default function ScrollReveal({
  children,
  animation = "fade-up", // "fade" | "fade-up" | "fade-scale"
  delay = 0,             // Delay in milliseconds
  duration = 600,        // Transition duration in milliseconds
  className = "",
  as: Component = "div",
  ...props
}) {
  // Default to visible (true) so content is never hidden on initial render or mobile browsers
  const [isIntersecting, setIsIntersecting] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    // Ensure content is immediately visible
    setIsIntersecting(true);
  }, []);

  return (
    <Component
      ref={ref}
      className={`${styles.reveal} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
