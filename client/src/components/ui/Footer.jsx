import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../context/ProfileContext';

const Footer = () => {
  const { profile } = useContext(ProfileContext);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-bg pt-24 pb-8 overflow-hidden border-t border-text/10">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Big CTA Section in Footer */}
        <div className="mb-24 flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-8xl font-heading mb-6 tracking-tight">
            Have an idea?
          </h2>
          <Link 
            to="/contact"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-bg font-heading text-xl rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">Let's build it together</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </Link>
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 border-t border-text/10 pt-16">
          
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-heading tracking-tight mb-4 text-text">
              {profile?.name || 'DESIGNER'}
            </h3>
            <p className="text-text/60 font-body text-base mb-6 max-w-xs leading-relaxed">
              {profile?.shortBio || 'Crafting visual identities and digital experiences.'}
            </p>
          </div>
          
          <div>
            <h4 className="font-heading text-lg mb-6 text-text/90 tracking-wide">Navigation</h4>
            <ul className="space-y-4 font-body">
              <li><Link to="/" className="text-text/60 hover:text-primary transition-colors text-lg" data-cursor="link">Home</Link></li>
              <li><Link to="/projects" className="text-text/60 hover:text-primary transition-colors text-lg" data-cursor="link">Work</Link></li>
              <li><Link to="/about" className="text-text/60 hover:text-primary transition-colors text-lg" data-cursor="link">About</Link></li>
              <li><Link to="/contact" className="text-text/60 hover:text-primary transition-colors text-lg" data-cursor="link">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg mb-6 text-text/90 tracking-wide">Get in Touch</h4>
            <ul className="space-y-4 font-body">
              {profile?.email && (
                <li>
                  <a href={`mailto:${profile.email}`} className="text-text/60 hover:text-primary transition-colors text-lg break-all" data-cursor="link">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile?.location && (profile.location.city || profile.location.country) && (
                <li className="text-text/60 text-lg">
                  {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                </li>
              )}
              <li className="flex items-center gap-3 mt-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-base text-text/80 font-body">Available for work</span>
              </li>
            </ul>
          </div>
          
          {profile?.socialLinks && Object.values(profile.socialLinks).some(url => url) && (
            <div>
              <h4 className="font-heading text-lg mb-6 text-text/90 tracking-wide">Socials</h4>
              <ul className="flex flex-wrap gap-4 font-body">
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  
                  // Map platform name to a specific icon with brand colors
                  const getIcon = (platformName) => {
                    const name = platformName.toLowerCase();
                    if (name === 'instagram') return (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                    if (name === 'linkedin') return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#0077b5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
                    if (name === 'twitter') return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>;
                    if (name === 'github') return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>;
                    if (name === 'dribbble') return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#ea4c89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"></path></svg>;
                    if (name === 'behance') return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1769ff"><path d="M22 7h-7v2h7V7zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.374 4.8h-8.4c.022 1.493.7 2.89 2.583 2.89 1.614 0 2.152-.717 2.562-1.475h3.08zM19.16 11.5c0-1.153-.755-1.727-1.54-1.727-.785 0-1.516.574-1.516 1.727h3.056zM8.93 15.35c.67.625 1.83 1 2.87 1 2.45 0 3.72-1.125 3.72-3.1 0-1.925-1.22-2.75-2.82-3.025v-.125c1.22-.275 2.32-1.175 2.32-2.75 0-2.1-1.32-3.15-3.5-3.15H2v15h9.45c2.4 0 3.8-1.075 3.8-3.325 0-1.925-1.27-2.9-2.9-3.225v-.125c1.17.2 2.3.925 2.3 2.55 0 1.575-1 2.525-2.67 2.525H5v-2.3zm-.13-9.1c1.375 0 2.225.625 2.225 1.775 0 1.25-.85 1.875-2.225 1.875H5v-3.65h3.8z"/></svg>;
                    return <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
                  };

                  return (
                    <li key={platform}>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="w-12 h-12 rounded-full border border-text/10 bg-surface/30 flex justify-center items-center hover:bg-surface hover:border-text/30 transition-all group shadow-sm hover:shadow-md hover:-translate-y-1"
                        data-cursor="link"
                        aria-label={platform}
                        title={platform}
                      >
                        {getIcon(platform)}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-text/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-text/50 font-body text-sm">
            <p>&copy; {new Date().getFullYear()} {profile?.name || 'Designer'}. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            <p>Designed & Built with passion.</p>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center justify-center w-12 h-12 rounded-full border border-text/20 hover:border-primary hover:bg-primary/10 text-text/70 hover:text-primary transition-all"
            data-cursor="pointer"
            aria-label="Scroll to top"
          >
            <span className="text-xl group-hover:-translate-y-1 transition-transform">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
