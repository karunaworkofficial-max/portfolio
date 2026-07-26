import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import CustomCursor from '../ui/CustomCursor';
import ScrollProgress from '../ui/ScrollProgress';
import GlobalLoader from '../ui/GlobalLoader';
import { ThemeContext } from '../../context/ThemeContext';
import { ProfileContext } from '../../context/ProfileContext';

const PublicLayout = () => {
  const { theme } = useContext(ThemeContext);
  const { profile } = useContext(ProfileContext);

  return (
    <>
      <GlobalLoader name={profile?.name} />
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
