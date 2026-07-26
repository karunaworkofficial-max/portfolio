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
              <ul className="space-y-4 font-body">
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <li key={platform}>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-text/60 hover:text-primary transition-colors text-lg capitalize flex items-center gap-2 group"
                        data-cursor="link"
                      >
                        {platform}
                        <span className="text-text/40 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">↗</span>
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
