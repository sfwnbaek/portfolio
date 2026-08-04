  import React, { useState, useEffect } from "react";
  import styles from "./About.module.css";
  import { aboutData } from "./AboutData.js"; 

  export default function About() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageIndex, setImageIndex] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
    const [typedText, setTypedText] = useState("");
    
    const currentExp = aboutData[currentIndex];
    const currentImgData = currentExp.images[imageIndex];

    // 🚀 Terminal Typing Effect (Now triggers on BOTH job change and image change!)
    useEffect(() => {
      setTypedText(""); 
      
      // Pulls the role, date, and the specific description mapped to the active image
      const fullText = `[ROLE]: ${currentExp.role}\n[STAGE]: [${imageIndex + 1} / ${currentExp.images.length}]\n[DATE]: ${currentExp.date}\n\n${currentImgData.desc}`;
      
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
      }, 12); 

      return () => clearInterval(typingInterval);
    }, [currentIndex, imageIndex]); // 👈 Re-runs whenever you switch jobs OR click to the next photo!

    // Master Navigation Controls
    const handleNextExp = () => {
      setCurrentIndex((prev) => (prev + 1) % aboutData.length);
      setImageIndex(0); 
    };

    const handlePrevExp = () => {
      setCurrentIndex((prev) => (prev - 1 + aboutData.length) % aboutData.length);
      setImageIndex(0);
    };

    // Child Navigation Controls (Click to Glitch Image & Change Description)
    const handleImageClick = () => {
      if (currentExp.images.length <= 1 || isGlitching) return;

      setIsGlitching(true);

      // Swap the image index halfway through the glitch
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
      
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>About Me</h2>
      </div>

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
              <span className={styles.terminalTitle}>Experience at {currentExp.id}</span>
            </div>
            
            <div className={styles.terminalBody}>
              <div>
                <span className={styles.terminalCommand}>&gt; load_image</span> -ID 0{imageIndex + 1}
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
                src={currentImgData.url} 
                alt={currentExp.role} 
                className={styles.mediaImage} 
              />
            </div>

            {currentExp.images.length > 1 && (
              <>
                <span className={styles.imageCounter}>
                  [ {imageIndex + 1} / {currentExp.images.length} ]
                </span>
                <span className={styles.clickHint}>CLICK TO DECRYPT NEXT PHASE</span>
              </>
            )}
          </div>

          {/* Right Arrow */}
          <button className={styles.navArrow} onClick={handleNextExp}>&gt;</button>

        </div>
      </section>
    );
  }