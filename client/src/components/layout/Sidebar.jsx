import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ProfileContext } from '../../context/ProfileContext';

const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const { logout } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();

  const unreadCount = 0; 

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊', exact: true },
    { name: 'Projects', path: '/admin/projects', icon: '📁', exact: true },
    { name: 'Add Project', path: '/admin/projects/add', icon: '➕' },
    { name: 'Profile', path: '/admin/profile', icon: '👤' },
    { name: 'Theme', path: '/admin/theme', icon: '🎨' },
    { name: 'Messages', path: '/admin/messages', icon: '📬', badge: unreadCount > 0 ? unreadCount : null },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 left-0 h-screen w-64 bg-surface border-r border-text/20 flex flex-col transition-transform duration-300 z-50 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="h-20 flex items-center px-6 border-b border-text/20">
          <Link to="/admin" className="text-xl font-heading font-bold text-text tracking-widest uppercase">
            {profile?.name?.split(' ')[0] || 'Admin'} CMS
          </Link>
          <button 
            className="ml-auto lg:hidden text-text/70 hover:text-text"
            onClick={() => setIsMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary/20 text-primary border border-primary/20' 
                    : 'text-text/70 hover:bg-text/10 hover:text-text border border-transparent'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-accent text-xs uppercase tracking-widest">{item.name}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-text text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-text/20 space-y-2">
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-text/70 hover:bg-text/10 hover:text-text transition-colors border border-transparent"
          >
            <span className="text-lg">🔗</span>
            <span className="font-accent text-xs uppercase tracking-widest">View Site</span>
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-red-400 hover:bg-red-500/10 transition-colors border border-transparent"
          >
            <span className="text-lg">🚪</span>
            <span className="font-accent text-xs uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
