import { useState, useRef, useEffect } from 'react';
import profileImg from '../../assets/safwan.jpeg';
import styles from './Hero.module.css';
import useTypingEffect from '../../effects/useTypingEffect';
import { roles, funFacts, socialLinks, skills } from './Hero.js';

export default function Hero() {
    const containerRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});
    const [showFact, setShowFact] = useState(false);
    const [currentFact, setCurrentFact] = useState('');
    const [scrolled, setScrolled] = useState(false);

    const { text: typedName, done: nameDone } = useTypingEffect("I'm Muhammad Safwan Rabe", 90);
    const { text: typedRole } = useTypingEffect(roles, 90, { cycle: true, active: nameDone });

    useEffect(() => {
        function onScroll() {
            setScrolled(window.scrollY > 150);
        }
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    function handleMouseMove(e) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const percentX = (x - rect.width / 2) / (rect.width / 2);
        const percentY = (y - rect.height / 2) / (rect.height / 2);

        setTiltStyle({
            transform: `rotateX(${-percentY * 12}deg) rotateY(${percentX * 12}deg) scale(1.03)`,
            boxShadow: `${percentX * 15}px ${percentY * 15}px 40px rgba(230,57,70,0.35), inset 0 0 20px rgba(0,0,0,0.5)`
        });
    }

    function handleMouseLeave() {
        setTiltStyle({
            transform: 'rotateX(0deg) rotateY(0deg) scale(1)',
            boxShadow: '0 0 40px rgba(230,57,70,0.2), inset 0 0 20px rgba(0,0,0,0.5)'
        });
    }

    function handleAvatarClick() {
        if (!showFact) {
            setCurrentFact(funFacts[Math.floor(Math.random() * funFacts.length)]);
        }
        setShowFact((prev) => !prev);
    }

    return (
        <section id="home" className={`${styles.heroSection} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.heroContentWrapper}>
                <div
                    className={styles.avatarContainer}
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className={styles.ambientBlob}></div>
                    <img
                        src={profileImg}
                        alt="Muhammad Safwan"
                        className={styles.profileAvatar}
                        style={tiltStyle}
                        onClick={handleAvatarClick}
                    />
                    <div className={`${styles.factCard} ${showFact ? styles.isVisible : ''}`}>
                        <p>{currentFact}</p>
                    </div>
                </div>

                <div className={styles.textContent}>
                    <h1>
                        {typedName}
                        <span className={styles.typingCursor}></span>
                    </h1>

                    {/* 👇 We moved the roleText INSIDE the fade-in block 👇 */}
                    <div className={`${styles.fadeInContent} ${nameDone ? styles.isVisible : ''}`}>
                        
                        <p className={styles.roleText}>
                            I'm a <span className={styles.highlight}>{typedRole}</span>
                        </p>

                        <div className={styles.availabilityBadge}>
                            <span className={styles.pulseDot}></span>
                            Available for work
                        </div>

                        <p className={styles.subtitle}>
                            A passionate final-year Bachelor of Software Engineering student.
                            I specialize in crafting interactive, high-performance web experiences
                            and solving complex problems.
                        </p>

                        <div className={styles.socialLinks}>
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target={link.external ? '_blank' : undefined}
                                    rel={link.external ? 'noopener noreferrer' : undefined}
                                    className={`${styles.btn} ${styles.magneticBtn} ${styles.socialIconBtn}`}
                                    aria-label={link.label}
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                            <a href="#contact" className={`${styles.btn} ${styles.magneticBtn} ${styles.hireActionBtn}`}>
                                <i className="fa-solid fa-envelope"></i>
                                <span>Hire me</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.tickerWrapper}>
                <div className={styles.skillTicker}>
                    <div className={styles.tickerTrack}>
                        <div className={styles.tickerGroup}>
                            {skills.map((skill) => (
                                <span key={`a-${skill.name}`} className={styles.tickerItem}>
                                    <i className={skill.icon}></i>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                        <div className={styles.tickerGroup}>
                            {skills.map((skill) => (
                                <span key={`b-${skill.name}`} className={styles.tickerItem}>
                                    <i className={skill.icon}></i>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <a href="#about" className={`${styles.scrollIndicator} ${scrolled ? styles.hidden : ''}`}>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
            </a>
        </section>  
    );
}