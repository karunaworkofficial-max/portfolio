import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { fadeInUp } from '../../utils/animations';

const ProjectCard = ({ project, layoutMode = 'grid', index }) => {
  const navigate = useNavigate();

  const textureUrl = (project.thumbnail && project.thumbnail.url && project.thumbnail.url.startsWith('http')) 
    ? project.thumbnail.url 
    : 'https://placehold.co/1200x800/png';

  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative overflow-hidden rounded-[2rem] cursor-pointer border border-white/10 bg-surface/30 break-inside-avoid inline-block w-full mb-6 shadow-xl`}
      onClick={() => navigate(`/projects/${project.slug}`)}
    >
      {/* Image / Video */}
      <div className="w-full relative">
        {project.videoUrl ? (
          <video 
            src={project.videoUrl} 
            loop 
            muted 
            playsInline
            onMouseEnter={(e) => e.target.play()}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
            poster={textureUrl}
            className="w-full h-auto block transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105 object-cover"
          />
        ) : (
          <img 
            src={textureUrl} 
            alt={project.title}
            className="w-full h-auto block transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
          />
        )}
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        
        {/* Top items (Category & Year) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="px-3 py-1 bg-primary text-white text-xs font-accent uppercase tracking-wider rounded-full">
            {project.category?.replace('-', ' ')}
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full text-pink-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill={project.likes > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span className="text-[10px] font-accent text-white">{project.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
              <span className="text-[10px] font-accent text-white">{project.shares || 0}</span>
            </div>
            {project.projectYear && <span className="text-white/70 font-accent text-sm ml-2 hidden sm:inline-block">{project.projectYear}</span>}
          </div>
        </div>

        {/* Bottom items */}
        <div>
          <h3 className="text-xl md:text-2xl font-heading text-white mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
            {project.title}
          </h3>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            {project.clientName && (
              <p className="text-white/70 font-body text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                Client: {project.clientName}
              </p>
            )}
            
            {/* Color Palette */}
            {project.colorPalette && project.colorPalette.length > 0 && (
              <div className="flex gap-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                {project.colorPalette.slice(0, 4).map((color, idx) => (
                  <span 
                    key={idx} 
                    className="w-4 h-4 rounded-full border border-white/10 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Tools */}
          {project.tools && project.tools.length > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
              {project.tools.slice(0, 3).map((tool, idx) => (
                <span key={idx} className="text-xs font-accent text-white/70 bg-white/10 px-2 py-1 rounded">
                  {tool}
                </span>
              ))}
              {project.tools.length > 3 && (
                <span className="text-xs font-accent text-white/70 bg-white/10 px-2 py-1 rounded">
                  +{project.tools.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Primary border on hover */}
      <div className="absolute inset-0 border-[2px] border-transparent group-hover:border-white/20 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all duration-500 pointer-events-none group-hover:shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_0_10px_rgba(255,255,255,0.1)]" />
    </motion.div>
  );
};

export default ProjectCard;
