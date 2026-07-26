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
      {/* 1. Realistic Matte Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* 2. Interactive Premium Spotlight */}
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-15 transition-opacity duration-300 mix-blend-soft-light"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-primary), transparent 40%)`,
        }}
      />

      {/* 3. Subtle Floating Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 blur-[150px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[140px] animate-blob animation-delay-4000" />
    </div>
  );
};

export default PremiumBackground;
