import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalLoader = ({ name, logo }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // The loader will run once on mount (which happens on first load and refresh)

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
        }, 1200);
      }
      setProgress(current);
    }, 350); // Increased interval for 3-4s total loading time

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
          className="fixed inset-0 z-[10000] bg-bg flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Subtle neon grid background in loader */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

          <div className="flex flex-col items-center w-full px-6 relative z-10">
            <div className="relative mb-16 flex justify-center items-center h-32">
              <div className="absolute w-64 h-64 bg-primary/20 blur-[80px] rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute w-32 h-32 bg-accent/20 blur-[50px] rounded-full animate-pulse mix-blend-screen" style={{ animationDuration: '2s', animationDelay: '1s' }} />
              
              {logo ? (
                <img src={logo} alt="Loading" className="w-32 h-32 object-contain relative z-10 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] animate-pulse" style={{ animationDuration: '3s' }} />
              ) : (
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-heading tracking-wider uppercase text-text/90 whitespace-nowrap relative z-10 tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  {name || 'Loading'}
                </h1>
              )}
            </div>
            
            <div className="w-full max-w-md mt-4">
              <div className="flex justify-between text-[10px] font-accent tracking-[0.3em] text-text/50 mb-4 uppercase">
                <span className="animate-pulse">System Initializing</span>
                <span>{progress}%</span>
              </div>
              
              <div className="w-full h-[2px] bg-text/10 overflow-hidden relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-primary via-accent to-primary absolute top-0 left-0 shadow-[0_0_10px_var(--color-primary)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
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
