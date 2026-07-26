import React, { useEffect, useRef, useState } from 'react';

const CustomCursor = ({ style = 'circle' }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [hoverType, setHoverType] = useState(null);
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia("(any-hover: none)").matches) {
      setIsTouch(true);
      return;
    }

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (dot) dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (cursor) cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      const spotlight = document.getElementById('cursor-spotlight');
      if (spotlight) {
        spotlight.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
    };

    const onMouseDown = () => {
      if (cursor) cursor.style.transform += ` scale(0.8)`;
      if (dot) dot.style.transform += ` scale(0.5)`;
    };
    const onMouseUp = () => {
      if (cursor) cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
      if (dot) dot.style.transform = dot.style.transform.replace(' scale(0.5)', '');
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, select, textarea');
      if (target) {
        const type = target.getAttribute('data-cursor') || 
                     (target.tagName.toLowerCase() === 'a' ? 'link' : 'pointer');
        setHoverType(type);
      } else {
        setHoverType(null);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouch) return null;

  let cursorClasses = "fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out";
  let dotClasses = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full -translate-x-1/2 -translate-y-1/2";
  
  let content = null;

  if (style === 'circle' || !style) {
    cursorClasses += " w-9 h-9 border-2 border-primary shadow-[0_0_10px_var(--color-primary),inset_0_0_10px_var(--color-primary)]";
    dotClasses += " w-1.5 h-1.5 bg-primary shadow-[0_0_8px_var(--color-primary)]";
    
    if (hoverType === 'view') {
      cursorClasses += " w-20 h-20 bg-primary/20 backdrop-blur-sm border-transparent mix-blend-screen shadow-[0_0_30px_var(--color-primary)]";
      dotClasses += " opacity-0";
      content = <span className="absolute inset-0 flex items-center justify-center text-[10px] font-accent uppercase text-white tracking-widest drop-shadow-md">View</span>;
    } else if (hoverType === 'link' || hoverType === 'pointer') {
      cursorClasses += " w-14 h-14 bg-primary/10 backdrop-blur-[1px] shadow-[0_0_20px_var(--color-primary),inset_0_0_15px_var(--color-primary)]";
      dotClasses += " scale-50";
    }
  } else if (style === 'dot') {
    cursorClasses += " hidden";
    dotClasses += " w-3 h-3 bg-primary transition-all duration-300 shadow-[0_0_12px_var(--color-primary)]";
    if (hoverType) {
      dotClasses += " w-12 h-12 mix-blend-screen bg-primary/80 shadow-[0_0_30px_var(--color-primary)]";
    }
  }

  return (
    <>
      <div id="cursor-spotlight" className="fixed top-0 left-0 w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-screen transition-opacity duration-500 opacity-50" />
      <div ref={cursorRef} className={cursorClasses}>
        {content}
      </div>
      {style !== 'ring' && (
        <div ref={dotRef} className={dotClasses} />
      )}
    </>
  );
};

export default CustomCursor;
