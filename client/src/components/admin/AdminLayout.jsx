import React, { useContext, useState } from 'react';
import { Outlet, NavLink, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderKanban, 
  UserCircle, 
  Palette, 
  MessageSquare, 
  LogOut, 
  Menu,
  X,
  Globe
} from 'lucide-react';

const AdminLayout = () => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-text/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Profile Settings', path: '/admin/profile', icon: UserCircle },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Site Settings', path: '/admin/site-settings', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-text flex flex-col md:flex-row font-body">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-text/20 sticky top-0 z-50">
        <div className="font-heading text-xl tracking-wider">ADMIN</div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-text/70 hover:text-text"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col sticky top-0 left-0 w-64 h-[100dvh] bg-[#0a0a0a] border-r border-text/20 z-40">
        <div className="p-6 border-b border-text/20">
          <div className="font-heading text-2xl tracking-widest">WORKSPACE</div>
          <div className="text-xs font-accent text-text/70 uppercase tracking-[0.2em] mt-1">Admin Portal</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-text/10 text-text shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                    : 'text-text/70 hover:bg-text/10 hover:text-text'}
                `}
              >
                <Icon size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="font-medium tracking-wide text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-text/20 space-y-2">
          <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text/70 hover:bg-text/10 hover:text-text transition-all duration-300 group">
            <Globe size={20} className="opacity-70 group-hover:opacity-100" />
            <span className="font-medium tracking-wide text-sm">View Live Site</span>
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group">
            <LogOut size={20} className="opacity-70 group-hover:opacity-100" />
            <span className="font-medium tracking-wide text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar (Mobile Slide-in) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="md:hidden fixed top-0 left-0 z-50 w-64 h-[100dvh] bg-[#0a0a0a] border-r border-text/20 flex flex-col"
          >
            <div className="p-6 border-b border-text/20 flex justify-between items-center">
              <div>
                <div className="font-heading text-xl tracking-widest">WORKSPACE</div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-text/70 hover:text-text">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                      ${isActive 
                        ? 'bg-text/10 text-text shadow-[0_0_15px_rgba(255,255,255,0.05)]' 
                        : 'text-text/70 hover:bg-text/10 hover:text-text'}
                    `}
                  >
                    <Icon size={20} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="font-medium tracking-wide text-sm">{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-text/20 space-y-2">
              <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500/70 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group">
                <LogOut size={20} className="opacity-70 group-hover:opacity-100" />
                <span className="font-medium tracking-wide text-sm">Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[100vw] overflow-x-hidden relative">
        {/* Subtle background glow for admin */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-text/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="min-h-full p-4 md:p-8 lg:p-12 z-10 relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
