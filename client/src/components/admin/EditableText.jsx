import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const EditableText = ({ 
  value, 
  onSave, 
  as = 'span', 
  className = '', 
  multiline = false,
  isAdmin = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (currentValue !== value) {
      onSave(currentValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value);
    }
  };

  if (!isAdmin) {
    const Tag = as;
    return <Tag className={className}>{value}</Tag>;
  }

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full bg-black/50 text-white border border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary rounded p-1 ${className}`}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full bg-black/50 text-white border border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary rounded p-1 ${className}`}
      />
    );
  }

  const Tag = as;
  return (
    <Tag 
      className={`relative group cursor-pointer hover:outline-dashed hover:outline-2 hover:outline-primary/50 transition-all ${className}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditing(true);
      }}
    >
      {value || <span className="opacity-50 italic">Empty Text</span>}
      <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 bg-primary text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shadow-lg transition-opacity pointer-events-none z-50">
        Edit
      </div>
    </Tag>
  );
};

export default EditableText;
