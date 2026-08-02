import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { navLinks } from './Navbar.js';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    
    // 🚀 NEW: State for mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false); 

    // 🚀 NEW: Lock screen scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 40);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const sections = navLinks
            .map((link) => document.getElementById(link.target))
            .filter(Boolean);

        if (sections.length === 0) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // Custom Animation Engine
    function handleNavClick(e, target) {
        e.preventDefault();
        
        // 🚀 NEW: Close the mobile menu automatically when a link is clicked
        setIsMenuOpen(false); 
        
        const el = document.getElementById(target);
        if (!el) return;

        const navbarHeight = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const targetPosition = elementPosition + window.scrollY - navbarHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        
        let startTime = null;
        const duration = 600;

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            
            const nextPosition = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, nextPosition);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                window.scrollTo(0, targetPosition);
                setActiveSection(target);
            }
        }

        requestAnimationFrame(animation);
    }

    return (
        <nav className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
            
            {/* 🚀 Wrapped logo in a link so clicking it takes you home & closes menu */}
            <div className={styles.logo}>
                <a href="#home" onClick={(e) => handleNavClick(e, 'home')} style={{ textDecoration: 'none', color: 'inherit' }}>
                    Safwan<span className={styles.highlight}>.</span>
                </a>
            </div>

            {/* DESKTOP LINKS */}
            <ul className={styles.navLinks}>
                {navLinks.map((link) => (
                    <li key={link.target}>
                        <a
                            href={`#${link.target}`}
                            onClick={(e) => handleNavClick(e, link.target)}
                            className={activeSection === link.target ? styles.active : ''}
                        >
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>

            <div className={styles.rightSection}>
                <div className={styles.themeToggleWrapper}>
                    <a 
                        id="theme-toggle" 
                        className={styles.btnIcon} 
                        href="https://youtu.be/dQw4w9WgXcQ" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Secret Link"
                    >
                    </a>
                </div>

                {/* 🚀 NEW: MOBILE HAMBURGER BUTTON */}
                <button 
                    className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`} 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* 🚀 NEW: FULL SCREEN MOBILE OVERLAY */}
            <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileOpen : ''}`}>
                <div className={styles.mobileLinksContainer}>
                    {navLinks.map((link, index) => (
                        <a 
                            key={`mobile-${link.target}`} 
                            href={`#${link.target}`} 
                            className={`${styles.mobileLink} ${activeSection === link.target ? styles.mobileActive : ''}`} 
                            onClick={(e) => handleNavClick(e, link.target)}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <span className={styles.mobileNum}>0{index + 1}</span> 
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}