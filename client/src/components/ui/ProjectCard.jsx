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
      {/* Image */}
      <div className="w-full relative">
        <img 
          src={textureUrl} 
          alt={project.title}
          className="w-full h-auto block transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-105"
        />
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
          <span className="text-white/70 font-accent text-sm">{project.projectYear}</span>
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
