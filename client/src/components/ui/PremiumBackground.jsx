import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PremiumBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const location = useLocation();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-bg">
      {/* 1. Base Grid Pattern for texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
        style={{
          backgroundImage: 'linear-gradient(to right, var(--color-text) 1px, transparent 1px), linear-gradient(to bottom, var(--color-text) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Interactive Spotlight tracking mouse */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-primary), transparent 40%)`,
        }}
      />

      {/* 3. Floating Ambient Orbs (Glassmorphism blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] mix-blend-screen animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
    </div>
  );
};

export default PremiumBackground;
