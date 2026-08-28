"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/content/site";
import styles from "./FloatingSocialButton.module.css";

export default function FloatingSocialButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [socialState, setSocialState] = useState({
    instagram: siteConfig.social?.instagram || "https://instagram.com/jaipurstonecraft",
    facebook: siteConfig.social?.facebook || "https://facebook.com/jaipurstonecraft",
    pinterest: siteConfig.social?.pinterest || "https://pinterest.com/jaipurstonecraft",
    youtube: siteConfig.social?.youtube || "https://youtube.com/@jaipurstonecraft",
  });
  const containerRef = useRef(null);
  const pathname = usePathname();

  // Fetch dynamic Admin Settings on mount so links saved in /admin/settings take immediate effect
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings?.social_links) {
          const s = data.settings.social_links;
          setSocialState({
            instagram: s.instagram || siteConfig.social?.instagram,
            facebook: s.facebook || siteConfig.social?.facebook,
            pinterest: s.pinterest || siteConfig.social?.pinterest,
            youtube: s.youtube || siteConfig.social?.youtube,
          });
        }
      })
      .catch(() => {
        // Fall back gracefully to siteConfig
      });
  }, []);

  // Ordered for bottom-to-top expansion: Instagram (bottom) -> Facebook -> Pinterest -> YouTube (top)
  const socialLinks = [
    {
      name: "YouTube",
      url: socialState.youtube,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      hoverClass: styles.ytHover,
      delay: "0.12s"
    },
    {
      name: "Pinterest",
      url: socialState.pinterest,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 3.99-.28 1.19.6 2.16 1.78 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.86-2.06-4.87-5.01-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.39 2.14.89 2.74.1.12.11.23.08.35-.09.37-.29 1.2-.33 1.36-.05.23-.17.27-.4.17-1.5-.69-2.44-2.88-2.44-4.65 0-3.78 2.75-7.25 7.92-7.25 4.16 0 7.39 2.97 7.39 6.92 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.76-1.38l-.75 2.85c-.27 1.05-1 2.35-1.5 3.15 1.12.34 2.31.53 3.55.53 6.61 0 11.99-5.37 11.99-12C24 5.37 18.63 0 12 0z"/>
        </svg>
      ),
      hoverClass: styles.pinHover,
      delay: "0.08s"
    },
    {
      name: "Facebook",
      url: socialState.facebook,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      ),
      hoverClass: styles.fbHover,
      delay: "0.04s"
    },
    {
      name: "Instagram",
      url: socialState.instagram,
      icon: (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      ),
      hoverClass: styles.igHover,
      delay: "0.00s"
    }
  ];

  // Close menu on page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle outside click & Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={styles.floatingContainer} ref={containerRef}>
      {/* Expanded Circular Social Stack */}
      <div
        id="social-floating-menu"
        className={`${styles.socialStack} ${isOpen ? styles.socialStackOpen : ""}`}
        role="menu"
        aria-hidden={!isOpen}
      >
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.circleBtn} ${item.hoverClass}`}
            role="menuitem"
            tabIndex={isOpen ? 0 : -1}
            aria-label={`Visit Jaipur Stonecraft on ${item.name}`}
            style={{ transitionDelay: isOpen ? item.delay : "0s" }}
          >
            <span className={styles.iconWrapper}>{item.icon}</span>
            <span className={styles.tooltipLabel}>{item.name}</span>
          </a>
        ))}
      </div>

      {/* Main Social / Explore Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.socialToggleBtn} ${isOpen ? styles.socialToggleActive : ""}`}
        aria-expanded={isOpen}
        aria-controls="social-floating-menu"
        aria-label={isOpen ? "Close social media menu" : "Discover Jaipur Stonecraft on Social Media"}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.closeIcon}>
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.vectorLogoSvg}>
            <defs>
              <linearGradient id="goldRimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5D089" />
                <stop offset="35%" stopColor="#D4A359" />
                <stop offset="70%" stopColor="#B87B31" />
                <stop offset="100%" stopColor="#8C581E" />
              </linearGradient>
              <radialGradient id="marbleBgGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="65%" stopColor="#FAF4EB" />
                <stop offset="100%" stopColor="#EFE6D8" />
              </radialGradient>
              <filter id="nodeShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#1C1917" floodOpacity="0.25" />
              </filter>
              <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
              </filter>
            </defs>

            <circle cx="32" cy="32" r="30" fill="url(#goldRimGrad)" filter="url(#coinShadow)" />
            <circle cx="32" cy="32" r="28" fill="#1C1917" />
            <circle cx="32" cy="32" r="26.5" fill="url(#marbleBgGrad)" stroke="url(#goldRimGrad)" strokeWidth="1" />
            <circle cx="32" cy="32" r="24.5" fill="none" stroke="#D8CFC2" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.65" />

            <path d="M 23 32 Q 30 23, 41 22" fill="none" stroke="url(#goldRimGrad)" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M 23 32 Q 30 41, 41 42" fill="none" stroke="url(#goldRimGrad)" strokeWidth="3.2" strokeLinecap="round" />

            <g filter="url(#nodeShadow)">
              <circle cx="22" cy="32" r="6" fill="url(#goldRimGrad)" />
              <circle cx="22" cy="32" r="4.2" fill="#FAF4EB" />
              <circle cx="22" cy="32" r="2.5" fill="url(#goldRimGrad)" />
            </g>

            <g filter="url(#nodeShadow)">
              <circle cx="42" cy="21" r="5.5" fill="url(#goldRimGrad)" />
              <circle cx="42" cy="21" r="3.8" fill="#FAF4EB" />
              <circle cx="42" cy="21" r="2.2" fill="url(#goldRimGrad)" />
            </g>

            <g filter="url(#nodeShadow)">
              <circle cx="42" cy="43" r="5.5" fill="url(#goldRimGrad)" />
              <circle cx="42" cy="43" r="3.8" fill="#FAF4EB" />
              <circle cx="42" cy="43" r="2.2" fill="url(#goldRimGrad)" />
            </g>
          </svg>
        )}
      </button>
    </div>
  );
}
