import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import api from '../utils/api';
import { fadeInUp, staggerContainer } from '../utils/animations';
import Lightbox from '../components/ui/Lightbox';
import BeforeAfterSlider from '../components/ui/BeforeAfterSlider';
import ColorPalette from '../components/ui/ColorPalette';
import FilmStripSlider from '../components/ui/FilmStripSlider';

const TiltImage = ({ img, title, idx, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-300, 300], [8, -8]);
  const rotateY = useTransform(x, [-300, 300], [-8, 8]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, margin: "-50px" }} 
      variants={fadeInUp}
      style={{ perspective: 1200 }}
      className="cursor-zoom-in break-inside-avoid relative overflow-visible rounded-custom group"
      onClick={() => onClick(idx)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="w-full overflow-hidden rounded-custom border border-white/10 bg-surface transition-all duration-300 ease-out group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/30"
      >
        <img 
          src={img.url} 
          alt={`${title} gallery ${idx + 1}`} 
          className="w-full h-auto object-contain block pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
};


const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [gridCols, setGridCols] = useState(3);
  const [activeGalleryTab, setActiveGalleryTab] = useState('static');
  const [lightboxImages, setLightboxImages] = useState([]);
  
  // Carousel Drilldown State
  const [activeCarouselGroup, setActiveCarouselGroup] = useState(null);
  const sliderRef = useRef(null);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
    hasDragged: false
  });

  // Switch tab resets carousel group
  useEffect(() => {
    if (activeGalleryTab !== 'carousel') {
      setActiveCarouselGroup(null);
    }
  }, [activeGalleryTab]);

  const startDrag = (e) => {
    if (!sliderRef.current) return;
    dragState.current.isDragging = true;
    dragState.current.hasDragged = false;
    dragState.current.startX = e.pageX - sliderRef.current.offsetLeft;
    dragState.current.scrollLeft = sliderRef.current.scrollLeft;
  };
  
  const stopDrag = () => {
    dragState.current.isDragging = false;
    setTimeout(() => { dragState.current.hasDragged = false; }, 50); 
  };
  
  const onDrag = (e) => {
    if (!dragState.current.isDragging || !sliderRef.current) return;
    e.preventDefault();
    dragState.current.hasDragged = true;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragState.current.startX) * 2; 
    sliderRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/projects/${slug}`);
        setProject(data.data);
      } catch (err) {
        console.error('Error fetching project detail', err);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading || !project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-xl font-accent animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const allImages = project.images || [];
  allImages.forEach((img, idx) => img.originalIndex = idx);
  
  const staticImages = allImages.filter(img => !img.isCarousel);
  const carouselImages = allImages.filter(img => img.isCarousel);
  
  // Group carousel images by carouselGroupName
  const carouselGroups = [];
  const groupMap = {};
  
  carouselImages.forEach(img => {
    const groupName = img.carouselGroupName || 'Default Carousel';
    if (!groupMap[groupName]) {
      groupMap[groupName] = [];
      carouselGroups.push({ name: groupName, items: groupMap[groupName] });
    }
    groupMap[groupName].push(img);
  });

  const openLightbox = (index, images = allImages) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const nextLightboxImage = () => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  const prevLightboxImage = () => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      {/* Back Button */}
      <button 
        onClick={() => navigate('/projects')}
        className="fixed top-24 left-6 z-40 bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-full font-accent text-sm hover:bg-primary transition-colors flex items-center gap-2"
      >
        <span>←</span> All Projects
      </button>

      {/* Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black">
          {project.videoUrl ? (
            <video 
              src={project.videoUrl} 
              autoPlay loop muted playsInline 
              className="w-full h-full object-cover opacity-60"
            />
          ) : allImages.length > 0 ? (
            <FilmStripSlider images={allImages} />
          ) : (
            <img 
              src={project.thumbnail?.url || 'https://placehold.co/1920x1080/png'} 
              alt={project.title}
              className="w-full h-full object-cover opacity-60 scale-105"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-24 container mx-auto pointer-events-none">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="pointer-events-auto">
            <motion.div variants={fadeInUp} className="mb-6 flex gap-4 items-center">
              <span className="px-4 py-1.5 bg-primary text-white text-xs font-accent uppercase tracking-widest rounded-full">
                {project.category?.replace('-', ' ')}
              </span>
              <span className="text-white/70 font-accent text-sm">{project.projectYear}</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-heading mb-4 leading-tight">
              {project.title}
            </motion.h1>
            {project.subtitle && (
              <motion.p variants={fadeInUp} className="text-xl md:text-3xl font-body text-white/70 max-w-3xl">
                {project.subtitle}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Overview */}
          <div className="md:col-span-7 lg:col-span-8">
            <h3 className="text-lg font-accent uppercase tracking-widest text-primary mb-6">Overview</h3>
            <div 
              className="prose prose-invert prose-lg max-w-none font-body text-white/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
            {project.colorPalette && project.colorPalette.length > 0 && (
              <ColorPalette colors={project.colorPalette} />
            )}
          </div>
          
          {/* Quick Facts */}
          <div className="md:col-span-5 lg:col-span-4 bg-surface/50 p-8 rounded-custom border border-text/20 h-fit">
            <div className="space-y-6">
              {project.clientName && (
                <div>
                  <h4 className="text-xs font-accent uppercase tracking-widest opacity-50 mb-1">Client</h4>
                  <p className="font-body text-lg">{project.clientName}</p>
                </div>
              )}
              {project.clientIndustry && (
                <div>
                  <h4 className="text-xs font-accent uppercase tracking-widest opacity-50 mb-1">Industry</h4>
                  <p className="font-body text-lg">{project.clientIndustry}</p>
                </div>
              )}
              {project.duration && (
                <div>
                  <h4 className="text-xs font-accent uppercase tracking-widest opacity-50 mb-1">Duration</h4>
                  <p className="font-body text-lg">{project.duration}</p>
                </div>
              )}
              {project.tools && project.tools.length > 0 && (
                <div>
                  <h4 className="text-xs font-accent uppercase tracking-widest opacity-50 mb-2">Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map(tool => (
                      <span key={tool} className="text-xs bg-text/10 px-2 py-1 rounded font-accent text-text/70">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.liveUrl && (
                <div className="pt-4 border-t border-text/20">
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-primary text-text font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors w-full text-center"
                  >
                    View Live Site ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Case Study Details (Brief, Approach, Solution) */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-20 space-y-24">
        {project.challenge && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="max-w-4xl">
            <h3 className="text-3xl md:text-5xl font-heading mb-8 relative inline-block">
              <span className="text-primary mr-4">01.</span>The Challenge
            </h3>
            <p className="text-xl font-body text-text/70 leading-relaxed">{project.challenge}</p>
          </motion.div>
        )}
        
        {project.approach && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="max-w-4xl ml-auto text-left md:text-right">
            <h3 className="text-3xl md:text-5xl font-heading mb-8 relative inline-block">
              <span className="text-secondary mr-4">02.</span>The Approach
            </h3>
            <p className="text-xl font-body text-text/70 leading-relaxed">{project.approach}</p>
          </motion.div>
        )}
        
        {project.solution && (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="max-w-4xl">
            <h3 className="text-3xl md:text-5xl font-heading mb-8 relative inline-block">
              <span className="text-accent mr-4">03.</span>The Solution
            </h3>
            <p className="text-xl font-body text-text/70 leading-relaxed">{project.solution}</p>
          </motion.div>
        )}
      </div>

      {/* Before / After Slider */}
      {project.beforeImage?.url && project.afterImage?.url && (
        <div className="container mx-auto px-6 md:px-12 lg:px-24 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
             <BeforeAfterSlider beforeImage={project.beforeImage.url} afterImage={project.afterImage.url} />
          </motion.div>
        </div>
      )}

      {/* Main Image Gallery */}
      <div className="py-12 w-full">
        {allImages.length > 0 && (
          <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="flex items-center gap-6">
              <h3 className="text-2xl font-heading text-text/70">Gallery ({allImages.length})</h3>
              <div className="flex bg-surface/50 rounded p-1 border border-text/20">
                <button
                  onClick={() => setActiveGalleryTab('static')}
                  className={`px-4 py-1.5 rounded text-xs font-accent tracking-widest uppercase transition-colors ${activeGalleryTab === 'static' ? 'bg-primary text-white' : 'text-text/70 hover:bg-text/10'}`}
                >
                  Static
                </button>
                <button
                  onClick={() => setActiveGalleryTab('carousel')}
                  className={`px-4 py-1.5 rounded text-xs font-accent tracking-widest uppercase transition-colors ${activeGalleryTab === 'carousel' ? 'bg-primary text-white' : 'text-text/70 hover:bg-text/10'}`}
                >
                  Carousel
                </button>
              </div>
            </div>
            
            {activeGalleryTab === 'static' || activeGalleryTab === 'carousel' ? (
              <div className="flex items-center gap-2 bg-surface/50 border border-text/20 rounded-full p-1 w-fit">
                <span className="text-[10px] font-accent uppercase tracking-widest text-text/50 pl-3">Columns:</span>
                {[1, 2, 3, 4, 5, 6].map(col => (
                  <button
                    key={col}
                    onClick={() => setGridCols(col)}
                    className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-accent transition-colors ${gridCols === col ? 'bg-primary text-white' : 'hover:bg-text/10 text-text/70'}`}
                    title={`${col} Columns`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex flex-col gap-12">
          {activeGalleryTab === 'static' && (
            <div className={`container mx-auto px-6 md:px-12 lg:px-24 gap-6 md:gap-8 ${gridCols === 1 ? 'columns-1' : gridCols === 2 ? 'columns-1 md:columns-2' : gridCols === 3 ? 'columns-1 sm:columns-2 md:columns-3' : gridCols === 4 ? 'columns-2 md:columns-4' : gridCols === 5 ? 'columns-2 sm:columns-3 md:columns-5' : 'columns-2 sm:columns-3 md:columns-6'}`}>
              {staticImages.map((img, idx) => (
                <div key={idx} className="mb-6 md:mb-8 break-inside-avoid">
                  <TiltImage 
                    img={img} 
                    idx={img.originalIndex} 
                    title={project.title} 
                    onClick={openLightbox} 
                  />
                </div>
              ))}
            </div>
          )}

          {activeGalleryTab === 'carousel' && (
            <>
              {!activeCarouselGroup ? (
                <div className={`container mx-auto px-6 md:px-12 lg:px-24 gap-6 md:gap-8 ${gridCols === 1 ? 'columns-1' : gridCols === 2 ? 'columns-1 md:columns-2' : gridCols === 3 ? 'columns-1 sm:columns-2 md:columns-3' : gridCols === 4 ? 'columns-2 md:columns-4' : gridCols === 5 ? 'columns-2 sm:columns-3 md:columns-5' : 'columns-2 sm:columns-3 md:columns-6'}`}>
                  {carouselGroups.length === 0 && (
                    <div className="w-full text-center text-text/50 font-body py-12 col-span-full">
                      No carousel groups available for this project.
                    </div>
                  )}
                  {carouselGroups.map((group, groupIdx) => {
                    const coverImage = group.items[0];
                    if (!coverImage) return null;
                    return (
                      <div key={groupIdx} className="mb-6 md:mb-8 break-inside-avoid">
                        <div className="relative group cursor-pointer" onClick={() => setActiveCarouselGroup(group)}>
                          <TiltImage 
                            img={coverImage} 
                            idx={coverImage.originalIndex} 
                            title={group.name} 
                            onClick={() => setActiveCarouselGroup(group)} 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-custom flex items-center justify-center pointer-events-none">
                            <div className="text-white font-heading text-xl border border-white/30 px-6 py-2 rounded-full backdrop-blur-sm">
                              {group.name} ({group.items.length})
                            </div>
                          </div>
                          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur px-3 py-1 rounded-full border border-white/10 flex items-center gap-2 z-10 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                            <span className="text-[10px] font-accent tracking-widest text-white uppercase">{group.items.length} Photos</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full relative py-8 bg-[#050505] min-h-[60vh] flex flex-col items-center justify-center">
                  <div className="container mx-auto px-6 mb-8 text-center flex flex-col items-center relative">
                    <button 
                      onClick={() => setActiveCarouselGroup(null)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-text/50 hover:text-primary transition-colors text-sm font-accent flex items-center gap-2 tracking-widest uppercase border border-text/10 px-4 py-1.5 rounded-full"
                    >
                      <span>←</span> Back
                    </button>
                    <h4 className="text-xl font-heading text-text bg-surface/50 border border-text/20 px-6 py-2 rounded-full inline-block mt-12 md:mt-0">{activeCarouselGroup.name}</h4>
                    <p className="text-text/50 font-accent tracking-widest text-xs uppercase mt-4 animate-pulse">
                      ← Drag to scroll horizontally →
                    </p>
                  </div>
                  <div 
                    ref={sliderRef}
                    className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory h-[50vh] md:h-[75vh] items-center justify-start cursor-grab active:cursor-grabbing w-full touch-pan-x pb-6 custom-scrollbar"
                    onMouseDown={startDrag}
                    onMouseLeave={stopDrag}
                    onMouseUp={stopDrag}
                    onMouseMove={onDrag}
                  >
                    {activeCarouselGroup.items.map((img, i) => (
                      <div 
                        key={i} 
                        className="snap-center shrink-0 w-auto h-full flex-none cursor-zoom-in"
                        onClick={(e) => {
                          if (dragState.current.hasDragged) {
                            e.stopPropagation();
                            return;
                          }
                          openLightbox(i, activeCarouselGroup.items);
                        }}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `Carousel image ${i + 1}`}
                          className="h-full w-auto object-contain pointer-events-none select-none shadow-2xl"
                          draggable="false"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Lightbox 
        images={lightboxImages} 
        currentIndex={lightboxIndex} 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={nextLightboxImage}
        onPrev={prevLightboxImage}
      />
    </motion.div>
  );
};

export default ProjectDetail;
