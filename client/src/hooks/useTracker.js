import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

const useTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      // Don't track admin pages to keep stats clean
      if (location.pathname.startsWith('/admin')) {
        return;
      }
      
      // Projects have their own detailed tracking in ProjectDetail.jsx
      if (location.pathname.startsWith('/project/')) {
        return;
      }

      let pageName = 'Home';
      if (location.pathname !== '/') {
        // Format path to readable name, e.g., /about -> About
        pageName = location.pathname
          .substring(1)
          .split('/')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' - ');
      }

      try {
        await api.post('/analytics/track', {
          type: 'PAGE_VIEW',
          target: `Page: ${pageName}`
        });
      } catch (err) {
        console.error('Failed to track page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);
};

export default useTracker;
