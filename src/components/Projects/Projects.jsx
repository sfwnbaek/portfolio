import React, { useState } from 'react';
import styles from './Projects.module.css';
import { projectData } from './ProjectsData.js'; // Make sure this matches your data file name!

export default function Projects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projectData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projectData.length) % projectData.length);
  };

  // Helper function to assign the correct 3D class to each card
  const getCardClass = (index) => {
    if (index === currentIndex) return styles.activeCard;
    
    // Calculate the previous and next indexes wrapping around the array
    const prevIndex = (currentIndex - 1 + projectData.length) % projectData.length;
    const nextIndex = (currentIndex + 1) % projectData.length;

    if (index === prevIndex) return styles.prevCard;
    if (index === nextIndex) return styles.nextCard;
    
    return styles.hiddenCard; 
  };

  return (
    <section id="projects" className={styles.projectsSection}>
      <h2 className={styles.sectionTitle}>PROJECT SHOWCASE</h2>

      <div className={styles.carouselContainer}>
        {projectData.map((project, index) => (
          <div key={project.id} className={`${styles.card} ${getCardClass(index)}`}>
            
            <div className={styles.iframeContainer}>
  <iframe 
    src={project.iframeSrc} 
    title={project.title} 
    className={styles.cardIframe} 
    loading="lazy" 
    sandbox="allow-scripts allow-same-origin" 
  />
</div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDesc}>{project.desc}</p>
              
              {/* 🚀 Both the Tech Stack AND the Links are placed inside the Footer! */}
              <div className={styles.cardFooter}>
                
                <div className={styles.techStack}>
                  {project.tech.map((t, i) => (
                    <span key={i} className={styles.techBadge}>{t}</span>
                  ))}
                </div>

                {/* The missing buttons have been added back here! */}
                <div className={styles.links}>
                  <a href={project.demo} target="_blank" rel="noreferrer" className={styles.linkBtn}>LIVE DEMO</a>
                  <a href={project.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>GITHUB</a>
                </div>

              </div>
              
            </div>

          </div>
        ))}
      </div>

      {/* The glowing command-line style arrows to control the slider */}
      <div className={styles.controls}>
        <button onClick={handlePrev} className={styles.navBtn}>[ &lt; PREV ]</button>
        <button onClick={handleNext} className={styles.navBtn}>[ NEXT &gt; ]</button>
      </div>

    </section>
  );
}