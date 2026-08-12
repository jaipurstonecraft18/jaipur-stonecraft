"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ScrollReveal.module.css";

export default function ScrollReveal({
  children,
  animation = "fade-up", // "fade" | "fade-up" | "fade-scale"
  delay = 0,             // Delay in milliseconds
  duration = 800,        // Transition duration in milliseconds
  className = "",
  as: Component = "div",
  ...props
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Safety fallback timer to ensure content is visible even if observer is delayed
    const fallbackTimer = setTimeout(() => {
      setIsIntersecting(true);
    }, 800);

    // If the browser doesn't support IntersectionObserver, trigger animation immediately
    if (!window.IntersectionObserver) {
      setIsIntersecting(true);
      return () => clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          clearTimeout(fallbackTimer);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0,
        rootMargin: "100px 0px 100px 0px", // Trigger when element is close to viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const transitionStyle = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <Component
      ref={ref}
      style={transitionStyle}
      className={`${styles.reveal} ${styles[animation]} ${isIntersecting ? styles.active : ""} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
