import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const applyThemeVariables = (themeData) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', themeData.primaryColor || '#6C63FF');
    root.style.setProperty('--color-secondary', themeData.secondaryColor || '#FF6584');
    root.style.setProperty('--color-accent', themeData.accentColor || '#00D4AA');
    root.style.setProperty('--color-bg', themeData.backgroundColor || '#0a0a0a');
    root.style.setProperty('--color-surface', themeData.surfaceColor || '#1a1a2e');
    root.style.setProperty('--color-text', themeData.textColor || '#ffffff');
    root.style.setProperty('--color-muted', themeData.mutedTextColor || '#888888');
    
    // Hardcode premium typography
    root.style.setProperty('--font-heading', '"Outfit", sans-serif');
    root.style.setProperty('--font-body', '"Inter", sans-serif');
    root.style.setProperty('--font-accent', '"Space Mono", monospace');
    
    let radius = '0px';
    if (themeData.borderRadius === 'small') radius = '4px';
    if (themeData.borderRadius === 'medium') radius = '8px';
    if (themeData.borderRadius === 'large') radius = '16px';
    root.style.setProperty('--border-radius', radius);

    // Grain
    if (themeData.grainEffect) {
      document.body.classList.add('grain-enabled');
    } else {
      document.body.classList.remove('grain-enabled');
    }

    // Cursor hiding logic handled in CustomCursor, but we can set body class
    if (themeData.customCursor) {
      document.body.classList.add('custom-cursor-enabled');
    } else {
      document.body.classList.remove('custom-cursor-enabled');
    }
  };

  const fetchTheme = async () => {
    try {
      const { data } = await api.get('/theme');
      setTheme(data.data);
      applyThemeVariables(data.data);
    } catch (error) {
      console.error('Failed to fetch theme', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, scene3D: theme?.scene3D, refreshTheme: fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
