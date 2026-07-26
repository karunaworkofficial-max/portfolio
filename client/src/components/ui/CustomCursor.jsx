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

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dot) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const loop = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };

    const onMouseDown = () => {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(0.8)`;
      if (dot) dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.5)`;
    };
    const onMouseUp = () => {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1)`;
      if (dot) dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(1)`;
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
    const rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isTouch) return null;

  let cursorClasses = "fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out";
  let dotClasses = "fixed top-0 left-0 pointer-events-none z-[10000] rounded-full -translate-x-1/2 -translate-y-1/2";
  
  let content = null;

  if (style === 'circle' || !style) {
    cursorClasses += " w-9 h-9 border-2 border-primary";
    dotClasses += " w-1.5 h-1.5 bg-primary";
    
    if (hoverType === 'view') {
      cursorClasses += " w-20 h-20 bg-primary/20 backdrop-blur-sm border-transparent mix-blend-difference";
      dotClasses += " opacity-0";
      content = <span className="absolute inset-0 flex items-center justify-center text-[10px] font-accent uppercase text-text tracking-widest mix-blend-normal">View</span>;
    } else if (hoverType === 'link' || hoverType === 'pointer') {
      cursorClasses += " w-14 h-14 bg-primary/10 backdrop-blur-[1px]";
      dotClasses += " scale-50";
    }
  } else if (style === 'dot') {
    cursorClasses += " hidden";
    dotClasses += " w-3 h-3 bg-primary transition-all duration-300";
    if (hoverType) {
      dotClasses += " w-10 h-10 mix-blend-difference bg-white";
    }
  }

  return (
    <>
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
