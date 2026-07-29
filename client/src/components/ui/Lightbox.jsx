import React, { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev, projectId }) => {
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 });
  const [showEngagement, setShowEngagement] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  
  const imageRef = useRef(null);

  const ZOOM_LEVEL = 2.5;
  const LENS_WIDTH = 400;
  const LENS_HEIGHT = 250;

  useEffect(() => {
    if (images && images.length > 0) {
      setLocalImages(images);
    }
  }, [images]);

  const currentImgObj = localImages[currentIndex] || {};
  const currentImageId = currentImgObj._id;
  const currentImageUrl = currentImgObj.url || currentImgObj;

  useEffect(() => {
    if (isOpen && currentImageId && projectId) {
      const viewImage = async () => {
        try {
          const isAdmin = !!localStorage.getItem('token');
          const { data } = await api.post(`/projects/${projectId}/images/${currentImageId}/view${isAdmin ? '?admin=true' : ''}`);
          setLocalImages(prev => {
            const next = [...prev];
            next[currentIndex] = { ...next[currentIndex], views: data.data };
            return next;
          });
        } catch(e) {}
      };
      viewImage();
    }
  }, [isOpen, currentIndex, currentImageId, projectId]);

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
      setShowEngagement(false);
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
              src={currentImageUrl} 
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
                  backgroundImage: `url('${currentImageUrl}')`,
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
        
        {/* Help text & Engagement Toggle */}
        <div className="absolute bottom-6 left-6 z-[110] flex gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowEngagement(!showEngagement); }}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-accent text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Discuss & Like
          </button>
          
          <div className="text-white/50 font-accent text-xs tracking-widest flex items-center gap-2 border border-white/10 px-4 py-2 rounded-full">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            {currentImgObj.views || 0}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-text/70 font-accent text-xs tracking-widest pointer-events-none hidden md:block">
          {isZoomMode ? 'Double click to zoom out' : 'Double click to zoom in'}
        </div>

        {/* Engagement Sidebar */}
        <AnimatePresence>
          {showEngagement && currentImageId && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 w-full md:w-96 h-full bg-[#0a0a0a] border-l border-white/10 z-[120] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50 backdrop-blur-md">
                <h3 className="text-white font-heading text-xl">Image Details</h3>
                <button onClick={() => setShowEngagement(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              
              <div className="flex p-4 gap-2 border-b border-white/10">
                <button 
                  onClick={async () => {
                    if (localStorage.getItem(`liked_image_${currentImageId}`)) return;
                    try {
                      const { data } = await api.post(`/projects/${projectId}/images/${currentImageId}/like`);
                      setLocalImages(prev => {
                        const next = [...prev];
                        next[currentIndex] = { ...next[currentIndex], likes: data.data };
                        return next;
                      });
                      localStorage.setItem(`liked_image_${currentImageId}`, 'true');
                    } catch(e) {}
                  }}
                  className={`flex-1 py-2 rounded-md font-accent text-xs uppercase tracking-widest border transition-colors ${localStorage.getItem(`liked_image_${currentImageId}`) ? 'bg-primary/20 text-primary border-primary/50' : 'border-white/20 text-white/70 hover:bg-white/5'}`}
                >
                  {currentImgObj.likes || 0} Likes
                </button>
                <button 
                  onClick={async () => {
                    try {
                      await api.post(`/projects/${projectId}/images/${currentImageId}/share`);
                      setLocalImages(prev => {
                        const next = [...prev];
                        next[currentIndex] = { ...next[currentIndex], shares: (next[currentIndex].shares || 0) + 1 };
                        return next;
                      });
                      if (navigator.share) {
                        navigator.share({ title: 'Check out this image', url: window.location.href });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied to clipboard!');
                      }
                    } catch(e) {}
                  }}
                  className="flex-1 py-2 rounded-md font-accent text-xs uppercase tracking-widest border border-white/20 text-white/70 hover:bg-white/5 transition-colors"
                >
                  {currentImgObj.shares || 0} Shares
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(currentImgObj.comments || []).map((c, i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-accent text-sm">{c.name}</span>
                      <span className="text-white/40 text-[10px]">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-white/80 text-sm font-body">{c.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-white/10 bg-black/50 backdrop-blur-md">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const name = e.target.name.value;
                  const text = e.target.text.value;
                  if(!name || !text) return;
                  try {
                    const { data } = await api.post(`/projects/${projectId}/images/${currentImageId}/comment`, { name, text });
                    setLocalImages(prev => {
                      const next = [...prev];
                      next[currentIndex] = { ...next[currentIndex], comments: data.data };
                      return next;
                    });
                    e.target.reset();
                  } catch(e) {}
                }}>
                  <input type="text" name="name" required placeholder="Name" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white mb-2 text-sm focus:border-primary focus:outline-none" />
                  <textarea name="text" required placeholder="Comment..." rows="2" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white mb-2 text-sm resize-none focus:border-primary focus:outline-none"></textarea>
                  <button type="submit" className="w-full py-2 bg-primary text-white rounded-md font-accent text-xs uppercase tracking-widest hover:bg-secondary transition-colors">Post</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
