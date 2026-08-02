import React, { useRef, useState } from 'react';
import styles from './Skills.module.css';
import { skillsData } from './SkillsData';

// Individual Server Blade Component (Handles the 3D Math)
const SkillCard = ({ data }) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Find mouse position relative to the card's center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Calculate rotation angles (divide by a number to control tilt intensity)
    const rotateX = -(y / 15); 
    const rotateY = x / 15;

    setTransformStyle(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    // Snap back to flat when mouse leaves
    setTransformStyle('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div 
      className={styles.bladeWrapper}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      <div className={styles.blade}>
        
        <div className={styles.bladeHeader}>
          <svg className={styles.iconWrapper} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={data.icon} />
          </svg>
          <h3 className={styles.categoryTitle}>{data.category}</h3>
        </div>

        <ul className={styles.skillList}>
          {data.skills.map((skill, index) => (
            <li key={index} className={styles.skillItem}>{skill}</li>
          ))}
        </ul>

      </div>
    </div>
  );
};

// Main Section Component
export default function Skills() {
  return (
    <section id="skills" className={styles.skillsSection}>
      
      {/* 🚀 Updated Title Block with Dual Cyber-Lines */}
      <div className={styles.titleContainer}>
        <h2 className={styles.sectionTitle}>Skills</h2>
      </div>

      <div className={styles.gridContainer}>
        {skillsData.map((category) => (
          <SkillCard key={category.id} data={category} />
        ))}
      </div>
      
    </section>
  );
}