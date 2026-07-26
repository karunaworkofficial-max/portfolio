import React from 'react';

const ColorPaletteInput = ({ colors = [], onChange }) => {
  const addColor = () => {
    if (colors.length < 8) {
      onChange([...colors, '#6C63FF']);
    }
  };

  const removeColor = (indexToRemove) => {
    onChange(colors.filter((_, index) => index !== indexToRemove));
  };

  const updateColor = (index, newColor) => {
    const updated = [...colors];
    updated[index] = newColor;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        {colors.map((color, index) => (
          <div key={index} className="flex items-center gap-2 bg-surface/50 p-2 border border-text/20 rounded group">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => updateColor(index, e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
            />
            <input 
              type="text" 
              value={color} 
              onChange={(e) => updateColor(index, e.target.value)}
              className="w-20 bg-transparent border-none text-xs font-accent tracking-widest text-text/70 focus:outline-none uppercase"
            />
            <button 
              type="button" 
              onClick={() => removeColor(index)}
              className="text-text/70 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      {colors.length < 8 && (
        <button 
          type="button" 
          onClick={addColor}
          className="text-xs font-accent tracking-widest uppercase text-primary hover:text-text transition-colors border border-primary/30 hover:border-text/20 rounded px-4 py-2"
        >
          + Add Color
        </button>
      )}

      {colors.length > 0 && (
        <div className="mt-6">
          <div className="text-xs font-accent opacity-50 mb-2 uppercase tracking-widest">Preview</div>
          <div className="flex h-12 w-full rounded overflow-hidden">
            {colors.map((c, i) => (
              <div key={i} style={{ backgroundColor: c, flex: 1 }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteInput;
