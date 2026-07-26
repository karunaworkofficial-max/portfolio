import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import webGLFluidEnhanced from 'webgl-fluid';

const PremiumBackground = () => {
  const canvasRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    if (canvasRef.current) {
      webGLFluidEnhanced(canvasRef.current, {
        IMMEDIATE: false,
        TRIGGER: 'hover',
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 3,
        VELOCITY_DISSIPATION: 1,
        PRESSURE: 0.1,
        CURL: 20,
        SPLAT_RADIUS: 0.3,
        SPLAT_FORCE: 3000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 10,
        TRANSPARENT: true,
        BLOOM: true,
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.4,
        BLOOM_THRESHOLD: 0.4,
        SUNRAYS: false,
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] pointer-events-auto overflow-hidden bg-bg">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 mix-blend-screen" />
      
      {/* Subtle Floating Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-[120px] animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/10 blur-[150px] animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[140px] animate-blob animation-delay-4000 pointer-events-none" />
    </div>
  );
};

export default PremiumBackground;
