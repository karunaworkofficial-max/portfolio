import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      const { data } = await api.get('/content');
      if (data.success) {
        setSiteContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching site content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const updateContent = async (newContent) => {
    try {
      const { data } = await api.put('/content', newContent);
      if (data.success) {
        setSiteContent(data.data);
        return { success: true };
      }
    } catch (error) {
      console.error('Error updating site content:', error);
      return { success: false, message: error.response?.data?.message || 'Error updating content' };
    }
  };

  return (
    <ContentContext.Provider value={{ siteContent, updateContent, loading, fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};
