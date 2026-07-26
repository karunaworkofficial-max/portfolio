import React from 'react';
import { useLocation } from 'react-router-dom';

const PremiumBackground = () => {
  const location = useLocation();

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-bg">
      {/* Subtle Floating Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 blur-[150px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[140px] animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
};

export default PremiumBackground;
