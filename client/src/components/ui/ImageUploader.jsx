import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ImageUploader = ({ images, setImages, coverIndex, setCoverIndex }) => {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    const imageObjects = newFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      isNew: true,
      alt: '',
      isMockup: false,
      isCarousel: false
    }));
    
    setImages(prev => {
      const newImages = [...prev, ...imageObjects];
      if (coverIndex === null && newImages.length > 0) setCoverIndex(0);
      return newImages;
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (coverIndex === index) setCoverIndex(0);
    else if (coverIndex > index) setCoverIndex(coverIndex - 1);
  };

  const updateImage = (index, field, value) => {
    setImages(prev => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };

  const handleReplaceClick = (index) => {
    setReplacingIndex(index);
    replaceInputRef.current?.click();
  };

  const handleReplaceChange = (e) => {
    if (e.target.files && e.target.files[0] && replacingIndex !== null) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        const imageObject = {
          file,
          url: URL.createObjectURL(file),
          isNew: true,
          alt: images[replacingIndex].alt || '',
          isMockup: images[replacingIndex].isMockup || false,
          isCarousel: images[replacingIndex].isCarousel || false
        };
        
        setImages(prev => {
          const next = [...prev];
          next[replacingIndex] = imageObject;
          return next;
        });
      }
    }
    setReplacingIndex(null);
    if(replaceInputRef.current) replaceInputRef.current.value = null; // reset
  };

  return (
    <div>
      <div 
        className={`relative border-2 border-dashed rounded-custom p-12 text-center transition-colors ${dragActive ? 'border-primary bg-primary/10' : 'border-text/20 bg-surface/30 hover:border-primary/50'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp" 
          onChange={handleChange}
          className="hidden" 
        />
        <input 
          ref={replaceInputRef}
          type="file"
          accept="image/jpeg, image/png, image/webp" 
          onChange={handleReplaceChange}
          className="hidden" 
        />
        <div className="text-4xl mb-4 opacity-50">🖼️</div>
        <h4 className="text-lg font-heading mb-2">Drag and drop images here</h4>
        <p className="text-text/70 text-sm font-body mb-6">JPEG, PNG, WebP up to 10MB each</p>
        <button 
          type="button" 
          onClick={() => fileInputRef.current?.click()}
          className="px-6 py-2 bg-text/10 border border-text/20 rounded hover:bg-text/10 transition-colors font-accent text-xs tracking-widest uppercase"
        >
          Browse Files
        </button>
      </div>

      {images.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-accent uppercase tracking-widest text-text/70 mb-4">Uploaded Images ({images.length})</h4>
          <div className="space-y-4">
            {images.map((img, i) => (
              <motion.div 
                key={img.url || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col sm:flex-row gap-4 p-4 rounded-custom border transition-colors ${coverIndex === i ? 'border-primary bg-primary/5' : 'border-text/20 bg-surface/50'}`}
              >
                <div className="w-full sm:w-48 h-32 bg-black rounded overflow-hidden relative shrink-0">
                  <img src={img.url} alt="preview" className="w-full h-full object-cover" />
                  {coverIndex === i && (
                    <div className="absolute top-2 left-2 bg-primary text-text text-[10px] font-bold uppercase font-accent tracking-widest px-2 py-1 rounded">
                      Cover
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <input 
                        type="text" 
                        placeholder="Alt Text (SEO)" 
                        value={img.alt || ''}
                        onChange={(e) => updateImage(i, 'alt', e.target.value)}
                        className="w-full sm:w-2/3 bg-bg border border-text/20 rounded px-3 py-1.5 text-text font-body text-sm focus:outline-none focus:border-primary"
                      />
                      <div className="flex items-center gap-2">
                        <button 
                          type="button" 
                          onClick={() => handleReplaceClick(i)}
                          className="text-text/70 hover:text-primary p-1 text-xs font-accent tracking-widest uppercase"
                          title="Replace Image"
                        >
                          Replace
                        </button>
                        <button 
                          type="button" 
                          onClick={() => removeImage(i)}
                          className="text-text/70 hover:text-red-500 p-1 font-bold"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          checked={img.isMockup || false}
                          onChange={(e) => updateImage(i, 'isMockup', e.target.checked)}
                          className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-xs font-accent text-text/70 tracking-widest uppercase">Is Device Mockup</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer w-fit">
                        <input 
                          type="checkbox" 
                          checked={img.isCarousel || false}
                          onChange={(e) => updateImage(i, 'isCarousel', e.target.checked)}
                          className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
                        />
                        <span className="text-xs font-accent text-text/70 tracking-widest uppercase">Is Carousel</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setCoverIndex(i)}
                      className={`text-xs font-accent tracking-widest uppercase flex items-center gap-1 ${coverIndex === i ? 'text-primary' : 'text-text/70 hover:text-text'}`}
                    >
                      {coverIndex === i ? '★ Cover Image' : '☆ Set as Cover'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
