import React, { useContext, useState, useEffect } from 'react';
import { ContentContext } from '../../context/ContentContext';

const ManageContent = () => {
  const { siteContent, updateContent, loading } = useContext(ContentContext);
  const [formData, setFormData] = useState({
    home: { heroTitle: '', marqueeText: '' },
    about: { journeyHeading: '', journeyText: '', titleRole: '' },
    projects: { heroTitle: '', heroSubtitle: '' },
    contact: { heroTitle: '', heroSubtitle: '' }
  });
  const [activeTab, setActiveTab] = useState('home');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (siteContent) {
      setFormData({
        home: siteContent.home || { heroTitle: '', marqueeText: '' },
        about: siteContent.about || { journeyHeading: '', journeyText: '', titleRole: '' },
        projects: siteContent.projects || { heroTitle: '', heroSubtitle: '' },
        contact: siteContent.contact || { heroTitle: '', heroSubtitle: '' }
      });
    }
  }, [siteContent]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    
    // Only send the active section to save
    const payload = { [activeTab]: formData[activeTab] };
    
    const res = await updateContent(payload);
    if (res.success) {
      setMessage({ text: 'Content saved successfully!', type: 'success' });
    } else {
      setMessage({ text: res.message || 'Error saving content', type: 'error' });
    }
    setSaving(false);
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  if (loading) {
    return <div className="text-white">Loading content...</div>;
  }

  const tabs = ['home', 'about', 'projects', 'contact'];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading text-white">Site Content Manager</h1>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full font-accent text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white' : 'bg-surface/50 text-white/50 hover:bg-white/5'}`}
          >
            {tab} Page
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-surface/30 border border-white/5 rounded-2xl p-6 md:p-8">
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-accent ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Home Hero Title</label>
              <input 
                type="text" 
                value={formData.home.heroTitle} 
                onChange={(e) => handleChange('home', 'heroTitle', e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Infinite Marquee Text (Separate with ✦)</label>
              <textarea 
                value={formData.home.marqueeText} 
                onChange={(e) => handleChange('home', 'marqueeText', e.target.value)}
                rows={3}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. CREATIVE DESIGNER ✦ UI / UX ✦ PROBLEM SOLVER"
              />
              <p className="text-white/40 text-xs mt-2 font-accent">This text will scroll infinitely across the home page.</p>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Hero Role Title</label>
              <input 
                type="text" 
                value={formData.about.titleRole} 
                onChange={(e) => handleChange('about', 'titleRole', e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Interactive Designer"
              />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Journey Section Heading</label>
              <input 
                type="text" 
                value={formData.about.journeyHeading} 
                onChange={(e) => handleChange('about', 'journeyHeading', e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. The Journey"
              />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Journey Section Text</label>
              <textarea 
                value={formData.about.journeyText} 
                onChange={(e) => handleChange('about', 'journeyText', e.target.value)}
                rows={5}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. Hi, I am Karuna..."
              />
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Projects Hero Title</label>
              <input 
                type="text" 
                value={formData.projects.heroTitle} 
                onChange={(e) => handleChange('projects', 'heroTitle', e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Projects Hero Subtitle</label>
              <textarea 
                value={formData.projects.heroSubtitle} 
                onChange={(e) => handleChange('projects', 'heroSubtitle', e.target.value)}
                rows={3}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Contact Hero Title</label>
              <input 
                type="text" 
                value={formData.contact.heroTitle} 
                onChange={(e) => handleChange('contact', 'heroTitle', e.target.value)}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest text-white/60 mb-2">Contact Hero Subtitle</label>
              <textarea 
                value={formData.contact.heroSubtitle} 
                onChange={(e) => handleChange('contact', 'heroSubtitle', e.target.value)}
                rows={3}
                className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/10 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-primary hover:bg-white hover:text-primary transition-colors rounded-full text-white font-accent uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageContent;
