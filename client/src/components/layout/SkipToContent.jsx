import React from 'react';

const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="absolute top-0 left-0 p-3 bg-primary text-text -translate-y-full focus:translate-y-0 transition-transform z-[9999] font-accent uppercase tracking-widest text-xs outline-none focus:ring-4 focus:ring-white"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
