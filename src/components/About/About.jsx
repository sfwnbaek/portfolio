import React, { useState, useEffect } from "react";
import styles from "./About.module.css";
import { aboutData } from "./AboutData.js"; 

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [typedText, setTypedText] = useState("");
  
  const currentExp = aboutData[currentIndex];

  // 🚀 Terminal Typing Effect Logic
  useEffect(() => {
    setTypedText(""); 
    
    // Combine the role, date, and desc into one terminal output string
    const fullText = `[ROLE]: ${currentExp.role}\n[DATE]: ${currentExp.date}\n\n${currentExp.desc}`;
    
    let currentString = "";
    let i = 0;
    
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        currentString += fullText.charAt(i);
        setTypedText(currentString);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 15); // Speed of the typing

    return () => clearInterval(typingInterval);
  }, [currentIndex]); 

  // 🚀 Master Navigation Controls
  const handleNextExp = () => {
    setCurrentIndex((prev) => (prev + 1) % aboutData.length);
    setImageIndex(0); 
  };

  const handlePrevExp = () => {
    setCurrentIndex((prev) => (prev - 1 + aboutData.length) % aboutData.length);
    setImageIndex(0);
  };

  // 🚀 Child Navigation Controls (Click to Glitch Image)
  const handleImageClick = () => {
    if (currentExp.images.length <= 1 || isGlitching) return;

    setIsGlitching(true);

    // Swap the image halfway through the glitch
    setTimeout(() => {
      setImageIndex((prev) => (prev + 1) % currentExp.images.length);
    }, 150);

    // Stop glitching after 300ms
    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  };

  return (
    <section id="about" className={styles.aboutSection}>
      <h2 className={styles.sectionTitle}>ABOUT ME</h2>

      <div className={styles.splitContainer}>
        
        {/* Left Arrow */}
        <button className={styles.navArrow} onClick={handlePrevExp}>&lt;</button>

        {/* 💻 LEFT PANE: MOCK TERMINAL */}
        <div className={styles.terminalPane}>
          <div className={styles.terminalHeader}>
            <div className={styles.macDots}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <span className={styles.terminalTitle}>Experience</span>
          </div>
          
          <div className={styles.terminalBody}>
            <div>
              <span className={styles.terminalCommand}>&gt; execute</span> {currentExp.id}.sh
            </div>
            <div className={styles.terminalOutput}>
              <span>{typedText}</span>
              <span className={styles.cursor}></span>
            </div>
          </div>
        </div>

        {/* 🖼️ RIGHT PANE: MEDIA VIEWER */}
        <div className={styles.mediaPane} onClick={handleImageClick}>
          <div className={`${styles.imageWrapper} ${isGlitching ? styles.isGlitching : ""}`}>
            <img 
              src={currentExp.images[imageIndex]} 
              alt={currentExp.role} 
              className={styles.mediaImage} 
            />
          </div>

          {currentExp.images.length > 1 && (
            <>
              <span className={styles.imageCounter}>
                [ {imageIndex + 1} / {currentExp.images.length} ]
              </span>
              <span className={styles.clickHint}>CLICK TO DECRYPT NEXT</span>
            </>
          )}
        </div>

        {/* Right Arrow */}
        <button className={styles.navArrow} onClick={handleNextExp}>&gt;</button>

      </div>
    </section>
  );
}