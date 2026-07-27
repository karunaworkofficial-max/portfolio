import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

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
    return (
      <div className="relative inline-block w-full z-50">
        {multiline ? (
          <textarea
            ref={inputRef}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-black/80 text-white border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-2 shadow-2xl ${className}`}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-black/80 text-white border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary rounded p-2 shadow-2xl ${className}`}
          />
        )}
        <div className="absolute -bottom-10 right-0 flex gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); setCurrentValue(value); }}
            className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600 shadow-lg"
            title="Cancel"
          >
            <X size={16} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave(); }}
            className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600 shadow-lg"
            title="Save"
          >
            <Check size={16} />
          </button>
        </div>
      </div>
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
