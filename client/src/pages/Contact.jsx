import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileContext } from '../context/ProfileContext';
import { ThemeContext } from '../context/ThemeContext';
import api from '../utils/api';
import { fadeInUp, staggerContainer, fadeInLeft, fadeInRight } from '../utils/animations';
import confetti from 'canvas-confetti';
import MagneticButton from '../components/ui/MagneticButton';

const InputField = ({ label, name, type = 'text', value, onChange, error, placeholder, textarea = false }) => {
  return (
    <div className="mb-6 relative group">
      <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2 transition-colors group-focus-within:text-primary text-white">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className={`w-full bg-surface/30 border-b-2 ${error ? 'border-red-500' : 'border-white/20 group-focus-within:border-primary'} px-4 py-3 font-body focus:outline-none transition-colors resize-none text-white placeholder-white/30 rounded-t-lg`}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-surface/30 border-b-2 ${error ? 'border-red-500' : 'border-white/20 group-focus-within:border-primary'} px-4 py-3 font-body focus:outline-none transition-colors text-white placeholder-white/30 rounded-t-lg`}
        />
      )}
      {error && <span className="absolute -bottom-5 left-0 text-xs text-red-500 font-accent">{error}</span>}
    </div>
  );
};

const SelectField = ({ label, name, value, onChange, options }) => {
  return (
    <div className="mb-6 relative group">
      <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2 transition-colors group-focus-within:text-primary text-white">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-surface/30 border-b-2 border-white/20 group-focus-within:border-primary px-4 py-3 font-body focus:outline-none transition-colors appearance-none cursor-pointer text-white rounded-t-lg"
      >
        <option value="" disabled className="bg-bg text-white/50">Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt} className="bg-bg text-white">
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-4 top-10 pointer-events-none opacity-50 text-white">
        ▼
      </div>
    </div>
  );
};

