import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = ({ name }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if already visited in this session
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setLoading(false);
      return;
    }

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem('hasVisited', 'true');
        }, 800);
      }
      setProgress(current);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[10000] bg-bg flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center w-full px-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading tracking-wider uppercase text-text/70 whitespace-nowrap">
                {name || 'Loading'}
              </h1>
            </div>
            
            <div className="w-full max-w-md">
              <div className="flex justify-between text-xs font-accent tracking-widest text-text/70 mb-2">
                <span>INITIALIZING</span>
                <span>{progress}%</span>
              </div>
              
              <div className="w-full h-1 bg-text/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoader;
