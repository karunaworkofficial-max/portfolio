import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ProfileContext } from '../context/ProfileContext';
import { ThemeContext } from '../context/ThemeContext';
import { ContentContext } from '../context/ContentContext';
import api from '../utils/api';
import { fadeInUp, staggerContainer, fadeInLeft, fadeInRight } from '../utils/animations';

const SkillBar = ({ skill, index }) => (
  <motion.div variants={fadeInUp} className="mb-6 group">
    <div className="flex justify-between mb-2">
      <span className="font-accent text-sm tracking-wider uppercase text-white/80 group-hover:text-white transition-colors">{skill.name}</span>
      <span className="font-accent text-sm text-primary drop-shadow-[0_0_8px_var(--color-primary)] animate-pulse">{skill.level}%</span>
    </div>
    <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden relative border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full shadow-[0_0_15px_var(--color-primary)]"
      />
    </div>
  </motion.div>
);

const About = () => {
  const { profile, loading } = useContext(ProfileContext);
  const { theme } = useContext(ThemeContext);
  const { siteContent } = useContext(ContentContext);
  const experienceContainerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: experienceContainerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading || !profile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-bg">
        <div className="text-xl font-accent animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const designSkills = profile.skills?.filter(s => s.category === 'design') || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 relative bg-bg"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Sticky Left Sidebar */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-32 shrink-0">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-8 relative border border-white/10">
                <img 
                  src={profile.photo?.url || 'https://placehold.co/800x800/png'} 
                  alt={profile.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
                />
              </div>

              <h1 className="text-4xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mb-2">{profile.name}</h1>
              <p className="text-primary font-accent uppercase tracking-widest text-xs mb-6 block drop-shadow-[0_0_5px_var(--color-primary)]">
                {siteContent?.about?.titleRole || 'Interactive Designer'}
              </p>
              
              <p className="text-white/60 font-body text-sm leading-relaxed mb-8">
                {profile.tagline || 'Crafting digital experiences that merge logic with creativity.'}
              </p>

              {profile.resumeUrl && (
                <a 
                  href={profile.resumeUrl?.includes('cloudinary') ? profile.resumeUrl.replace('/upload/', '/upload/fl_attachment/') : profile.resumeUrl}
                  download="Resume.pdf"
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="relative z-10 w-full py-4 rounded-full bg-white/5 border border-white/10 text-white font-accent uppercase tracking-widest text-xs hover:bg-primary hover:border-primary transition-colors flex justify-center items-center gap-2"
                >
                  Download Resume
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </a>
              )}
            </motion.div>
          </div>

          {/* Scrolling Right Content */}
          <div className="w-full lg:w-2/3 pt-4">
            
            {/* The Story / Bio */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="mb-32"
            >
              <h2 className="text-sm font-accent text-primary uppercase tracking-[0.2em] mb-6">
                {siteContent?.about?.journeyHeading || 'The Journey'}
              </h2>
              {profile.designPhilosophy && (
                <div className="mb-12">
                  <h3 className="text-2xl md:text-3xl font-heading text-white leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] max-w-4xl">
                    {profile.designPhilosophy}
                  </h3>
                </div>
              )}
              
              <div className="prose prose-invert prose-lg max-w-none font-body text-white/60 leading-[2] tracking-wide">
                <p className="mb-6">{siteContent?.about?.journeyText || 'Hi, I am Karuna. I craft digital experiences that merge logic with creativity.'}</p>
                {profile.bio?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </motion.section>
            {/* Experience Timeline */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
              className="mb-32"
            >
              <h2 className="text-sm font-accent text-primary uppercase tracking-[0.2em] mb-12">Experience</h2>
              
              <div className="relative border-l border-white/10 ml-4 space-y-16 pb-8" ref={experienceContainerRef}>
                <motion.div 
                  className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent origin-top" 
                  style={{ scaleY }} 
                />

                {profile.experience?.map((exp, idx) => (
                  <motion.div 
                    key={exp._id || idx}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInLeft}
                    className="relative pl-10 group"
                  >
                    <motion.div 
                      variants={{
                        hidden: { backgroundColor: "rgba(255,255,255,0.1)", boxShadow: "0 0 0px rgba(170,59,255,0)" },
                        visible: { backgroundColor: exp.current ? "#aa3bff" : "#a855f7", boxShadow: "0 0 20px 4px rgba(170,59,255,0.5)", transition: { duration: 0.5, delay: 0.2 } }
                      }}
                      className="absolute -left-[9px] top-2 w-5 h-5 rounded-full border-4 border-bg z-10" 
                    />
                    
                    <div className="mb-3 flex flex-wrap gap-4 items-center">
                      <span className="text-sm font-accent text-primary tracking-widest">{exp.period}</span>
                      {exp.type && <span className="text-[10px] uppercase font-accent border border-white/20 px-2 py-1 rounded text-white/50">{exp.type}</span>}
                    </div>
                    <h4 className="text-3xl font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary drop-shadow-[0_0_10px_var(--color-primary)] mb-2">{exp.role}</h4>
                    <p className="text-xl font-body text-white/90 mb-4 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{exp.company}</p>
                    <p className="text-white/50 font-body leading-relaxed text-base">{exp.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Education */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-32"
            >
              <h2 className="text-sm font-accent text-primary uppercase tracking-[0.2em] mb-12">Education</h2>
              <div className="grid gap-6">
                {profile.education?.map((edu, idx) => (
                  <motion.div 
                    key={edu._id || idx}
                    variants={fadeInUp}
                    className="bg-surface/30 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:bg-surface/50 hover:border-primary/30 transition-all duration-300 group"
                  >
                    <span className="text-xs font-accent text-primary drop-shadow-[0_0_5px_var(--color-primary)] tracking-widest block mb-3">{edu.year}</span>
                    <h4 className="text-2xl font-heading text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">{edu.degree}</h4>
                    <p className="text-white/70 font-body text-lg mb-4">{edu.institution}</p>
                    {edu.description && <p className="text-white/50 font-body text-sm leading-relaxed">{edu.description}</p>}
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Skills & Tools */}
            <motion.section 
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-sm font-accent text-primary uppercase tracking-[0.2em] mb-12">Expertise & Tools</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <h3 className="text-2xl font-heading mb-8 text-white">Design Skills</h3>
                  <motion.div variants={staggerContainer}>
                    {designSkills.map((skill, index) => (
                      <SkillBar key={index} skill={skill} index={index} />
                    ))}
                  </motion.div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-heading mb-8 text-white">Software</h3>
                  <div className="flex flex-wrap gap-3">
                    {profile.tools?.map((tool, index) => (
                      <motion.div 
                        key={index}
                        variants={fadeInUp}
                        className="px-5 py-3 bg-surface/40 border border-white/5 rounded-full font-accent text-xs uppercase tracking-widest text-white/80 hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default"
                      >
                        {tool.name}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <motion.section 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-32"
              >
                <h2 className="text-sm font-accent text-primary uppercase tracking-[0.2em] mb-12">Certifications</h2>
                <div className="grid gap-6">
                  {profile.certifications.map((cert, idx) => (
                    <motion.div 
                      key={cert._id || idx}
                      variants={fadeInUp}
                      className="bg-surface/30 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] hover:bg-surface/50 hover:border-primary/30 transition-all duration-300 group flex flex-col md:flex-row justify-between md:items-center gap-4"
                    >
                      <div>
                        <h4 className="text-xl font-heading text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">{cert.title}</h4>
                        <p className="text-white/70 font-body text-md">{cert.issuer}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-accent text-primary drop-shadow-[0_0_5px_var(--color-primary)] tracking-widest block">{cert.year}</span>
                        {cert.link && (
                          <a href={cert.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white/10 rounded-full text-xs font-accent text-white/80 hover:text-white hover:border-primary transition-colors uppercase tracking-wider">
                            View
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
