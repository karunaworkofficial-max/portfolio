import React, { useState, useRef, useEffect } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - left;
    const newPos = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPos(newPos);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', handleMouseUp);
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleDrag, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('touchstart', handleMouseDown, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('touchstart', handleMouseDown);
      }
      handleMouseUp();
    };
  }, []);

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-custom select-none cursor-ew-resize group" ref={containerRef}>
      {/* After Image (Background) */}
      <img src={afterImage} alt="After" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      
      {/* Before Image (Foreground, clipped) */}
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-primary pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img src={beforeImage} alt="Before" className="absolute inset-0 w-full h-full object-cover min-w-full max-w-none" />
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-primary pointer-events-none flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${sliderPos}% - 2px)` }}
      >
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 8L4 12L8 16M16 8L20 12L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-text text-xs font-accent tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">BEFORE</div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-text text-xs font-accent tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">AFTER</div>
    </div>
  );
};

export default BeforeAfterSlider;
