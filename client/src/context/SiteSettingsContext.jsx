import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      setSettings(data.data);
    } catch (error) {
      console.error('Error fetching site settings', error);
      // Setup a default fallback structure in case backend fails
      setSettings({
        home: {
          hero: { subtitle: 'Welcome to my universe', headingLine1: "Hello, I'm", description: 'Crafting digital experiences that merge logic with creativity.', availability: 'Available for work' },
          links: { aboutTitle: 'More About Me', aboutSubtitle: 'Discover my journey', contactTitle: "Let's Talk", contactSubtitle: 'Start a conversation' },
          marquee: { items: ['CREATIVE DESIGNER', '✦', 'UI / UX', '✦', 'PROBLEM SOLVER', '✦'] }
        },
        about: { heading: 'About Me' },
        contact: { heading: 'Get In Touch' }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings) => {
    try {
      const { data } = await api.put('/settings', newSettings);
      setSettings(data.data);
      return true;
    } catch (error) {
      console.error('Error updating settings', error);
      return false;
    }
  };

  const updateSettingByPath = async (path, value) => {
    const keys = path.split('.');
    const newSettings = JSON.parse(JSON.stringify(settings));
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    // Optimistic UI update
    setSettings(newSettings);
    
    // Server update
    try {
      await api.put('/settings', newSettings);
      return true;
    } catch (error) {
      console.error('Error updating settings by path', error);
      fetchSettings(); // Revert on failure
      return false;
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, updateSettingByPath, loading, setSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
