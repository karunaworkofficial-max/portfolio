import React, { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev }) => {
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const imageRef = useRef(null);

  const ZOOM_LEVEL = 2.5;
  const LENS_WIDTH = 400;
  const LENS_HEIGHT = 250;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isZoomMode) setIsZoomMode(false);
      else onClose();
    }
    if (e.key === 'ArrowRight') { setIsZoomMode(false); onNext(); }
    if (e.key === 'ArrowLeft') { setIsZoomMode(false); onPrev(); }
  }, [onClose, onNext, onPrev, isZoomMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
      setIsZoomMode(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleMouseMove = (e) => {
    if (!isZoomMode || !imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    
    let x = e.clientX - left;
    let y = e.clientY - top;

    x = Math.max(0, Math.min(x, width));
    y = Math.max(0, Math.min(y, height));

    setMousePos({ x, y });
    setImageSize({ w: width, h: height });
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsZoomMode(!isZoomMode);
    if (!isZoomMode) {
      handleMouseMove(e);
    }
  };

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex]?.url || images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm select-none"
        onClick={() => { setIsZoomMode(false); onClose(); }}
      >
        <button 
          className="absolute top-6 right-6 text-text/70 hover:text-text z-[110] text-2xl font-body p-2"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          ✕
        </button>
        
        <div className="absolute top-6 left-6 text-text/70 font-accent text-sm tracking-widest z-[110]">
          {currentIndex + 1} / {images.length}
        </div>

        <button 
          className="absolute left-6 text-text/70 hover:text-text z-[110] text-5xl font-heading p-4 hidden md:block"
          onClick={(e) => { e.stopPropagation(); setIsZoomMode(false); onPrev(); }}
        >
          ‹
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: -20 }}
          transition={{ duration: 0.3 }}
          className={`relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center ${isZoomMode ? '' : 'cursor-grab active:cursor-grabbing'}`}
          onClick={(e) => e.stopPropagation()}
          drag={isZoomMode ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              onNext();
            } else if (swipe > swipeConfidenceThreshold) {
              onPrev();
            }
          }}
        >
          <div 
            className="relative touch-none"
            onMouseMove={handleMouseMove}
            onDoubleClick={handleDoubleClick}
            onMouseLeave={() => setIsZoomMode(false)}
            style={{ cursor: isZoomMode ? 'none' : 'zoom-in' }}
          >
            <img 
              ref={imageRef}
              src={currentImage} 
              alt="Gallery item"
              className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl block"
              draggable="false"
            />
            
            {isZoomMode && imageSize.w > 0 && (
              <div 
                className="absolute pointer-events-none rounded-sm border border-text/20 shadow-2xl bg-no-repeat z-[120] bg-[#050505]"
                style={{
                  width: `${LENS_WIDTH}px`,
                  height: `${LENS_HEIGHT}px`,
                  top: `${mousePos.y - LENS_HEIGHT / 2}px`,
                  left: `${mousePos.x - LENS_WIDTH / 2}px`,
                  backgroundImage: `url('${currentImage}')`,
                  backgroundSize: `${imageSize.w * ZOOM_LEVEL}px ${imageSize.h * ZOOM_LEVEL}px`,
                  backgroundPosition: `-${mousePos.x * ZOOM_LEVEL - LENS_WIDTH / 2}px -${mousePos.y * ZOOM_LEVEL - LENS_HEIGHT / 2}px`,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)'
                }}
              />
            )}
          </div>
        </motion.div>

        <button 
          className="absolute right-6 text-text/70 hover:text-text z-[110] text-5xl font-heading p-4 hidden md:block"
          onClick={(e) => { e.stopPropagation(); setIsZoomMode(false); onNext(); }}
        >
          ›
        </button>
        
        {/* Help text */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text/70 font-accent text-xs tracking-widest pointer-events-none">
          {isZoomMode ? 'Double click to zoom out' : 'Double click to zoom in'}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
