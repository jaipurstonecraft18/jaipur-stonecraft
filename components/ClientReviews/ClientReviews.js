"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/Container/Container";
import ScrollReveal from "@/components/ScrollReveal/ScrollReveal";
import styles from "./ClientReviews.module.css";

const defaultReviews = [
  {
    id: "1",
    stars: 5,
    quote: "Exceptional craftsmanship and top-notch quality. The statue has brought so much divinity to our home.",
    author: "Anjali Sharma",
    location: "Jaipur, India",
    imageSrc: "",
    initials: "AS",
  },
  {
    id: "2",
    stars: 5,
    quote: "From design to delivery, everything was seamless. Highly professional and very cooperative team.",
    author: "Vikram Mehta",
    location: "Delhi, India",
    imageSrc: "",
    initials: "VM",
  },
  {
    id: "3",
    stars: 5,
    quote: "The marble finish and detailing are simply breathtaking. Thank you Jaipur Stonecraft!",
    author: "Neetu Agarwal",
    location: "Mumbai, India",
    imageSrc: "",
    initials: "NA",
  },
  {
    id: "4",
    stars: 5,
    quote: "We received our custom temple on time and the quality exceeded our expectations.",
    author: "Suresh Reddy",
    location: "Hyderabad, India",
    imageSrc: "",
    initials: "SR",
  },
];

export default function ClientReviews({ reviewsData }) {
  const eyebrow = reviewsData?.eyebrow || "WHAT OUR CLIENTS SAY";
  const heading = reviewsData?.heading || "Trusted by Devotees. Loved for Generations.";
  const reviewsList = Array.isArray(reviewsData?.reviews) && reviewsData.reviews.length > 0
    ? reviewsData.reviews
    : defaultReviews;

  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll track by exactly one review card
  const scrollOneCard = (direction) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector(`.${styles.reviewCardWrapper}`);
    if (!card) return;

    const cardWidth = card.getBoundingClientRect().width + 24; // card width + gap
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    if (direction === "next") {
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
      }
    } else {
      if (scrollLeft <= 15) {
        sliderRef.current.scrollTo({ left: scrollWidth, behavior: "smooth" });
      } else {
        sliderRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
      }
    }
  };

  // Automated auto-scroll every 4 seconds (pauses when user hovers)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      scrollOneCard("next");
    }, 4200);
    return () => clearInterval(timer);
  }, [isHovered, reviewsList.length]);

  return (
    <section className={styles.section} aria-label="Client Reviews">
      <Container>
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className={styles.headerWrapper}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.heading}>{heading}</h2>

            {/* Gold Floral Line Ornament */}
            <div className={styles.ornamentLine} aria-hidden="true">
              <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
                <line x1="0" y1="8" x2="46" y2="8" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.45" />
                <circle cx="60" cy="8" r="3" fill="#B87B31" />
                <path d="M60 2 Q63 8 60 14 Q57 8 60 2Z" fill="#B87B31" fillOpacity="0.5" />
                <line x1="74" y1="8" x2="120" y2="8" stroke="#B87B31" strokeWidth="1" strokeOpacity="0.45" />
              </svg>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel & Controls Wrapper */}
        <div
          className={styles.carouselContainer}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            type="button"
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={() => scrollOneCard("prev")}
            aria-label="Previous review"
          >
            &larr;
          </button>

          {/* Single-Row Horizontal Slider Track */}
          <div className={styles.sliderTrack} ref={sliderRef}>
            {reviewsList.map((rev, idx) => {
              const starsCount = parseInt(rev.stars, 10) || 5;
              const authorInitials = rev.initials || (rev.author ? rev.author.split(' ').map(n => n[0]).join('').toUpperCase() : 'JS');

              return (
                <div key={rev.id || idx} className={styles.reviewCardWrapper}>
                  <div className={styles.reviewCard}>
                    <div className={styles.starRow} aria-label={`${starsCount} out of 5 stars`}>
                      {[...Array(starsCount)].map((_, i) => (
                        <span key={i} className={styles.star}>★</span>
                      ))}
                    </div>

                    <blockquote className={styles.quoteText}>
                      &ldquo;{rev.quote}&rdquo;
                    </blockquote>

                    <div className={styles.authorRow}>
                      {rev.imageSrc ? (
                        <img
                          src={rev.imageSrc}
                          alt={rev.author}
                          style={{
                            width: "46px",
                            height: "46px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "1.5px solid #B87B31",
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div className={styles.avatar}>{authorInitials}</div>
                      )}
                      <div className={styles.authorDetails}>
                        <span className={styles.authorName}>{rev.author}</span>
                        <span className={styles.authorLocation}>{rev.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={() => scrollOneCard("next")}
            aria-label="Next review"
          >
            &rarr;
          </button>
        </div>
      </Container>
    </section>
  );
}
