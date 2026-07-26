import React from 'react';
import { motion } from 'framer-motion';

const EmptyState = ({ icon, title, description, actionButton }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]"
    >
      <div className="text-6xl mb-6 opacity-40">{icon}</div>
      <h3 className="text-2xl font-heading mb-2 text-text">{title}</h3>
      <p className="text-text/70 font-body mb-8 max-w-sm mx-auto">{description}</p>
      {actionButton && (
        <div className="mt-4">
          {actionButton}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
