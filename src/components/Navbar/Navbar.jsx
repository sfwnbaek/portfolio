import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { navLinks } from './Navbar.js';

export default function Navbar() {
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);

    // 🚀 State for mobile menu
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 🚀 Lock screen scrolling when mobile menu is open
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

    // --- Active nav link highlighting ---
    // Was previously using IntersectionObserver with threshold: 0.4 and a
    // large negative rootMargin. That combo requires 40% of a section to be
    // visible inside an already-shrunk viewport, which sections taller than
    // the viewport (e.g. About Me with a terminal + image) may never satisfy
    // — so isIntersecting never fires true and activeSection gets stuck.
    //
    // This version instead tracks which section's top has most recently
    // scrolled past the navbar offset. Works correctly regardless of how
    // tall each individual section is.
    useEffect(() => {
        const sections = navLinks
            .map((link) => document.getElementById(link.target))
            .filter(Boolean);

        if (sections.length === 0) return undefined;

        const navbarHeight = 80;

        function onSectionScroll() {
            // If we've scrolled (near) the bottom of the page, force the last
            // section active — the final section may be too short (or the
            // page not tall enough below it) for its top to ever cross the
            // navbarHeight threshold via the loop below.
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

            if (scrolledToBottom) {
                setActiveSection(sections[sections.length - 1].id);
                return;
            }

            let current = sections[0].id;

            for (const section of sections) {
                const top = section.getBoundingClientRect().top;
                if (top - navbarHeight - 10 <= 0) {
                    current = section.id;
                } else {
                    break;
                }
            }

            setActiveSection(current);
        }

        onSectionScroll(); // set correct state on initial mount/scroll position
        window.addEventListener('scroll', onSectionScroll, { passive: true });
        window.addEventListener('resize', onSectionScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onSectionScroll);
            window.removeEventListener('resize', onSectionScroll);
        };
    }, []);

    // Custom Animation Engine
    function handleNavClick(e, target) {
        e.preventDefault();

        // 🚀 Close the mobile menu automatically when a link is clicked
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

                {/* 🚀 MOBILE HAMBURGER BUTTON */}
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

            {/* 🚀 FULL SCREEN MOBILE OVERLAY */}
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