import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../utils/animations';

const ColorPalette = ({ colors }) => {
  const [copied, setCopied] = useState(null);

  if (!colors || colors.length === 0) return null;

  const handleCopy = (color) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mt-8 pt-8 border-t border-text/20">
      <h4 className="text-sm font-accent uppercase tracking-widest opacity-60 mb-6 text-center md:text-left">Color Palette</h4>
      <motion.div 
        variants={staggerContainer} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true }}
        className="flex flex-wrap justify-center md:justify-start gap-8"
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { scale: 0.8, opacity: 0 },
              visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
            }}
            className="group relative cursor-pointer flex flex-col items-center"
            onClick={() => handleCopy(color)}
          >
            <div 
              className="w-20 h-20 rounded-full shadow-lg border border-text/20 mb-3 group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-accent uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
              {color}
            </span>
            
            {copied === color && (
              <div className="absolute -top-10 bg-surface border border-text/20 text-primary text-xs font-accent px-3 py-1 rounded-full shadow-lg animate-bounce">
                Copied!
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ColorPalette;
