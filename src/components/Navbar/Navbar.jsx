import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { navLinks } from './Navbar.js';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

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

    // 🚀 THE NUCLEAR FIX: Custom Animation Engine
    function handleNavClick(e, target) {
        e.preventDefault();
        const el = document.getElementById(target);
        if (!el) return;

        const navbarHeight = 80; // Offset for your navbar
        const elementPosition = el.getBoundingClientRect().top;
        const targetPosition = elementPosition + window.scrollY - navbarHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        
        let startTime = null;
        const duration = 600; // Animation speed in milliseconds (change to 800 for slower glide)

        // Smooth easing math (Ease-in-out Quad)
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        // Frame-by-frame animation loop
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            
            const nextPosition = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, nextPosition);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            } else {
                // Snap to exact position at the very end to be precise
                window.scrollTo(0, targetPosition);
                setActiveSection(target);
            }
        }

        requestAnimationFrame(animation);
    }

    return (
        <nav className={`${styles.topbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.logo}>
                Safwan<span className={styles.highlight}>.</span>
            </div>

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

            <div className={styles.themeToggleWrapper}>
                <button id="theme-toggle" className={styles.btnIcon} aria-label="Toggle theme">
                    🌙
                </button>
            </div>
        </nav>
    );
}