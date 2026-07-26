import React, { useState } from 'react';

const TagInput = ({ tags = [], onChange, placeholder = "Type and press enter", suggestions = [] }) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    }
  };

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  return (
    <div className="w-full relative">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span key={index} className="flex items-center gap-1 bg-text/10 text-text text-xs font-accent tracking-widest uppercase px-3 py-1.5 rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="ml-1 text-text/70 hover:text-text">&times;</button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className="w-full bg-transparent border border-text/20 rounded px-4 py-3 text-text font-body focus:outline-none focus:border-primary transition-colors text-sm"
        />
        {showSuggestions && input && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-surface border border-text/20 rounded shadow-2xl max-h-48 overflow-y-auto">
            {filteredSuggestions.map((s, i) => (
              <div 
                key={i} 
                className="px-4 py-2 hover:bg-text/10 cursor-pointer text-sm font-body text-text/70"
                onClick={() => addTag(s)}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagInput;
