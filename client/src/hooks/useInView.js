import { useState, useEffect } from 'react';

export const useInView = (ref, options = { threshold: 0.1, triggerOnce: true }) => {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (options.triggerOnce) {
          observer.unobserve(entry.target);
        }
      } else {
        if (!options.triggerOnce) {
          setIsInView(false);
        }
      }
    }, options);

    observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options.threshold, options.triggerOnce]);

  return isInView;
};
