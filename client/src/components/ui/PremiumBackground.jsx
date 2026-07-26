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

      {/* 1b. Neon Perspective Grid (Cyberpunk style) */}
      <div className="absolute inset-0 overflow-hidden" style={{ perspective: '800px' }}>
        <div 
          className="absolute w-[200%] h-[200%] -left-[50%] -top-[50%] opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, var(--color-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-primary) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            transform: 'rotateX(75deg) translateY(100px) scale(1)',
            maskImage: 'radial-gradient(ellipse at center, #000 0%, transparent 60%)',
          }}
        />
      </div>

      {/* 2. Interactive Spotlight tracking mouse */}
      <div 
        className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity duration-300 mix-blend-screen"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-primary), transparent 40%)`,
        }}
      />

      {/* 3. Floating Ambient Neon Fluid Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[100px] mix-blend-screen animate-blob shadow-[0_0_100px_var(--color-primary)]" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/20 blur-[120px] mix-blend-screen animate-blob animation-delay-2000 shadow-[0_0_100px_var(--color-secondary)]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/20 blur-[150px] mix-blend-screen animate-blob animation-delay-4000 shadow-[0_0_100px_var(--color-accent)]" />
      
      {/* 4. Scanner Laser Beam */}
      <div className="absolute top-0 left-0 w-[200%] h-1 bg-primary/30 blur-[2px] opacity-20 shadow-[0_0_15px_var(--color-primary)] animate-laser-scan rotate-45 transform origin-top-left" />
    </div>
  );
};

export default PremiumBackground;
