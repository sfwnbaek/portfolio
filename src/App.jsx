import React, { useState, useEffect } from 'react'; // 🚀 Added useState and useEffect
import MatrixBackground from './effects/MatrixBackground.jsx';             
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx'; 
import Projects from './components/Projects/Projects.jsx';
import Skills from './components/Skills/Skills.jsx';
import Contact from './components/Contact/Contact.jsx';
import MusicPlayer from './components/MusicPlayer/MusicPlayer.jsx'; 

export default function App() {
  // 🚀 NEW: State to track if the user is on a mobile device
  const [isMobile, setIsMobile] = useState(false);

  // 🚀 NEW: Detect screen size on load and when resizing
  useEffect(() => {
    const handleResize = () => {
      // If the screen is 768px or smaller, it's mobile
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check immediately when the app loads
    handleResize(); 
    
    // Listen for screen size changes (if they flip their phone or resize browser)
    window.addEventListener('resize', handleResize);
    
    // Cleanup listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      
      {/* 🚀 LAYER 2: Interactive Matrix Rain (NOW ONLY LOADS ON DESKTOP) */}
      {!isMobile && <MatrixBackground />}
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main Page Content */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <MusicPlayer />
      
    </div>
  );
}