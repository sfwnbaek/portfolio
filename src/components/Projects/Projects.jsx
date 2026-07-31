import React from 'react';
import styles from './Projects.module.css';

const projectsData = [
  {
    title: "AI Code Reviewer",
    description: "An automated pull-request code reviewer powered by LLMs that analyzes performance bottlenecks and security vulnerabilities.",
    tech: ["TypeScript", "React", "Node.js", "OpenAI API"],
    github: "https://github.com",
    demo: "https://demo.com"
  },
  {
    title: "Real-time Chat Engine",
    description: "Low-latency websockets chat application capable of handling high-concurrency room creation and encrypted messaging.",
    tech: ["Java", "Spring Boot", "React", "WebSocket"],
    github: "https://github.com",
    demo: "https://demo.com"
  },
  {
    title: "Distributed File Store",
    description: "A lightweight distributed storage engine written in C++ showcasing custom replication protocols and high availability.",
    tech: ["C++", "Python", "Docker", "gRPC"],
    github: "https://github.com",
    demo: "https://demo.com"
  }
];

export default function Projects() {
  return (
    <section id="projects" className={styles.projectsSection}>
      <h2 className={styles.sectionTitle}>
        Featured <span>Projects</span>
      </h2>

      <div className={styles.grid}>
        {projectsData.map((project, idx) => (
          <div key={idx} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>

            <div className={styles.techList}>
              {project.tech.map((t, i) => (
                <span key={i} className={styles.badge}>{t}</span>
              ))}
            </div>

            <div className={styles.links}>
              <a href={project.github} target="_blank" rel="noreferrer" className={styles.linkBtn}>GitHub</a>
              <a href={project.demo} target="_blank" rel="noreferrer" className={styles.linkBtn}>Live Demo</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}