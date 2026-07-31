import React from 'react';
import styles from './Skills.module.css';

const skillCategories = [
  {
    category: "Languages",
    skills: ["Java", "Python", "JavaScript", "TypeScript", "C++", "HTML/CSS"]
  },
  {
    category: "Frameworks",
    skills: ["React", "Astro", "Next.js", "Node.js", "Express", "Spring Boot"]
  },
  {
    category: "Databases & Cloud",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Docker", "Git", "Vercel"]
  }
];

export default function Skills() {
  return (
    <section id="skills" className={styles.skillsSection}>
      <h2 className={styles.sectionTitle}>
        Technical <span>Skills</span>
      </h2>

      <div className={styles.categoriesGrid}>
        {skillCategories.map((cat, idx) => (
          <div key={idx} className={styles.categoryCard}>
            <h3 className={styles.categoryTitle}>// {cat.category}</h3>
            <div className={styles.skillList}>
              {cat.skills.map((skill, i) => (
                <span key={i} className={styles.skillPill}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}