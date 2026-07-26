import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ProfileContext } from '../context/ProfileContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../utils/api';
import { fadeInUp, staggerContainer, fadeInLeft, fadeInRight } from '../utils/animations';

const Counter = ({ from = 0, to, duration = 2 }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, to, from, duration]);

  return <span ref={ref}>{count}</span>;
};

const SkillBar = ({ skill, index }) => (
  <motion.div variants={fadeInUp} className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="font-accent text-sm tracking-wider uppercase">{skill.name}</span>
      <span className="font-accent text-sm text-primary">{skill.level}%</span>
    </div>
    <div className="h-2 w-full bg-text/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        className="h-full bg-primary rounded-full"
      />
    </div>
  </motion.div>
);

const About = () => {
  const { profile, loading } = useContext(ProfileContext);
  const { theme } = useContext(ThemeContext);
  const [projectStats, setProjectStats] = useState({ totalProjects: 0, totalClients: 0 });
  const experienceContainerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: experienceContainerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/projects/stats');
        if (data.success) setProjectStats(data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      }
    };
    fetchStats();
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-xl font-accent animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const designSkills = profile.skills?.filter(s => s.category === 'design') || [];

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 pb-20"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-6 lg:px-12 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={fadeInLeft} 
            initial="hidden" 
            animate="visible"
            className="order-2 lg:order-1 relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto lg:mx-0 group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700" />
              <img 
                src={profile.photo?.url || 'https://placehold.co/800x800/png'} 
                alt={profile.name} 
                className="relative z-10 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            variants={fadeInRight} 
            initial="hidden" 
            animate="visible"
            className="order-1 lg:order-2 flex flex-col justify-center"
          >
            <div className="inline-flex items-center px-4 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-accent uppercase tracking-widest mb-8 self-start shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Available for work
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-8 leading-[1.05] tracking-tight text-text-h">
              <span className="block text-lg md:text-xl font-accent text-primary mb-4 tracking-widest uppercase opacity-90">Hello, I'm</span>
              {profile.name?.split(' ')[0] || 'a Designer'}.
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl font-body text-text/70 mb-10 leading-relaxed max-w-2xl font-light">
              {profile.tagline}
            </p>
            {profile.location && (profile.location.city || profile.location.country) && (
              <p className="text-text/50 font-accent uppercase tracking-widest text-sm flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-surface/30 border-y border-text/20 py-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            {profile.designPhilosophy && (
              <div className="mb-16 relative text-center">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl text-text/10 font-heading pointer-events-none">"</span>
                <p className="text-3xl md:text-4xl lg:text-5xl font-heading text-primary leading-tight relative z-10 italic max-w-4xl mx-auto">
                  {profile.designPhilosophy}
                </p>
              </div>
            )}
            
            <div className="prose prose-invert prose-xl max-w-4xl mx-auto font-body text-text/80 leading-[2.2] md:text-center tracking-wide">
              {profile.bio?.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-8 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 lg:px-12 py-24 border-b border-text/20">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-white/10"
        >
          <motion.div variants={fadeInUp} className="text-center px-4 group">
            <div className="text-5xl md:text-6xl font-heading mb-2 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              <Counter to={projectStats.totalProjects || 0} />+
            </div>
            <div className="text-xs md:text-sm font-accent uppercase tracking-widest text-text/50">Projects</div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="text-center px-4 group">
            <div className="text-5xl md:text-6xl font-heading mb-2 bg-gradient-to-r from-pink-400 to-orange-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              <Counter to={projectStats.totalClients || 0} />+
            </div>
            <div className="text-xs md:text-sm font-accent uppercase tracking-widest text-text/50">Clients</div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="text-center px-4 group">
            <div className="text-5xl md:text-6xl font-heading mb-2 bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              <Counter to={profile.stats?.selfProjects ?? profile.selfProjects ?? 0} />+
            </div>
            <div className="text-xs md:text-sm font-accent uppercase tracking-widest text-text/50">Self Projects</div>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center px-4 group">
            <div className="text-5xl md:text-6xl font-heading mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              <Counter to={dynamicYearsExp} />+
            </div>
            <div className="text-xs md:text-sm font-accent uppercase tracking-widest text-text/50">Years Exp.</div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="text-center px-4 group">
            <div className="text-5xl md:text-6xl font-heading mb-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              <Counter to={profile.stats?.awardsCount ?? profile.awardsCount ?? 0} />+
            </div>
            <div className="text-xs md:text-sm font-accent uppercase tracking-widest text-text/50">Awards</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Skills & Tools */}
      <div className="container mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Design Skills */}
          <div>
            <h3 className="text-3xl font-heading mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-primary" />
              Design Skills
            </h3>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {designSkills.map((skill, index) => (
                <SkillBar key={index} skill={skill} index={index} />
              ))}
            </motion.div>
          </div>
          
          {/* Tools */}
          <div>
            <h3 className="text-3xl font-heading mb-12 flex items-center gap-4">
              <span className="w-8 h-1 bg-secondary" />
              Tools & Software
            </h3>
            <motion.div 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {profile.tools?.map((tool, index) => {
                let stars = 1;
                switch (tool.proficiency?.toLowerCase()) {
                  case 'beginner': stars = 2; break;
                  case 'intermediate': stars = 3; break;
                  case 'advanced': stars = 4; break;
                  case 'expert': stars = 5; break;
                  default: stars = 1; break;
                }
                
                return (
                  <motion.div 
                    key={index} 
                    variants={fadeInUp}
                    className="bg-surface/50 border border-text/20 p-4 rounded hover:-translate-y-1 hover:border-primary/50 transition-all cursor-default flex flex-col justify-center"
                  >
                    <div className="font-accent text-sm text-text mb-2">{tool.name}</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((starIndex) => (
                        <svg 
                          key={starIndex} 
                          className={`w-4 h-4 ${starIndex <= stars ? 'text-primary' : 'text-text/20'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="bg-surface/30 py-24 border-y border-text/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            
            {/* Experience */}
            <div>
              <h3 className="text-3xl font-heading mb-12">Experience</h3>
              <div className="relative border-l border-text/20 ml-4 space-y-12 pb-8" ref={experienceContainerRef}>
                {/* Foreground animated line */}
                <motion.div 
                  className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-primary origin-top" 
                  style={{ scaleY }} 
                />

                {profile.experience?.map((exp, idx) => (
                  <motion.div 
                    key={exp._id || idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInLeft}
                    className="relative pl-8"
                  >
                    <motion.div 
                      variants={{
                        hidden: { backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(170,59,255,0)" },
                        visible: { backgroundColor: exp.current ? "#aa3bff" : "#a855f7", boxShadow: "0 0 15px 2px rgba(170,59,255,0.8)", transition: { duration: 0.5, delay: 0.2 } }
                      }}
                      className="absolute -left-2 top-1.5 w-4 h-4 rounded-full border-4 border-bg z-10" 
                    />
                    {exp.current && (
                      <div className="absolute -left-2 top-1.5 w-4 h-4 rounded-full bg-primary animate-ping opacity-75 z-0" />
                    )}

                    <div className="mb-2 flex flex-wrap gap-3 items-center">
                      <span className="text-sm font-accent text-primary tracking-widest">{exp.period}</span>
                      {exp.type && <span className="text-[10px] uppercase font-accent border border-text/20 px-2 py-0.5 rounded text-text/70">{exp.type}</span>}
                    </div>
                    <h4 className="text-2xl font-heading text-text mb-1">{exp.role}</h4>
                    <p className="text-lg font-body text-text/70 mb-4">{exp.company}</p>
                    <p className="text-text/70 font-body leading-relaxed text-sm">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-3xl font-heading mb-12">Education</h3>
              <div className="space-y-8">
                {profile.education?.map((edu, idx) => (
                  <motion.div 
                    key={edu._id || idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                    className="relative bg-surface/30 backdrop-blur-md border border-white/10 p-8 rounded-custom shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] hover:bg-surface/50 hover:shadow-[0_8px_32px_0_rgba(170,59,255,0.1)] hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <span className="text-sm font-accent text-secondary tracking-widest block mb-2">{edu.year}</span>
                    <h4 className="text-xl font-heading text-text mb-1">{edu.degree}</h4>
                    <p className="text-text/70 font-body mb-1">{edu.institution}</p>
                    {edu.description && <p className="text-text/70 font-body text-sm mt-4">{edu.description}</p>}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specializations */}
      {profile.specializations?.length > 0 && (
        <div className="container mx-auto px-6 lg:px-12 py-24 text-center border-b border-text/20">
          <h3 className="text-3xl font-heading mb-12">I Specialize In</h3>
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={staggerContainer}
            className="flex flex-wrap justify-center gap-4"
          >
            {profile.specializations.map((spec, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                className="px-6 py-4 bg-surface border border-text/20 rounded-full font-heading text-xl hover:bg-primary hover:border-primary transition-colors cursor-default shadow-lg"
              >
                {spec}
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* CTA Section */}
      <div className="container mx-auto px-6 lg:px-12 py-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <h2 className="text-5xl md:text-7xl font-heading mb-8">Let's work together.</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="/contact" className="px-8 py-4 bg-primary text-text font-heading text-xl rounded hover:bg-secondary transition-colors w-full sm:w-auto text-center">
              Get in Touch
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-surface border border-text/20 text-text font-heading text-xl rounded hover:border-primary transition-colors w-full sm:w-auto text-center">
                Download Resume
              </a>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default About;
