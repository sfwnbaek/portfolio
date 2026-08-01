import React from 'react';
import styles from './Contact.module.css';
import { contactData } from './ContactData';

export default function Contact() {
  return (
    <section id="contact" className={styles.contactSection}>
      
      {/* 📡 Background Radar Animation */}
      <div className={styles.beaconContainer}>
        <div className={styles.beaconRing}></div>
        <div className={styles.beaconRing}></div>
        <div className={styles.beaconRing}></div>
      </div>

      <h2 className={styles.sectionTitle}>CONTACT ME</h2>

      {/* 📇 The Glassmorphic Cards */}
      <div className={styles.cardGrid}>
        {contactData.map((contact) => (
          <a 
            key={contact.id} 
            href={contact.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.contactCard}
          >
            <div className={styles.iconWrapper}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d={contact.icon} />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>{contact.title}</h3>
            <span className={styles.cardLabel}>{contact.label}</span>
          </a>
        ))}
      </div>

      {/* 🔒 Final Footer Sign-off */}
      <div className={styles.systemFooter}>
        MUHAMMAD SAFWAN BIN RABE // SOFTWARE ENGINEER
      </div>
      
    </section>
  );
}