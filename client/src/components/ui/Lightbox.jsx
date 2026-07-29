import React, { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const Lightbox = ({ images, currentIndex, isOpen, onClose, onNext, onPrev, projectId, onImageUpdate }) => {
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
            if (onImageUpdate) onImageUpdate(currentImageId, 'views', data.data);
            return next;
          });
        } catch(e) {}
      };
      viewImage();
    }
  }, [isOpen, currentIndex, currentImageId, projectId]);


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
        
        {/* Instagram-style Engagement UI */}
        <div className="absolute bottom-6 right-6 z-[120] flex items-center gap-6">
          {/* Views */}
          <div className="text-blue-400/80 font-accent text-xs flex items-center gap-2 group hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 px-2 py-1 rounded text-[10px] text-blue-100">{currentImgObj.views || 0} views</span>
          </div>

          {/* Like */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, y: -5 }}
            onClick={async (e) => {
              e.stopPropagation();
              if (localStorage.getItem(`liked_image_${currentImageId}`)) return;
              try {
                const { data } = await api.post(`/projects/${projectId}/images/${currentImageId}/like`);
                setLocalImages(prev => {
                  const next = [...prev];
                  next[currentIndex] = { ...next[currentIndex], likes: data.data };
                  if (onImageUpdate) onImageUpdate(currentImageId, 'likes', data.data);
                  return next;
                });
                localStorage.setItem(`liked_image_${currentImageId}`, 'true');
              } catch(err) {}
            }}
            className={`group relative flex items-center gap-2 transition-all ${localStorage.getItem(`liked_image_${currentImageId}`) ? 'text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'text-pink-400/80 hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]'}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={localStorage.getItem(`liked_image_${currentImageId}`) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded text-[10px] font-accent tracking-widest">{currentImgObj.likes || 0} likes</span>
          </motion.button>

          {/* Comment */}
          <div className="relative">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); setShowEngagement(!showEngagement); }}
              className="text-green-400/80 hover:text-green-400 hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)] transition-all flex items-center gap-2 group"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded text-[10px] font-accent tracking-widest">{(currentImgObj.comments || []).length} comments</span>
            </motion.button>

            <AnimatePresence>
              {showEngagement && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-12 right-0 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-h-60 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                    {(currentImgObj.comments || []).length === 0 && (
                      <p className="text-white/40 text-center text-sm font-body py-4">No comments yet. Be the first!</p>
                    )}
                    {(currentImgObj.comments || []).map((c, i) => (
                      <div key={i} className="text-sm font-body">
                        <span className="font-accent font-bold text-white mr-2 text-xs">{c.name}</span>
                        <span className="text-white/80">{c.text}</span>
                      </div>
                    ))}
                  </div>
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const text = e.target.text.value;
                      if(!text) return;
                      try {
                        const { data } = await api.post(`/projects/${projectId}/images/${currentImageId}/comment`, { text });
                        setLocalImages(prev => {
                          const next = [...prev];
                          next[currentIndex] = { ...next[currentIndex], comments: data.data };
                          if (onImageUpdate) onImageUpdate(currentImageId, 'comments', data.data);
                          return next;
                        });
                        e.target.reset();
                      } catch(err) {}
                    }}
                    className="p-3 border-t border-white/10 flex items-center gap-2 bg-black/40"
                  >
                    <input 
                      type="text" 
                      name="text" 
                      placeholder="Add a comment..." 
                      className="flex-1 bg-transparent text-white text-sm focus:outline-none font-body placeholder:text-white/40" 
                      required
                    />
                    <button type="submit" className="text-primary font-accent text-xs tracking-widest uppercase hover:text-white transition-colors">Post</button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Share */}
          {/* Share */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, x: 5, y: -5 }}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await api.post(`/projects/${projectId}/images/${currentImageId}/share`);
                setLocalImages(prev => {
                  const next = [...prev];
                  const newShares = (next[currentIndex].shares || 0) + 1;
                  next[currentIndex] = { ...next[currentIndex], shares: newShares };
                  if (onImageUpdate) onImageUpdate(currentImageId, 'shares', newShares);
                  return next;
                });
                if (navigator.share) {
                  navigator.share({ title: 'Check out this image', url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }
              } catch(err) {}
            }}
            className="text-yellow-400/80 hover:text-yellow-400 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-all flex items-center gap-2 group relative"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 text-white px-2 py-1 rounded text-[10px] font-accent tracking-widest">Share</span>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
