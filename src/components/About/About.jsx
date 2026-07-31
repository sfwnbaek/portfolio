// src/components/About/About.jsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './About.module.css';
import { timelineData } from './About.js'; 

export default function About() {
  const timelineRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height;
      const scrolled = (windowHeight / 1.5) - rect.top;

      let progress = (scrolled / scrollableDistance) * 100;
      progress = Math.max(0, Math.min(progress, 100)); 
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fade-in animation logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.2 } 
    );

    const items = document.querySelectorAll(`.${styles.milestone}`);
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className={styles.aboutSection}>
      <h2 className={styles.sectionTitle}>
        My <span>Journey</span>
      </h2>

      <div className={styles.timeline} ref={timelineRef}>
        <div className={styles.baseLine}></div>
        <div className={styles.glowLine} style={{ height: `${scrollProgress}%` }}></div>

        {timelineData.map((item, index) => {
          const dotThreshold = (index / timelineData.length) * 100;
          const isActive = scrollProgress > dotThreshold;

          return (
            <div 
              key={index} 
              className={`${styles.milestone} ${isActive ? styles.activeDot : ''}`}
            >
              <div className={styles.dot}></div>
              
              {/* NEW: The Interactive Image Card */}
              <div className={styles.cardContent}>
                
                {/* Image Side */}
                <div className={styles.imageWrapper}>
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className={styles.milestoneImage} 
                  />
                </div>

                {/* Text Side */}
                <div className={styles.textContent}>
                  <span className={styles.year}>// {item.year}</span>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                </div>
                
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}