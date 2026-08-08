// src/components/NowStatus/NowStatus.jsx
import React, { useState } from 'react';
import styles from './NowStatus.module.css';

// Easily add, edit, or remove status entries here
export const statusData = [
  {
    id: "1",
    label: "[LEARNING]:",
    text: "Java Spring Boot, LLM Models using Python"
  },
  {
    id: "2",
    label: "[PROJECT]:",
    text: "Full-stack Clothing E-commerce Platform with Spring Boot backend and React frontend"
  }
];

export default function NowStatus() {
  // 🚀 THE FIX: Set the initial state to true so it starts closed!
  const [isMinimized, setIsMinimized] = useState(true);

  return (
    <div className={`${styles.floatingHud} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.cardHeader} onClick={() => setIsMinimized(!isMinimized)}>
        <div className={styles.headerLeft}>
          <span className={styles.livePulse}></span>
          <span className={styles.headerText}>SYSTEM_STATUS // LIVE</span>
        </div>
        <button className={styles.toggleBtn} aria-label="Toggle HUD">
          <i className={`fa-solid ${isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
      </div>
      
      {!isMinimized && (
        <div className={styles.statusBody}>
          {statusData.map((item) => (
            <div key={item.id} className={styles.statusItem}>
              <span className={styles.label}>{item.label}</span>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}