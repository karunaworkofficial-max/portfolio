import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProfileContext } from '../../context/ProfileContext';

const Footer = () => {
  const { profile } = useContext(ProfileContext);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface/30 border-t border-text/20 pt-16 pb-8">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div>
            <h3 className="text-2xl font-heading uppercase tracking-wider mb-4">
              {profile?.name || 'DESIGNER'}
            </h3>
            <p className="text-text/70 font-body text-sm mb-6 max-w-xs">
              {profile?.shortBio || 'Crafting visual identities and digital experiences.'}
            </p>
            <p className="text-text/70 font-accent text-xs">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest text-text/70 mb-6">Navigation</h4>
            <ul className="space-y-3 font-body">
              <li><Link to="/" className="text-text/70 hover:text-primary transition-colors" data-cursor="link">Home</Link></li>
              <li><Link to="/projects" className="text-text/70 hover:text-primary transition-colors" data-cursor="link">Work</Link></li>
              <li><Link to="/about" className="text-text/70 hover:text-primary transition-colors" data-cursor="link">About</Link></li>
              <li><Link to="/contact" className="text-text/70 hover:text-primary transition-colors" data-cursor="link">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-accent text-xs uppercase tracking-widest text-text/70 mb-6">Get in Touch</h4>
            <ul className="space-y-3 font-body">
              {profile?.email && (
                <li>
                  <a href={`mailto:${profile.email}`} className="text-text/70 hover:text-primary transition-colors break-all" data-cursor="link">
                    {profile.email}
                  </a>
                </li>
              )}
              {profile?.location && (profile.location.city || profile.location.country) && (
                <li className="text-text/70">
                  {[profile.location.city, profile.location.country].filter(Boolean).join(', ')}
                </li>
              )}
              <li className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-text/70 font-accent">Available for work</span>
              </li>
            </ul>
          </div>
          
          {profile?.socialLinks && Object.values(profile.socialLinks).some(url => url) && (
            <div>
              <h4 className="font-accent text-xs uppercase tracking-widest text-text/70 mb-6">Follow Me</h4>
              <ul className="space-y-3 font-body">
                {Object.entries(profile.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <li key={platform}>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-text/70 hover:text-primary transition-colors capitalize"
                        data-cursor="link"
                      >
                        {platform}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t border-text/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text/70 font-accent text-xs tracking-widest">
            Designed & Built by {profile?.name || 'Designer'}
          </p>
          <button 
            onClick={scrollToTop}
            className="text-text/70 hover:text-text font-accent text-xs tracking-widest uppercase flex items-center gap-2 transition-colors"
            data-cursor="pointer"
          >
            Back to Top <span className="text-lg leading-none">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
