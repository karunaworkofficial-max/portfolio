import React, { useState, useContext, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../../context/AuthContext';

const AdminLayout = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  

  if (loading) {
    return <div className="min-h-screen bg-bg flex items-center justify-center text-text">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/projects') return 'Manage Projects';
    if (path === '/admin/projects/add') return 'Add Project';
    if (path.startsWith('/admin/projects/edit')) return 'Edit Project';
    if (path === '/admin/profile') return 'Profile Settings';
    if (path === '/admin/theme') return 'Theme Settings';
    if (path === '/admin/messages') return 'Messages';
    return 'Admin';
  };

  return (
    <div className="min-h-screen bg-bg text-text flex">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        <header className="h-20 bg-surface border-b border-text/20 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-text/70 hover:text-text"
              onClick={() => setIsMobileOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h1 className="text-xl font-heading">{getPageTitle()}</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-text/10 hover:bg-text/10 rounded font-accent uppercase tracking-widest text-xs transition-colors"
            >
              View Live Site ↗
            </a>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