const Contact = () => {
  const { profile } = useContext(ProfileContext);
  const { theme } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    name: '', email: '', projectType: '', budget: '', timeline: '', message: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    setServerError('');
    
    const mapEnum = (val, type) => {
      if (!val) return undefined;
      const map = {
        projectType: {
          'Brand Identity': 'brand-identity', 'Logo Design': 'logo', 'Packaging Design': 'packaging', 'Social Media Design': 'social-media', 'Print Design': 'print', 'Web/UI Design': 'web-design', 'Other': 'other'
        },
        budget: {
          'Under $500': 'under-500', '$500 - $1,000': '500-1000', '$1,000 - $2,500': '1000-2500', '$2,500 - $5,000': '2500-5000', '$5,000+': '5000-plus', 'Not sure yet': 'not-sure'
        },
        timeline: {
          'ASAP': 'asap', '1-2 weeks': '1-2-weeks', '1 month': '1-month', '2-3 months': '2-3-months', 'Flexible': 'flexible'
        }
      };
      return map[type][val] || undefined;
    };

    const payload = { ...formData };
    if (payload.projectType) payload.projectType = mapEnum(payload.projectType, 'projectType'); else delete payload.projectType;
    if (payload.budget) payload.budget = mapEnum(payload.budget, 'budget'); else delete payload.budget;
    if (payload.timeline) payload.timeline = mapEnum(payload.timeline, 'timeline'); else delete payload.timeline;
    
    try {
      await api.post('/messages', payload);
      setStatus('success');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6C63FF', '#FF6584', '#00D4AA']
      });

      setFormData({ name: '', email: '', projectType: '', budget: '', timeline: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-32 pb-20 relative bg-bg"
    >
      <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[900px] h-[900px] bg-primary/5 blur-[150px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side: Split Screen Elegance */}
        <div className="w-full lg:w-1/2 order-2 lg:order-1 flex flex-col justify-center">
          <motion.div initial="hidden" animate="visible" variants={fadeInLeft} className="mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading mb-8 leading-[1.05] tracking-tight text-white">
              Let's create something <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">amazing</span> together.
            </h1>
            <p className="text-xl md:text-2xl font-body text-white/60 leading-relaxed max-w-lg">
              Have a project in mind? I'd love to hear about it. Drop a message or connect through social media.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-12">
            
            {/* Quick Contacts */}
            <div className="flex flex-col gap-6">
              {profile?.email && (
                <motion.div variants={fadeInLeft} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors">
                    <svg className="w-5 h-5 text-red-500 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M2 6l10 7 10-7"></path></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-accent uppercase tracking-widest text-white/50 mb-1">Email</div>
                    <a href={`mailto:${profile.email}`} className="text-lg font-body text-white hover:text-primary transition-colors">{profile.email}</a>
                  </div>
                </motion.div>
              )}
              {profile?.location && (profile.location.city || profile.location.country) && (
                <motion.div variants={fadeInLeft} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-surface/50 border border-white/5 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                    <svg className="w-5 h-5 text-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-accent uppercase tracking-widest text-white/50 mb-1">Location</div>
                    <p className="text-lg font-body text-white">
                      {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Social Links */}
            {profile?.socialLinks && Object.values(profile.socialLinks).some(link => link) && (
              <motion.div variants={fadeInLeft}>
                <div className="text-[10px] font-accent uppercase tracking-widest text-white/50 mb-4 block">Follow Me</div>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(profile.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const getIcon = (platformName) => {
                      const name = platformName.toLowerCase();
                      if (name === 'instagram') return (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <linearGradient id="ig-grad" x1="2" y1="22" x2="22" y2="2">
                              <stop offset="0%" stopColor="#feda75" />
                              <stop offset="25%" stopColor="#fa7e1e" />
                              <stop offset="50%" stopColor="#d62976" />
                              <stop offset="75%" stopColor="#962fbf" />
                              <stop offset="100%" stopColor="#4f5bd5" />
                            </linearGradient>
                          </defs>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad)"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad)"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad)"></line>
                        </svg>
                      );
                      if (name === 'linkedin') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
                      if (name === 'dribbble') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#ea4c89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>;
                      if (name === 'behance') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1769ff"><path d="M22 7h-7v2h7V7zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.374 4.8h-8.4c.022 1.493.7 2.89 2.583 2.89 1.614 0 2.152-.717 2.562-1.475h3.08zM19.16 11.5c0-1.153-.755-1.727-1.54-1.727-.785 0-1.516.574-1.516 1.727h3.056zM8.93 15.35c.67.625 1.83 1 2.87 1 2.45 0 3.72-1.125 3.72-3.1 0-1.925-1.22-2.75-2.82-3.025v-.125c1.22-.275 2.32-1.175 2.32-2.75 0-2.1-1.32-3.15-3.5-3.15H2v15h9.45c2.4 0 3.8-1.075 3.8-3.325 0-1.925-1.27-2.9-2.9-3.225v-.125c1.17.2 2.3.925 2.3 2.55 0 1.575-1 2.525-2.67 2.525H5v-2.3zm-.13-9.1c1.375 0 2.225.625 2.225 1.775 0 1.25-.85 1.875-2.225 1.875H5v-3.65h3.8z"/></svg>;
                      return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
                    };
                    return (
                      <a 
                        key={platform} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-surface/30 backdrop-blur-md border border-white/5 rounded-full flex items-center justify-center hover:bg-surface hover:border-white/20 hover:-translate-y-2 transition-all shadow-lg"
                        aria-label={platform}
                        title={platform}
                      >
                        {getIcon(platform)}
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Side: Floating Form */}
        <div className="w-full lg:w-1/2 order-1 lg:order-2">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeInRight}
            className="bg-surface/20 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[3rem] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <motion.svg 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </motion.svg>
                  </div>
                  <h3 className="text-4xl font-heading mb-4 text-white">Message Sent!</h3>
                  <p className="text-white/60 font-body text-lg max-w-sm mb-8">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-accent uppercase tracking-widest text-xs hover:bg-white/10 transition-colors text-white"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial="hidden" 
                  animate="visible" 
                  variants={staggerContainer}
                  onSubmit={handleSubmit}
                  className="relative z-10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <motion.div variants={fadeInUp}>
                      <InputField label="Name *" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Your name" />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <InputField label="Email *" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="your@email.com" />
                    </motion.div>
                  </div>
                  
                  <motion.div variants={fadeInUp}>
                    <SelectField 
                      label="Project Type" 
                      name="projectType" 
                      value={formData.projectType} 
                      onChange={handleChange}
                      options={['Brand Identity', 'Logo Design', 'Packaging Design', 'Social Media Design', 'Print Design', 'Web/UI Design', 'Other']}
                    />
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    <motion.div variants={fadeInUp}>
                      <SelectField 
                        label="Budget Range" 
                        name="budget" 
                        value={formData.budget} 
                        onChange={handleChange}
                        options={['Under $500', '$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'Not sure yet']}
                      />
                    </motion.div>
                    <motion.div variants={fadeInUp}>
                      <SelectField 
                        label="Timeline" 
                        name="timeline" 
                        value={formData.timeline} 
                        onChange={handleChange}
                        options={['ASAP', '1-2 weeks', '1 month', '2-3 months', 'Flexible']}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={fadeInUp}>
                    <InputField 
                      label="Message *" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      error={errors.message} 
                      textarea 
                      placeholder="Tell me about your project, your vision..."
                    />
                  </motion.div>

                  {serverError && (
                    <motion.div variants={fadeInUp} className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-body">
                      {serverError}
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp} className="mt-10">
                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className={`w-full px-10 py-5 bg-primary text-white font-heading text-2xl rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(170,59,255,0.4)] hover:shadow-[0_15px_40px_rgba(170,59,255,0.6)] ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                    >
                      {status === 'loading' ? (
                        <>
                          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                          </svg>
                        </>
                      )}
                    </button>
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
