import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableImageItem = ({ id, img, index, coverIndex, setCoverIndex, updateImage, handleReplaceClick, removeImage, isSelected, toggleSelection }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div 
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col sm:flex-row gap-4 p-4 rounded-custom border transition-colors ${coverIndex === index ? 'border-primary bg-primary/5' : 'border-text/20 bg-surface/50'}`}
    >
      <div className="flex items-center gap-3">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelection(index)}
          className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
        />
        <div 
          {...attributes} 
          {...listeners} 
          className="flex items-center justify-center px-2 cursor-grab active:cursor-grabbing text-text/50 hover:text-primary transition-colors"
          title="Drag to reorder"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </div>
      </div>
      <div className="w-full sm:w-48 h-32 bg-black rounded overflow-hidden relative shrink-0">
        <img src={img.url} alt="preview" className="w-full h-full object-cover" />
        {coverIndex === index && (
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
              onChange={(e) => updateImage(index, 'alt', e.target.value)}
              className="w-full sm:w-2/3 bg-bg border border-text/20 rounded px-3 py-1.5 text-text font-body text-sm focus:outline-none focus:border-primary"
            />
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={() => handleReplaceClick(index)}
                className="text-text/70 hover:text-primary p-1 text-xs font-accent tracking-widest uppercase"
                title="Replace Image"
              >
                Replace
              </button>
              <button 
                type="button" 
                onClick={() => removeImage(index)}
                className="text-text/70 hover:text-red-500 p-1 font-bold"
                title="Remove Image"
              >
                ✕
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-3">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input 
                  type="checkbox" 
                  checked={img.isMockup || false}
                  onChange={(e) => updateImage(index, 'isMockup', e.target.checked)}
                  className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-xs font-accent text-text/70 tracking-widest uppercase">Is Device Mockup</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer w-fit">
                <input 
                  type="checkbox" 
                  checked={img.isCarousel || false}
                  onChange={(e) => updateImage(index, 'isCarousel', e.target.checked)}
                  className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-xs font-accent text-text/70 tracking-widest uppercase">Is Carousel</span>
              </label>
            </div>
            
            {img.isCarousel && (
              <div className="w-full sm:w-2/3">
                <input 
                  type="text" 
                  placeholder="Carousel Group Name (e.g. Set 1)" 
                  value={img.carouselGroupName || ''}
                  onChange={(e) => updateImage(index, 'carouselGroupName', e.target.value)}
                  className="w-full bg-bg border border-text/20 rounded px-3 py-1.5 text-text font-body text-xs focus:outline-none focus:border-primary"
                />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 flex gap-4">
          <button 
            type="button"
            onClick={() => setCoverIndex(index)}
            className={`text-xs font-accent tracking-widest uppercase flex items-center gap-1 ${coverIndex === index ? 'text-primary' : 'text-text/70 hover:text-text'}`}
          >
            {coverIndex === index ? '★ Cover Image' : '☆ Set as Cover'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ImageUploader = ({ images, setImages, coverIndex, setCoverIndex }) => {
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [replacingIndex, setReplacingIndex] = useState(null);
  const [selectedImages, setSelectedImages] = useState(new Set());
  const [bulkGroupName, setBulkGroupName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.url === active.id);
      const newIndex = images.findIndex((img) => img.url === over.id);
      
      setImages((items) => {
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Update cover index if necessary
      if (coverIndex === oldIndex) {
        setCoverIndex(newIndex);
      } else if (coverIndex === newIndex) {
        setCoverIndex(oldIndex);
      }
    }
  };

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
      isCarousel: false,
      carouselGroupName: ''
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
          isCarousel: images[replacingIndex].isCarousel || false,
          carouselGroupName: images[replacingIndex].carouselGroupName || ''
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

  const toggleSelection = (index) => {
    setSelectedImages(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const applyBulkGroup = () => {
    if (selectedImages.size === 0) return;
    setImages(prev => {
      const next = [...prev];
      selectedImages.forEach(idx => {
        if (next[idx]) {
          next[idx] = { ...next[idx], isCarousel: true, carouselGroupName: bulkGroupName };
        }
      });
      return next;
    });
    setSelectedImages(new Set());
    setBulkGroupName('');
  };

  const makeBulkStatic = () => {
    if (selectedImages.size === 0) return;
    setImages(prev => {
      const next = [...prev];
      selectedImages.forEach(idx => {
        if (next[idx]) {
          next[idx] = { ...next[idx], isCarousel: false, carouselGroupName: '' };
        }
      });
      return next;
    });
    setSelectedImages(new Set());
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
        <div className="mt-8 space-y-4">
          {selectedImages.size > 0 && (
            <div className="bg-primary/10 border border-primary/30 p-4 rounded-custom flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-lg backdrop-blur">
              <div className="text-sm font-accent tracking-widest uppercase text-primary">
                {selectedImages.size} Image{selectedImages.size > 1 ? 's' : ''} Selected
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Bulk Group Name (e.g. Set 1)" 
                  value={bulkGroupName}
                  onChange={(e) => setBulkGroupName(e.target.value)}
                  className="w-full sm:w-64 bg-bg border border-primary/30 rounded px-3 py-1.5 text-text font-body text-xs focus:outline-none focus:border-primary"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button 
                    type="button" 
                    onClick={applyBulkGroup}
                    className="flex-1 sm:flex-none px-4 py-1.5 bg-primary text-white text-xs font-accent tracking-widest uppercase rounded hover:bg-secondary transition-colors whitespace-nowrap"
                  >
                    Group as Carousel
                  </button>
                  <button 
                    type="button" 
                    onClick={makeBulkStatic}
                    className="flex-1 sm:flex-none px-4 py-1.5 border border-text/20 text-text/70 text-xs font-accent tracking-widest uppercase rounded hover:bg-text/10 transition-colors whitespace-nowrap"
                  >
                    Make Static
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setSelectedImages(new Set())}
                    className="p-1.5 text-text/50 hover:text-text rounded transition-colors"
                    title="Deselect All"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={images.map(img => img.url)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {images.map((img, index) => (
                  <SortableImageItem 
                    key={img.url}
                    id={img.url}
                    img={img}
                    index={index}
                    coverIndex={coverIndex}
                    setCoverIndex={setCoverIndex}
                    updateImage={updateImage}
                    handleReplaceClick={handleReplaceClick}
                    removeImage={removeImage}
                    isSelected={selectedImages.has(index)}
                    toggleSelection={toggleSelection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
