import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    let timeoutId;
    const updateMousePosition = ev => {
      if (timeoutId) {
        window.cancelAnimationFrame(timeoutId);
      }
      timeoutId = window.requestAnimationFrame(() => {
        setMousePosition({
          x: ev.clientX,
          y: ev.clientY,
          normalizedX: (ev.clientX / window.innerWidth) * 2 - 1,
          normalizedY: -(ev.clientY / window.innerHeight) * 2 + 1
        });
      });
    };
    
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      if (timeoutId) window.cancelAnimationFrame(timeoutId);
    };
  }, []);

  return mousePosition;
};
