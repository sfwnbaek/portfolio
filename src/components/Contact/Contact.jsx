import React, { useState, useEffect } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [status, setStatus] = useState('idle'); // 'idle', 'holding', 'sent'
  const [progress, setProgress] = useState(0);

  // This effect handles the filling of the energy bar
  useEffect(() => {
    let timer;
    if (status === 'holding' && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setStatus('sent'); // Trigger success when it hits 100%
            return 100;
          }
          return prev + 2; // Increases progress by 2% every 30ms (~1.5 seconds total hold)
        });
      }, 30);
    } else if (status === 'idle') {
      setProgress(0); // Instantly reset if they let go early
    }
    
    return () => clearInterval(timer);
  }, [status, progress]);

  // Handle Mouse / Touch down
  const startHold = (e) => {
    e.preventDefault(); // Prevents text selection while holding
    if (status === 'sent') return;
    setStatus('holding');
  };

  // Handle Mouse / Touch release or leaving the button
  const endHold = () => {
    if (status === 'sent') return;
    setStatus('idle');
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.commsPanel}>
        <h2 className={styles.sectionTitle}>ESTABLISH LINK</h2>
        <p className={styles.subtitle}>// INITIATE SECURE HANDSHAKE</p>

        <form className={styles.formGroup} onSubmit={(e) => e.preventDefault()}>
          <input 
            type="text" 
            placeholder="NAME / ALIAS" 
            className={styles.inputField} 
            required 
          />
          <input 
            type="email" 
            placeholder="ENCRYPTED EMAIL" 
            className={styles.inputField} 
            required 
          />
          <textarea 
            placeholder="TRANSMISSION DATA..." 
            className={styles.inputField} 
            required 
          ></textarea>
        </form>

        {/* The Hold-to-Transmit Button */}
        <button 
          className={`
            ${styles.transmitBtn} 
            ${status === 'holding' ? styles.isHolding : ''} 
            ${status === 'sent' ? styles.isSent : ''}
          `}
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
        >
          {/* The red bar that visually fills up behind the text */}
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
          
          <span className={styles.btnText}>
            {status === 'sent' ? '[ TRANSMISSION SUCCESS ]' : '[ HOLD TO TRANSMIT ]'}
          </span>
        </button>
      </div>
    </section>
  );
}