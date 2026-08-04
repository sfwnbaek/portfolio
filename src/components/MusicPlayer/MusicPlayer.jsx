import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './MusicPlayer.module.css';

// 🎵 1. IMPORT YOUR AUDIO FILES HERE (Make sure these match your exact file names!)
import nightCruisingAudio from '../../assets/audio/NightCruising.mp3';
import robertMilesAudio from '../../assets/audio/ChildrenRobertMiles.mp3';

// 🖼️ 2. IMPORT YOUR COVER ART HERE (Make sure these match your exact file names!)
import momokoKikuchiCover from '../../assets/images/MomokoKikuchi.jpg';
import robertMilesCover from '../../assets/images/RobertMiles.jpg';

// 3. MAP THE IMPORTED VARIABLES TO THE TRACKS
const tracks = [
  {
    title: 'Children',
    artist: 'Robert Miles',
    src: robertMilesAudio,
    cover: robertMilesCover,
  },
  {
    title: 'Night Cruising',
    artist: 'Momoko Kikuchi',
    src: nightCruisingAudio,   // <-- Using the variable, no quotes!
    cover: momokoKikuchiCover, // <-- Using the variable, no quotes!
  }

];

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isDragging, setIsDragging] = useState(false);
  
  const [volume, setVolume] = useState(80);
  const [lastVolume, setLastVolume] = useState(80);

  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const playerRef = useRef(null);

  const currentTrack = tracks[index];

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const loadTrack = (newIndex, autoplay) => {
    setIndex(newIndex);
    setProgress(0);
    setCurrentTime('0:00');
    if (autoplay) {
      setTimeout(() => {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }, 50);
    }
  };

  const togglePlay = () => {
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const skip = (direction) => {
    const next = (index + direction + tracks.length) % tracks.length;
    loadTrack(next, isPlaying);
  };

  const seekFromEvent = useCallback((e) => {
    if (!trackRef.current || !audioRef.current.duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    
    audioRef.current.currentTime = ratio * audioRef.current.duration;
    setProgress(ratio * 100);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    seekFromEvent(e);
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (isDragging) seekFromEvent(e);
    };
    const handlePointerUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, seekFromEvent]);

  const handleTimeUpdate = () => {
    if (isDragging) return;
    const { currentTime: cTime, duration: dur } = audioRef.current;
    if (!dur) return;
    setProgress((cTime / dur) * 100);
    setCurrentTime(formatTime(cTime));
  };

  const handleLoadedMetadata = () => {
    setDuration(formatTime(audioRef.current.duration));
  };

  const handleVolume = (e) => {
    const val = Number(e.target.value);
    setVolume(val);
    audioRef.current.volume = val / 100;
    audioRef.current.muted = val === 0;
  };

  const toggleMute = () => {
    if (audioRef.current.muted || volume === 0) {
      const restoreVol = lastVolume > 0 ? lastVolume : 80;
      setVolume(restoreVol);
      audioRef.current.volume = restoreVol / 100;
      audioRef.current.muted = false;
    } else {
      setLastVolume(volume);
      setVolume(0);
      audioRef.current.muted = true;
    }
  };

  const handleProgressKeyDown = (e) => {
    const step = 5; 
    if (e.key === 'ArrowRight') audioRef.current.currentTime = Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + step);
    if (e.key === 'ArrowLeft') audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - step);
  };

  const handleFocusOut = (e) => {
    if (!playerRef.current.contains(e.relatedTarget)) setIsOpen(false);
  };

  return (
    <div 
      ref={playerRef}
      className={`${styles['music-deck']} ${isOpen ? styles['is-open'] : ''} ${isPlaying ? styles['is-playing'] : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={handleFocusOut}
    >
      
      {/* 1. The Turntable Button (Must be first to layer correctly) */}
      <button 
        className={styles['deck-disc']} 
        onClick={togglePlay}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); togglePlay(); } }}
        aria-pressed={isPlaying}
        aria-label="Play music"
      >
        <span className={styles['disc-art']} style={{ backgroundImage: `url(${currentTrack.cover})` }}></span>
        <span className={styles['disc-grooves']}></span>
        <span className={styles['disc-hole']}></span>
        
        <svg className={`${styles['deck-icon']} ${styles['icon-play']}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
        <svg className={`${styles['deck-icon']} ${styles['icon-pause']}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>
      </button>

      {/* 2. Tonearm (Must be a sibling, purely decorative) */}
      <div className={styles['deck-tonearm']} aria-hidden="true">
        <span className={styles['tonearm-arm']}></span>
        <span className={styles['tonearm-pivot']}></span>
      </div>

      {/* 3. The Sliding Panel (Unfurls to the right of the disc) */}
      <div className={styles['deck-panel']} role="region" aria-label="Music player controls">
        
        <div className={styles['deck-info']}>
          <p className={styles['deck-title']}>{currentTrack.title}</p>
          <p className={styles['deck-artist']}>{currentTrack.artist}</p>
        </div>

        <div className={styles['deck-progress-row']}>
          <span className={styles['deck-time']}>{currentTime}</span>
          
          <div 
            ref={trackRef}
            className={`${styles['deck-progress-track']} ${isDragging ? styles['is-dragging'] : ''}`}
            onPointerDown={handlePointerDown}
            onKeyDown={handleProgressKeyDown}
            role="slider"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(progress)}
            tabIndex="0"
          >
            <div className={styles['deck-progress-fill']} style={{ width: `${progress}%` }}></div>
            <div className={styles['deck-progress-handle']} style={{ left: `${progress}%` }}></div>
          </div>

          <span className={styles['deck-time']}>{duration}</span>
        </div>

        <div className={styles['deck-controls-row']}>
          <button className={styles['deck-btn']} onClick={() => skip(-1)} aria-label="Previous track">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" fill="currentColor"/></svg>
          </button>
          
          <button className={`${styles['deck-btn']} ${styles['deck-btn-main']}`} onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
             <svg className={styles['icon-play']} viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
             <svg className={styles['icon-pause']} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" fill="currentColor"/></svg>
          </button>
          
          <button className={styles['deck-btn']} onClick={() => skip(1)} aria-label="Next track">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 6h2v12h-2zM6 6l8.5 6L6 18z" fill="currentColor"/></svg>
          </button>
        </div>

        <div className={`${styles['deck-volume']} ${volume === 0 ? styles['is-muted'] : ''}`}>
          <button className={styles['deck-btn']} onClick={toggleMute} aria-label={volume === 0 ? "Unmute" : "Mute"}>
             <svg className={styles['icon-vol-high']} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                 <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                 <path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
                 <path d="M18.5 6a8 8 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.6"/>
             </svg>
             <svg className={styles['icon-vol-muted']} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                 <path d="M4 9v6h4l5 5V4L8 9H4z"/>
                 <path d="m16 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
             </svg>
          </button>
          
          <input 
            type="range" 
            min="0" max="100" 
            value={volume} 
            onChange={handleVolume} 
            className={styles['deck-volume-slider']}
            style={{ '--vol': `${volume}%` }}
            aria-label="Volume"
          />
        </div>

        <button className={styles['deck-collapse']} onClick={() => setIsOpen(false)} aria-label="Minimize player">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => skip(1)}
        preload="metadata"
      />
    </div>
  );
}