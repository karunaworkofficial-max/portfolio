import React, { useState, useRef } from 'react';
import { useAnimationFrame } from 'framer-motion';

const HoverGlowImage = ({ src, alt }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div 
      className="relative h-full shrink-0 flex items-center justify-center rounded-custom border border-white/10 shadow-2xl overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src={src} 
        alt={alt}
        className="h-full w-auto object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        draggable="false"
      />
      {/* Spotlight Cursor Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.3), transparent 60%)`
        }}
      />
    </div>
  );
};

const FilmStripSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const containerRef = useRef(null);
  const x = useRef(0);
  
  if (!images || images.length === 0) return null;

  const originalLength = images.length;
  // Duplicate images multiple times to guarantee no blank gaps for projects with only 1 or 2 images
  const COPIES = 8;
  const loopImages = Array(COPIES).fill(images).flat();

  useAnimationFrame((time, delta) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    
    // Base speed, adjust as needed
    const speed = 0.15;
    x.current -= speed * delta;
    
    const scrollWidth = container.scrollWidth;
    // The width of exactly one complete original set of images
    const singleCopyWidth = scrollWidth / COPIES; 
    
    // Seamless loop reset: jump back to 0 once we've scrolled exactly one full original set
    if (Math.abs(x.current) >= singleCopyWidth) {
      x.current = 0;
    }
    
    container.style.transform = `translateX(${x.current}px)`;
    
    // Determine which image is closest to the center of the screen
    const windowCenter = window.innerWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;
    
    // We only need to check the first 'originalLength' children + maybe a few to be safe, 
    // but checking all children is fine for performance if it's < 20 images.
    const children = Array.from(container.children);
    
    children.forEach((child, index) => {
      const rect = child.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      const distance = Math.abs(childCenter - windowCenter);
      
      if (distance < minDistance) {
        minDistance = distance;
        // Map back to original index
        closestIndex = index % originalLength;
      }
    });
    
    // Only update state if it changed to prevent excessive re-renders
    if (closestIndex + 1 !== currentIndex) {
      setCurrentIndex(closestIndex + 1);
    }
  });

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-bg z-0 flex items-center">
      <div 
        ref={containerRef}
        className="flex h-[80%] w-max will-change-transform gap-8 px-4 items-center"
      >
        {loopImages.map((img, i) => (
          <HoverGlowImage key={i} src={img.url || img} alt={`Slide ${i}`} />
        ))}
      </div>
      
      {/* Dynamic Counter */}
      <div className="absolute bottom-12 right-12 md:bottom-16 md:right-16 z-10 flex items-center gap-4 bg-black/60 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 shadow-2xl">
        <span className="text-white font-heading text-2xl md:text-3xl w-8 text-center">
          {currentIndex.toString().padStart(2, '0')}
        </span>
        <span className="text-white/70 font-accent text-sm tracking-widest">/</span>
        <span className="text-white/70 font-accent text-sm tracking-widest w-8 text-center">
          {originalLength.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default FilmStripSlider;
