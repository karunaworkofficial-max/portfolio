import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ThemeContext } from '../context/ThemeContext';
import { ProfileContext } from '../context/ProfileContext';
import { SiteSettingsContext } from '../context/SiteSettingsContext';
import api from '../utils/api';
import MagneticButton from '../components/ui/MagneticButton';
import EditableText from '../components/admin/EditableText';

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

const Home = ({ isAdmin = false }) => {
  const { theme } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);
  const { settings, updateSettingByPath } = useContext(SiteSettingsContext);
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({ totalProjects: 0, totalClients: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const [projectsRes, statsRes] = await Promise.all([
          api.get('/projects?limit=100'),
          api.get('/projects/stats')
        ]);
        setProjects(projectsRes.data.data); 
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
    
    // Only consider experience where role contains "graphic designer"
    const graphicDesignExp = profile.experience.filter(exp => 
      exp.role && exp.role.toLowerCase().includes('graphic designer')
    );
    
    if (graphicDesignExp.length === 0) return 0;

    let minDate = new Date();
    let maxDate = new Date(0);
    let hasValidDates = false;
    
    graphicDesignExp.forEach(exp => {
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
          
          {/* 1. Intro Block (col: 3, row: 2) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-3 md:row-span-2 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/50 hover:bg-white/10 transition-all duration-500 hover:shadow-[0_0_25px_rgba(170,59,255,0.15),inset_0_0_15px_rgba(170,59,255,0.15)]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <EditableText 
              as="span"
              isAdmin={isAdmin}
              value={settings?.home?.hero?.subtitle || 'Welcome to my universe'}
              onSave={(val) => updateSettingByPath('home.hero.subtitle', val)}
              className="text-primary font-accent uppercase tracking-[0.2em] text-sm mb-4 block"
            />
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading leading-[1.1] mb-6 text-white">
              <EditableText 
                as="span"
                isAdmin={isAdmin}
                value={settings?.home?.hero?.headingLine1 || "Hello, I'm"}
                onSave={(val) => updateSettingByPath('home.hero.headingLine1', val)}
              /> <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-secondary bg-300% animate-gradient-shift">
                {profile?.name?.split(' ')[0] || 'Karuna'}
              </span>
            </h1>
            <EditableText 
              as="p"
              multiline
              isAdmin={isAdmin}
              value={settings?.home?.hero?.description || profile?.tagline || 'Crafting digital experiences that merge logic with creativity.'}
              onSave={(val) => updateSettingByPath('home.hero.description', val)}
              className="text-white/60 font-body text-lg md:text-xl leading-relaxed max-w-md"
            />
          </motion.div>

          {/* 2. Profile Photo (col: 1, row: 2) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 md:row-span-2 rounded-[2.5rem] relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 hover:border-accent/50 transition-all duration-500 hover:shadow-[0_0_25px_rgba(244,114,182,0.15),inset_0_0_15px_rgba(244,114,182,0.15)] bg-white/5 backdrop-blur-2xl"
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
                <EditableText 
                  as="span"
                  isAdmin={isAdmin}
                  value={settings?.home?.hero?.availability || 'Available for work'}
                  onSave={(val) => updateSettingByPath('home.hero.availability', val)}
                />
              </div>
            </div>
          </motion.div>

          {/* 4. Stats & Experience (col: 1, row: 1) */}
          <motion.div 
            variants={itemVariants}
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-center items-center group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-purple-400/50 hover:bg-white/10 transition-all duration-500 relative overflow-hidden hover:shadow-[0_0_25px_rgba(168,85,247,0.15),inset_0_0_15px_rgba(168,85,247,0.15)]"
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
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 flex flex-col justify-center items-center group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-500 relative overflow-hidden hover:shadow-[0_0_25px_rgba(34,211,238,0.15),inset_0_0_15px_rgba(34,211,238,0.15)]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="text-5xl md:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-1 group-hover:scale-110 transition-transform duration-500 relative z-10">
              {projectStats.totalProjects || 0}+
            </div>
            <div className="text-white/50 font-accent text-[10px] sm:text-xs uppercase tracking-widest relative z-10 text-center">Total Projects</div>
          </motion.div>

          {/* 6. About Link (col: 1, row: 1) */}
          <MagneticButton 
            variants={itemVariants}
            onClick={() => navigate('/about')}
            className="md:col-span-1 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 cursor-pointer flex flex-col justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-primary/50 hover:bg-white/10 transition-all duration-500 overflow-hidden relative hover:shadow-[0_0_25px_rgba(170,59,255,0.15),inset_0_0_15px_rgba(170,59,255,0.15)]"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors self-end absolute top-6 right-6">
              <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div className="mt-auto text-left">
              <EditableText
                as="h3"
                isAdmin={isAdmin}
                value={settings?.home?.links?.aboutTitle || 'More About Me'}
                onSave={(val) => updateSettingByPath('home.links.aboutTitle', val)}
                className="text-2xl font-heading text-white mb-1"
              />
              <EditableText
                as="p"
                isAdmin={isAdmin}
                value={settings?.home?.links?.aboutSubtitle || 'Discover my journey'}
                onSave={(val) => updateSettingByPath('home.links.aboutSubtitle', val)}
                className="text-white/50 font-body text-sm"
              />
            </div>
          </MagneticButton>

          {/* 7. Contact Link (col: 1, row: 1) */}
          <MagneticButton 
            variants={itemVariants}
            onClick={() => navigate('/contact')}
            className="md:col-span-1 rounded-[2.5rem] bg-gradient-to-br from-primary to-secondary p-6 md:p-8 cursor-pointer flex flex-col justify-between group shadow-[0_8px_30px_rgba(170,59,255,0.3)] hover:shadow-[0_15px_40px_rgba(170,59,255,0.5)] transition-all overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center mb-4 self-end absolute top-6 right-6 backdrop-blur-sm">
              <svg className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <div className="mt-auto relative z-10 text-left">
              <EditableText
                as="h3"
                isAdmin={isAdmin}
                value={settings?.home?.links?.contactTitle || "Let's Talk"}
                onSave={(val) => updateSettingByPath('home.links.contactTitle', val)}
                className="text-2xl font-heading text-white mb-1"
              />
              <EditableText
                as="p"
                isAdmin={isAdmin}
                value={settings?.home?.links?.contactSubtitle || 'Start a conversation'}
                onSave={(val) => updateSettingByPath('home.links.contactSubtitle', val)}
                className="text-white/70 font-body text-sm"
              />
            </div>
          </MagneticButton>

        </motion.div>

        {/* Reviews Section */}
        {profile?.reviews && profile.reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-12 text-center">What People Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.reviews.map((review, idx) => (
                <div key={review._id || idx} className="bg-surface/30 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:bg-surface/50 transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-9.999z"/></svg>
                  </div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-white/80 font-body leading-relaxed mb-8 italic relative z-10">"{review.text}"</p>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-heading text-lg">
                      {review.clientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-white font-heading text-sm">{review.clientName}</h4>
                      <p className="text-white/50 font-accent text-[10px] tracking-widest uppercase">{review.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scrolling Text Marquee */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 w-full overflow-hidden relative border-y border-white/5 bg-primary/5 py-4 z-10 -mx-[50vw] right-[50%] left-[50%] w-[100vw] rotate-[-2deg]"
          style={{ width: '100vw', marginLeft: '-50vw', marginRight: '-50vw' }}
        >
          <div className="flex w-[200%] animate-marquee">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-none mx-8 flex items-center gap-8">
                {(settings?.home?.marquee?.items || ['CREATIVE DESIGNER', '✦', 'UI / UX', '✦', 'PROBLEM SOLVER', '✦']).map((item, idx) => {
                  if (item === '✦') {
                    return <span key={idx} className="text-4xl text-white/20">✦</span>;
                  }
                  // We'll alternate colors slightly based on index
                  const isPrimary = idx % 4 === 0;
                  const isSecondary = idx % 4 === 2;
                  
                  if (isPrimary) {
                    return <span key={idx} className="text-4xl md:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-bold uppercase tracking-widest whitespace-nowrap opacity-80">{item}</span>;
                  } else if (isSecondary) {
                    return <span key={idx} className="text-4xl md:text-6xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-secondary to-pink-500 font-bold uppercase tracking-widest whitespace-nowrap opacity-80">{item}</span>;
                  } else {
                    return <span key={idx} className="text-4xl md:text-6xl font-heading text-white/80 font-bold uppercase tracking-widest whitespace-nowrap text-stroke-primary">{item}</span>;
                  }
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scrolling Projects Marquee */}
        {projects && projects.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-24 w-full overflow-hidden relative border-y border-white/5 bg-surface/10 py-12 z-10 -mx-[50vw] right-[50%] left-[50%] w-[100vw]"
            style={{ width: '100vw', marginLeft: '-50vw', marginRight: '-50vw' }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-48 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
            
            <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">
              {[...projects, ...projects, ...projects].map((p, i) => (
                <div 
                  key={`${p._id}-${i}`} 
                  onClick={() => navigate(`/projects/${p.slug}`)} 
                  className="flex-none w-72 md:w-96 mx-4 relative group cursor-pointer rounded-[2rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-colors bg-surface/30 shadow-lg"
                >
                  <div className="aspect-video relative overflow-hidden bg-black">
                    {p.videoUrl ? (
                      <video src={p.videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <img src={p.thumbnail?.url} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    )}
                  </div>
                  <div className="p-6 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-primary font-accent tracking-widest text-[10px] uppercase mb-1 drop-shadow-md">{p.category}</p>
                    <h3 className="text-white font-heading text-xl truncate drop-shadow-md">{p.title || 'Untitled'}</h3>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Home;
