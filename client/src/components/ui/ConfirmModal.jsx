import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, onCancel, variant = 'danger' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onCancel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const getVariantStyle = () => {
    switch (variant) {
      case 'danger': return 'bg-red-500 hover:bg-red-600 shadow-red-500/20';
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20';
      case 'info': return 'bg-primary hover:bg-secondary shadow-primary/20';
      default: return 'bg-primary hover:bg-secondary';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-surface border border-text/20 rounded-custom p-8 max-w-md w-full shadow-2xl relative z-10 outline-none"
          >
            <h2 className="text-2xl font-heading mb-4 text-text">{title}</h2>
            <p className="text-text/70 font-body mb-8 leading-relaxed">
              {message}
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={onCancel}
                className="px-6 py-2 rounded border border-text/20 text-text/70 hover:bg-text/10 hover:text-text transition-colors font-accent text-xs uppercase tracking-widest"
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className={`px-6 py-2 rounded text-text transition-colors font-accent text-xs uppercase tracking-widest shadow-lg ${getVariantStyle()}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
