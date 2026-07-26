import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ThemeContext } from '../context/ThemeContext';
import { ProfileContext } from '../context/ProfileContext';
import api from '../utils/api';

const bentoVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
  const { theme } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({ totalProjects: 0, totalClients: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [featuredRes, statsRes] = await Promise.all([
          api.get('/projects/featured'),
          api.get('/projects/stats')
        ]);
        setProjects(featuredRes.data.data.slice(0, 3)); // Take top 3 for Bento
        if (statsRes.data.success) {
          setProjectStats(statsRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchFeatured();
    window.scrollTo(0, 0);
  }, []);

  const handleProjectClick = (project) => {
    navigate(`/projects/${project.slug}`);
  };

  // Calculate dynamic experience
  const calculateExperience = () => {
    if (!profile?.experience || profile.experience.length === 0) return 0;
    
    let minDate = new Date();
    let maxDate = new Date(0);
    let hasValidDates = false;

    profile.experience.forEach(exp => {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        if (!isNaN(start.getTime())) {
          if (start < minDate) minDate = start;
          hasValidDates = true;
        }
      }
      
      if (exp.current) {
        maxDate = new Date();
      } else if (exp.endDate) {
        const end = new Date(exp.endDate);
        if (!isNaN(end.getTime()) && end > maxDate) {
          maxDate = end;
        }
      }
    });

    if (!hasValidDates) return 0;
    if (maxDate < minDate) maxDate = new Date();
    
    const diffYears = (maxDate - minDate) / (1000 * 60 * 60 * 24 * 365.25);
    return Math.floor(diffYears);
  };

  const dynamicYearsExp = calculateExperience();

  return (
    <motion.div 
      className="w-full min-h-screen bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[260px]">
          
          {/* 1. Hero Profile Card (2x2) */}
          <motion.div 
            variants={bentoVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-2 row-span-2 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-text/10 overflow-hidden relative group p-10 flex flex-col justify-end shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent z-10" />
            <img 
              src={profile?.photo?.url || 'https://placehold.co/800x800/png'} 
              alt={profile?.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-80" 
            />
            <div className="relative z-20">

               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading mb-4 leading-[0.95] whitespace-nowrap">
                 {profile?.name || 'Hello.'}
               </h1>
               <p className="text-xl md:text-2xl text-text/80 font-body max-w-lg mb-6">
                 {profile?.tagline || 'Crafting digital experiences.'}
               </p>
               
               {profile?.resumeUrl && (
                 <a 
                   href={profile.resumeUrl} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-accent uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-primary transition-colors shadow-lg"
                 >
                   📄 Download Resume
                 </a>
               )}
            </div>
          </motion.div>

          {/* 2. Stat 1 - Projects (1x1) */}
          <motion.div 
            variants={bentoVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 row-span-1 rounded-[2rem] bg-primary/10 border border-primary/20 backdrop-blur-xl p-8 flex flex-col justify-center items-center shadow-lg group hover:bg-primary/20 transition-colors"
          >
             <div className="text-5xl md:text-7xl font-heading text-primary mb-2 group-hover:scale-110 transition-transform">{projectStats.totalProjects || 0}+</div>
             <div className="text-xs uppercase tracking-widest font-accent text-text/70">Projects</div>
          </motion.div>

          {/* 3. Stat 2 - Experience (1x1) */}
          <motion.div 
            variants={bentoVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 row-span-1 rounded-[2rem] bg-secondary/10 border border-secondary/20 backdrop-blur-xl p-8 flex flex-col justify-center items-center shadow-lg group hover:bg-secondary/20 transition-colors"
          >
             <div className="text-5xl md:text-7xl font-heading text-secondary mb-2 group-hover:scale-110 transition-transform">{dynamicYearsExp}+</div>
             <div className="text-xs uppercase tracking-widest font-accent text-text/70">Years Exp</div>
          </motion.div>

          {/* 4. About Snippet (2x1) */}
          <motion.div 
            variants={bentoVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 md:col-span-2 row-span-1 rounded-[2rem] bg-surface/40 backdrop-blur-xl border border-text/10 p-10 flex flex-col justify-center cursor-pointer hover:bg-surface/60 transition-colors shadow-lg group"
            onClick={() => navigate('/about')}
          >
             <div className="flex justify-between items-start mb-4">
               <h3 className="text-3xl font-heading">About Me</h3>
               <div className="w-10 h-10 rounded-full bg-text/10 flex justify-center items-center group-hover:bg-primary group-hover:text-white transition-colors">→</div>
             </div>
             <p className="text-text/70 text-lg font-body line-clamp-3 leading-relaxed">
               {profile?.shortBio || 'I am a passionate designer creating beautiful interfaces.'}
             </p>
          </motion.div>

          {/* 5. Featured Project 1 (2x2) */}
          {projects[0] ? (
            <motion.div 
              variants={bentoVariants}
              initial="hidden"
              animate="visible"
              className="col-span-1 md:col-span-2 row-span-2 rounded-[2rem] overflow-hidden relative group cursor-pointer border border-text/10 shadow-xl" 
              onClick={() => handleProjectClick(projects[0])}
            >
               <img src={projects[0].thumbnail?.url} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
               <div className="absolute bottom-0 left-0 p-10 w-full">
                  <div className="px-4 py-1.5 bg-bg/50 backdrop-blur-md border border-text/20 rounded-full text-xs font-accent uppercase mb-4 inline-block tracking-widest">
                    {projects[0].category?.replace('-', ' ')}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-heading mb-2">{projects[0].title}</h3>
                  <div className="flex items-center gap-2 text-text/70 font-accent uppercase text-xs tracking-widest mt-4">
                    View Case Study <span className="group-hover:translate-x-2 transition-transform">→</span>
                  </div>
               </div>
            </motion.div>
          ) : (
            <div className="col-span-1 md:col-span-2 row-span-2 rounded-[2rem] bg-surface/30 border border-text/10 flex items-center justify-center">
               <p className="text-text/50 font-accent uppercase tracking-widest">No Projects Yet</p>
            </div>
          )}

          {/* 6. Contact CTA (1x2) */}
          <motion.div 
            variants={bentoVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 row-span-2 rounded-[2rem] bg-primary text-white p-10 flex flex-col justify-between cursor-pointer hover:brightness-110 transition-all shadow-xl group" 
            onClick={() => navigate('/contact')}
          >
             <div className="text-5xl md:text-6xl font-heading leading-tight">
                Let's<br/>Work<br/>Together
             </div>
             <div className="w-16 h-16 rounded-full bg-white text-primary flex justify-center items-center text-2xl group-hover:scale-110 transition-transform">
                ↗
             </div>
          </motion.div>

          {/* 7. Featured Project 2 (1x2) */}
          {projects[1] && (
            <motion.div 
              variants={bentoVariants}
              initial="hidden"
              animate="visible"
              className="col-span-1 row-span-2 rounded-[2rem] overflow-hidden relative group cursor-pointer border border-text/10 shadow-xl" 
              onClick={() => handleProjectClick(projects[1])}
            >
               <img src={projects[1].thumbnail?.url} alt={projects[1].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
               <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
               <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="px-3 py-1 bg-bg/50 backdrop-blur-md border border-text/20 rounded-full text-[10px] font-accent uppercase mb-3 inline-block tracking-widest">
                    {projects[1].category?.replace('-', ' ')}
                  </div>
                  <h3 className="text-3xl font-heading">{projects[1].title}</h3>
               </div>
            </motion.div>
          )}

        </div>
        
        {/* Footer Link to All Projects */}
        <motion.div 
          variants={bentoVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 flex justify-center"
        >
          <button 
            onClick={() => navigate('/projects')}
            className="px-8 py-4 rounded-full border border-text/20 bg-surface/30 backdrop-blur-md hover:bg-surface hover:border-primary transition-colors font-accent uppercase tracking-widest text-sm flex items-center gap-3"
          >
            View Full Archive <span className="text-primary text-xl">→</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
