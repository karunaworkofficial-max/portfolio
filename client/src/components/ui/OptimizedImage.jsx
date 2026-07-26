import React, { useState } from 'react';
import { getOptimizedUrl, generateSrcSet } from '../../utils/imageUtils';

const OptimizedImage = ({ src, alt, className, sizes = "100vw", ...props }) => {
  const [loaded, setLoaded] = useState(false);
  
  // Low quality image placeholder (blur)
  const lqip = src && src.includes('cloudinary.com') 
    ? src.replace('/upload/', '/upload/f_auto,q_auto,w_50,e_blur:1000/')
    : src;

  return (
    <div className={`relative overflow-hidden bg-text/10 ${className}`}>
      {/* Blurred placeholder */}
      {lqip && (
        <img 
          src={lqip} 
          alt="" 
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${loaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`} 
        />
      )}
      
      {/* Actual optimized image */}
      <img
        src={getOptimizedUrl(src, 1280) || src}
        srcSet={generateSrcSet(src)}
        sizes={sizes}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`relative w-full h-full object-cover transition-all duration-700 ease-out ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
