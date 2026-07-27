import React, { useState } from 'react';
import Home from '../Home';
import About from '../About';
import Projects from '../Projects';
import Contact from '../Contact';

const AdminSiteSettings = () => {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Settings Header */}
      <div className="bg-surface border-b border-white/5 p-4 flex justify-between items-center z-50">
        <div>
          <h2 className="text-xl font-heading text-white">Visual Site Editor</h2>
          <p className="text-white/50 text-xs">Click on any text in the preview below to edit it.</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={activePage} 
            onChange={(e) => setActivePage(e.target.value)}
            className="bg-black/50 border border-white/10 text-white text-sm rounded px-3 py-1.5 focus:outline-none focus:border-primary"
          >
            <option value="home">Home Page</option>
            <option value="about">About Page</option>
            <option value="projects">Projects Page</option>
            <option value="contact">Contact Page</option>
          </select>
        </div>
      </div>

      {/* Live Preview Area */}
      <div className="flex-1 overflow-y-auto relative bg-bg">
        <div className="absolute inset-0 pointer-events-none border-[4px] border-primary/20 z-40 rounded-lg m-2"></div>
        <div className="scale-[0.95] origin-top transform-gpu">
          {activePage === 'home' && <Home isAdmin={true} />}
          {activePage === 'about' && <About isAdmin={true} />}
          {activePage === 'projects' && <Projects isAdmin={true} />}
          {activePage === 'contact' && <Contact isAdmin={true} />}
        </div>
      </div>
    </div>
  );
};

export default AdminSiteSettings;
