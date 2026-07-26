import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfileContext } from '../../context/ProfileContext';

const Navbar = () => {
  const { profile } = useContext(ProfileContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      if (currentScrollY > 300 && currentScrollY > lastScrollY && !mobileMenuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { 
      name: 'Home', 
      path: '/',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    },
    { 
      name: 'Projects', 
      path: '/projects',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
    },
    { 
      name: 'About', 
      path: '/about',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    },
    { 
      name: 'Contact', 
      path: '/contact',
      icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-text/20 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wider relative group" data-cursor="link">
            {profile?.name?.split(' ')[0] || 'DESIGNER'}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  data-cursor="link"
                  className={`font-accent text-sm tracking-widest uppercase transition-colors relative group overflow-hidden flex items-center gap-2 ${
                    location.pathname === link.path ? 'text-primary' : 'text-text/70 hover:text-text'
                  }`}
                >
                  <span className="opacity-50 group-hover:opacity-100 transition-opacity">{link.icon}</span>
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-transform duration-300 origin-left ${
                    location.pathname === link.path ? 'scale-x-100 w-full' : 'scale-x-0 w-full group-hover:scale-x-100'
                  }`} />
                </Link>
              ))}
            </div>
            
            <Link 
              to="/contact" 
              data-cursor="pointer"
              className="px-6 py-2 bg-text text-bg font-accent uppercase tracking-widest text-sm rounded hover:bg-primary hover:text-text transition-colors"
            >
              Let's Talk
            </Link>
          </div>

          <button 
            className="md:hidden relative z-50 w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <motion.span 
              animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text block transition-transform"
            />
            <motion.span 
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-text block transition-opacity"
            />
            <motion.span 
              animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-text block transition-transform"
            />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl flex flex-col justify-center px-8"
          >
            <div className="flex flex-col gap-8 items-start">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.1) }}
                >
                  <Link 
                    to={link.path}
                    className={`text-4xl md:text-5xl font-heading uppercase flex items-center gap-4 ${
                      location.pathname === link.path ? 'text-primary' : 'text-text hover:text-primary transition-colors'
                    }`}
                  >
                    <span className="w-8 h-8 opacity-50 flex items-center justify-center">{link.icon}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
              >
                <Link 
                  to="/contact" 
                  className="px-8 py-3 bg-primary text-text font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors"
                >
                  Let's Talk
                </Link>
              </motion.div>
              
              {profile?.socialLinks && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-12 left-8 flex gap-4"
                >
                  {Object.entries(profile.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    
                    const getIcon = (platformName) => {
                      const name = platformName.toLowerCase();
                      if (name === 'instagram') return (
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <linearGradient id="ig-grad-nav" x1="2" y1="22" x2="22" y2="2">
                              <stop offset="0%" stopColor="#feda75" />
                              <stop offset="25%" stopColor="#fa7e1e" />
                              <stop offset="50%" stopColor="#d62976" />
                              <stop offset="75%" stopColor="#962fbf" />
                              <stop offset="100%" stopColor="#4f5bd5" />
                            </linearGradient>
                          </defs>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#ig-grad-nav)"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#ig-grad-nav)"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad-nav)"></line>
                        </svg>
                      );
                      if (name === 'linkedin') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
                      if (name === 'twitter') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
                      if (name === 'github') return <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
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
                        className="w-10 h-10 rounded-full bg-surface/50 border border-text/10 flex justify-center items-center hover:bg-surface hover:border-text/30 transition-all shadow-sm"
                        aria-label={platform}
                        title={platform}
                      >
                        {getIcon(platform)}
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
