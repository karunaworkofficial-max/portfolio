import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ThemeContext } from '../context/ThemeContext';
import { ProfileContext } from '../context/ProfileContext';
import api from '../utils/api';

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1 } 
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
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
        setProjects(featuredRes.data.data.slice(0, 2)); 
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
      if (exp.current) maxDate = new Date();
      else if (exp.endDate) {
        const end = new Date(exp.endDate);
        if (!isNaN(end.getTime()) && end > maxDate) maxDate = end;
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
      className="w-full min-h-screen relative bg-[#0a0a0a]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0 }}
    >
      {/* Dynamic Glow Orbs */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-15%] right-[-10%] w-[700px] h-[700px] rounded-full bg-secondary/10 blur-[180px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 min-h-screen relative z-10 flex flex-col justify-center">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,_auto)]"
        >
          
          {/* 1. Intro Block (col: 2, row: 2) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-2 md:row-span-2 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/20 hover:bg-white/10 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <span className="text-primary font-accent uppercase tracking-[0.2em] text-sm mb-4 block">Welcome to my universe</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading leading-[1.1] mb-6 text-white">
              Hello, I'm <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary bg-300% animate-gradient-shift">
                {profile?.name?.split(' ')[0] || 'Karuna'}
              </span>
            </h1>
            <p className="text-white/60 font-body text-lg md:text-xl leading-relaxed max-w-md">
              {profile?.tagline || 'Crafting digital experiences that merge logic with creativity.'}
            </p>
          </motion.div>

          {/* 2. Profile Photo (col: 1, row: 2) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2 rounded-[2.5rem] relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 hover:border-white/20 transition-all duration-500 bg-white/5 backdrop-blur-2xl"
          >
            <img 
              src={profile?.photo?.url || 'https://placehold.co/600x800/222/555'} 
              alt={profile?.name} 
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 text-white/90 font-accent text-xs uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-max border border-white/10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Available for work
              </div>
            </div>
          </motion.div>

          {/* 3. Featured Project 1 (col: 1, row: 2) */}
          {projects[0] ? (
            <motion.div 
              variants={itemVariants}
              onClick={() => navigate(`/projects/${projects[0].slug}`)}
              className="md:col-span-1 md:row-span-2 rounded-[2.5rem] relative overflow-hidden group cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/5 backdrop-blur-2xl"
            >
              <img src={projects[0].thumbnail?.url} alt={projects[0].title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-white/70 font-accent text-xs uppercase tracking-widest mb-2">{projects[0].category}</p>
                <h3 className="text-white font-heading text-2xl leading-tight">{projects[0].title}</h3>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <span className="inline-flex items-center gap-2 text-white text-sm font-accent uppercase tracking-widest">
                    View Project <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
             <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2 rounded-[2.5rem] bg-surface/30 backdrop-blur-xl border border-white/5 flex items-center justify-center">
                <p className="text-white/30 font-accent uppercase tracking-widest text-sm">Featured Project</p>
             </motion.div>
          )}

          {/* 4. Stats & Experience (col: 1, row: 1) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-center items-center group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/20 hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-5xl md:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1 group-hover:scale-110 transition-transform duration-500 relative z-10">
              {dynamicYearsExp}+
            </div>
            <div className="text-white/50 font-accent text-[10px] sm:text-xs uppercase tracking-widest relative z-10 text-center">Years Experience</div>
          </motion.div>

          {/* 5. Stats & Projects (col: 1, row: 1) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-center items-center group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/20 hover:bg-white/10 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-5xl md:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-500 relative z-10">
              {projectStats.totalProjects || 0}+
            </div>
            <div className="text-white/50 font-accent text-[10px] sm:text-xs uppercase tracking-widest relative z-10 text-center">Total Projects</div>
          </motion.div>

          {/* 6. About Link (col: 1, row: 1) */}
          <motion.div 
            variants={itemVariants}
            onClick={() => navigate('/about')}
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 cursor-pointer flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-white/20 hover:bg-white/10 transition-all duration-500 overflow-hidden relative"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors self-end absolute top-6 right-6">
              <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div className="mt-auto">
              <h3 className="text-2xl font-heading text-white mb-1">More About Me</h3>
              <p className="text-white/50 font-body text-sm">Discover my journey</p>
            </div>
          </motion.div>

          {/* 7. Contact Link (col: 1, row: 1) */}
          <motion.div 
            variants={itemVariants}
            onClick={() => navigate('/contact')}
            className="md:col-span-1 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary p-6 md:p-8 cursor-pointer flex flex-col justify-between group shadow-[0_8px_30px_rgba(170,59,255,0.3)] hover:shadow-[0_15px_40px_rgba(170,59,255,0.5)] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mb-4 self-end absolute top-6 right-6 backdrop-blur-sm">
              <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div className="mt-auto relative z-10">
              <h3 className="text-2xl font-heading text-white mb-1">Let's Talk</h3>
              <p className="text-white/70 font-body text-sm">Start a conversation</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
