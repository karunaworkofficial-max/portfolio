import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { ProfileProvider } from './context/ProfileContext';
import { SiteSettingsProvider } from './context/SiteSettingsContext';

import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import CustomCursor from './components/ui/CustomCursor';
import PremiumBackground from './components/ui/PremiumBackground';

const GlobalCursorWrapper = () => {
  const { theme } = React.useContext(ThemeContext);
  if (!theme?.customCursor) return null;
  return <CustomCursor style={theme.cursorStyle} />;
};

// Public Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import AddProject from './pages/admin/AddProject';
import EditProject from './pages/admin/EditProject';
import ProfileSettings from './pages/admin/ProfileSettings';
import Messages from './pages/admin/Messages';
import AdminSiteSettings from './pages/admin/AdminSiteSettings';

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    let lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });


    let rafId;
    function raf(time) {
      if (lenis) lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    
    if (lenis) {
      rafId = requestAnimationFrame(raf);
    }

    return () => {
      if (lenis) lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]); // The array size is now safely exactly 1, fixing the React error

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/edit/:id" element={<EditProject />} />
          <Route path="profile" element={<ProfileSettings />} />
          <Route path="messages" element={<Messages />} />
          <Route path="site-settings" element={<AdminSiteSettings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ProfileProvider>
            <SiteSettingsProvider>
              {/* ToastProvider will go here */}
              <PremiumBackground />
              <GlobalCursorWrapper />
              <AnimatedRoutes />
            </SiteSettingsProvider>
          </ProfileProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
