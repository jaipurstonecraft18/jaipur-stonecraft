"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import { siteConfig } from "@/content/site";
import styles from "./BeyondTheGallery.module.css";

export default function BeyondTheGallery({ sectionData, globalSocial }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);

  const data = {
    enabled: true,
    eyebrow: "FOLLOW THE CRAFT",
    heading: "Beyond the Gallery",
    description: "There is more to our craft than the finished piece. Discover our world across our social channels.",
    videoTitle: "CRAFT IN MOTION",
    videoMessage: "See the craft come to life.",
    videoDescription: "From raw stone to timeless beauty – watch the hands, tools and traditions behind every creation.",
    videoSrc: "/videos/herovid.webm",
    videoPoster: "/images/craftsmanship/artisan-hands.webp",
    youtubeCtaText: "Watch more on YouTube \u2197",
    instagramCard: {
      title: "Instagram",
      description: "Latest creations &\nstudio moments.",
      ctaText: "Explore Instagram \u2192",
      imageSrc: "/images/brand/heritage-ganesha.webp",
    },
    pinterestCard: {
      title: "Pinterest",
      description: "Stonework ideas &\ninspiration for\nevery space.",
      ctaText: "Explore Pinterest \u2192",
      imageSrc: "/images/collections/temples-architectural.webp",
    },
    facebookCard: {
      title: "Facebook",
      description: "Projects, updates &\nour journey together.",
      ctaText: "Visit Facebook \u2192",
      imageSrc: "/images/craftsmanship/step-02-shape-precision.webp",
    },
    ...sectionData,
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (data.enabled === false) return null;

  // Authoritative Social URLs: CMS Section Override -> Central DB Setting -> siteConfig -> Brand Channel Handle
  const socialUrls = {
    youtube: data.youtubeUrl || globalSocial?.youtube || siteConfig.social?.youtube || siteConfig.contact?.youtube || "https://youtube.com/@jaipurstonecraft",
    instagram: data.instagramCard?.url || globalSocial?.instagram || siteConfig.social?.instagram || siteConfig.contact?.instagram || "https://instagram.com/jaipurstonecraft",
    pinterest: data.pinterestCard?.url || globalSocial?.pinterest || siteConfig.social?.pinterest || siteConfig.contact?.pinterest || "https://pinterest.com/jaipurstonecraft",
    facebook: data.facebookCard?.url || globalSocial?.facebook || siteConfig.social?.facebook || siteConfig.contact?.facebook || "https://facebook.com/jaipurstonecraft",
  };

  return (
    <section className={styles.section} aria-label="Beyond the Gallery">
      {/* Background Architectural Arch Watermark (Left) */}
      <svg className={styles.bgWatermarkLeft} viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 600V250C50 140 140 50 250 50C360 50 450 140 450 250V600" stroke="#8C6D46" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.18"/>
        <path d="M80 600V260C80 166 156 90 250 90C344 90 420 166 420 260V600" stroke="#8C6D46" strokeWidth="1" opacity="0.15"/>
        <path d="M110 600V270C110 193 173 130 250 130C327 130 390 193 390 270V600" stroke="#8C6D46" strokeWidth="0.8" opacity="0.12"/>
        <circle cx="250" cy="250" r="80" stroke="#8C6D46" strokeWidth="0.8" opacity="0.12"/>
        <path d="M250 170V330M170 250H330" stroke="#8C6D46" strokeWidth="0.6" opacity="0.1"/>
        <path d="M250 50C250 30 240 10 250 0C260 10 250 30 250 50Z" fill="#8C6D46" opacity="0.15"/>
      </svg>

      {/* Background Carved Rosette Medallion Watermark (Right) */}
      <svg className={styles.bgWatermarkRight} viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="250" cy="250" r="220" stroke="#8C6D46" strokeWidth="1.2" opacity="0.15"/>
        <circle cx="250" cy="250" r="190" stroke="#8C6D46" strokeWidth="0.8" strokeDasharray="6 4" opacity="0.15"/>
        <circle cx="250" cy="250" r="150" stroke="#8C6D46" strokeWidth="1" opacity="0.12"/>
        <circle cx="250" cy="250" r="100" stroke="#8C6D46" strokeWidth="0.8" opacity="0.12"/>
        <circle cx="250" cy="250" r="50" stroke="#8C6D46" strokeWidth="0.8" opacity="0.15"/>
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
          <g key={i} transform={`rotate(${angle} 250 250)`}>
            <path d="M250 100 C270 150 270 200 250 250 C230 200 230 150 250 100 Z" stroke="#8C6D46" strokeWidth="0.7" opacity="0.12"/>
            <path d="M250 30 C280 120 280 200 250 250 C220 200 220 120 250 30 Z" stroke="#8C6D46" strokeWidth="0.5" opacity="0.08"/>
          </g>
        ))}
      </svg>

      <Container>
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className={styles.headerWrapper}>
            <div className={styles.eyebrowStrip}>
              <span className={styles.headerLine} />
              <span className={styles.diamond}>◇</span>
              <span className={styles.eyebrow}>{data.eyebrow}</span>
              <span className={styles.diamond}>◇</span>
              <span className={styles.headerLine} />
            </div>
            <h2 className={styles.heading}>{data.heading}</h2>
            <p className={styles.description}>{data.description}</p>
          </div>
        </ScrollReveal>

        {/* Main Feature: Craft in Motion Video Banner */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className={styles.featureCard} ref={containerRef}>
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              poster={data.videoPoster}
              aria-hidden="true"
              onEnded={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  videoRef.current.play().catch(() => {});
                }
              }}
            >
              {inView && data.videoSrc && (
                <source src={data.videoSrc} type={/\.webm($|\?)/i.test(data.videoSrc) ? 'video/webm' : 'video/mp4'} />
              )}
            </video>

            <div className={styles.videoOverlay} />

            <div className={styles.videoContent}>
              <span className={styles.videoTitle}>{data.videoTitle}</span>
              <h3 className={styles.videoMessage}>{data.videoMessage}</h3>
              <div className={styles.dividerLine} />
              <p className={styles.videoDesc}>{data.videoDescription}</p>

              <a
                href={socialUrls.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.youtubeCta}
                aria-label="Watch Jaipur Stonecraft videos on YouTube"
              >
                <span className={styles.playIconBg}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </span>
                <span>{data.youtubeCtaText || "Watch more on YouTube ↗"}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* 3 Social Cards Grid */}
        <div className={styles.cardsGrid}>
          {/* 1. Instagram Card */}
          <ScrollReveal animation="fade-up" delay={200}>
            <a
              href={socialUrls.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
              aria-label="Explore Jaipur Stonecraft on Instagram"
            >
              <div className={styles.cardImageWrapper}>
                <Image
                  src={data.instagramCard?.imageSrc || "/images/brand/heritage-ganesha.webp"}
                  alt="Jaipur Stonecraft Instagram sculptured creation"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>{data.instagramCard?.title || "Instagram"}</h4>
                <p className={styles.cardDesc}>{data.instagramCard?.description || "Latest creations &\nstudio moments."}</p>
                <span className={styles.cardCta}>{data.instagramCard?.ctaText || "Explore Instagram \u2192"}</span>
              </div>
            </a>
          </ScrollReveal>

          {/* 2. Pinterest Card */}
          <ScrollReveal animation="fade-up" delay={280}>
            <a
              href={socialUrls.pinterest}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
              aria-label="Explore Jaipur Stonecraft on Pinterest"
            >
              <div className={styles.cardImageWrapper}>
                <Image
                  src={data.pinterestCard?.imageSrc || "/images/collections/temples-architectural.webp"}
                  alt="Jaipur Stonecraft Pinterest architectural stonework"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.2-2.4.04-3.44.22-.94 1.4-5.96 1.4-5.96s-.36-.72-.36-1.78c0-1.66.97-2.91 2.17-2.91 1.02 0 1.51.77 1.51 1.69 0 1.03-.65 2.57-1 3.99-.28 1.19.6 2.16 1.78 2.16 2.13 0 3.77-2.25 3.77-5.49 0-2.86-2.06-4.87-5.01-4.87-3.41 0-5.41 2.56-5.41 5.2 0 1.03.39 2.14.89 2.74.1.12.11.23.08.35-.09.37-.29 1.2-.33 1.36-.05.23-.17.27-.4.17-1.5-.69-2.44-2.88-2.44-4.65 0-3.78 2.75-7.25 7.92-7.25 4.16 0 7.39 2.97 7.39 6.92 0 4.14-2.61 7.46-6.23 7.46-1.22 0-2.36-.63-2.76-1.38l-.75 2.85c-.27 1.05-1 2.35-1.5 3.15 1.12.34 2.31.53 3.55.53 6.61 0 11.99-5.37 11.99-12C24 5.37 18.63 0 12 0z"/>
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>{data.pinterestCard?.title || "Pinterest"}</h4>
                <p className={styles.cardDesc}>{data.pinterestCard?.description || "Stonework ideas &\ninspiration for\nevery space."}</p>
                <span className={styles.cardCta}>{data.pinterestCard?.ctaText || "Explore Pinterest \u2192"}</span>
              </div>
            </a>
          </ScrollReveal>

          {/* 3. Facebook Card */}
          <ScrollReveal animation="fade-up" delay={360}>
            <a
              href={socialUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialCard}
              aria-label="Visit Jaipur Stonecraft on Facebook"
            >
              <div className={styles.cardImageWrapper}>
                <Image
                  src={data.facebookCard?.imageSrc || "/images/craftsmanship/step-02-shape-precision.webp"}
                  alt="Jaipur Stonecraft Facebook workshop and project updates"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.iconCircle}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </div>
                <h4 className={styles.cardTitle}>{data.facebookCard?.title || "Facebook"}</h4>
                <p className={styles.cardDesc}>{data.facebookCard?.description || "Projects, updates &\nour journey together."}</p>
                <span className={styles.cardCta}>{data.facebookCard?.ctaText || "Visit Facebook \u2192"}</span>
              </div>
            </a>
          </ScrollReveal>
        </div>

        {/* Footer Sub-strip */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div className={styles.footerStrip}>
            <span className={styles.footerLine} />
            <span className={styles.footerDiamond}>◇</span>
            <span className={styles.footerText}>{data.footerStripText || "FOLLOW • EXPLORE • GET INSPIRED"}</span>
            <span className={styles.footerDiamond}>◇</span>
            <span className={styles.footerLine} />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
