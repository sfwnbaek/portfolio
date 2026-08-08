import React from 'react';
import MatrixBackground from './effects/MatrixBackground.jsx';             // 💻 The overlay layer
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx'; 
import Projects from './components/Projects/Projects.jsx';
import Skills from './components/Skills/Skills.jsx';
import Contact from './components/Contact/Contact.jsx';
import MusicPlayer from './components/MusicPlayer/MusicPlayer.jsx';
import NowStatus from './components/NowStatus/NowStatus.jsx';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      


      {/* LAYER 2: Interactive Matrix Rain (z-index: -1, mix-blend-mode: screen) */}
      <MatrixBackground />

      {/* Floating System Status HUD */}
      <NowStatus />
      
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