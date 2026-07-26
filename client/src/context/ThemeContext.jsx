import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    } else if (hex.length === 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
    return `${+r} ${+g} ${+b}`;
  };

  const applyThemeVariables = (themeData) => {
    const root = document.documentElement;
    const colors = {
      primary: themeData.primaryColor || '#6C63FF',
      secondary: themeData.secondaryColor || '#FF6584',
      accent: themeData.accentColor || '#00D4AA',
      bg: themeData.backgroundColor || '#0a0a0a',
      surface: themeData.surfaceColor || '#1a1a2e',
      text: themeData.textColor || '#ffffff',
      muted: themeData.mutedTextColor || '#888888',
    };

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
      root.style.setProperty(`--color-${key}-rgb`, hexToRgb(value));
    });
    
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
