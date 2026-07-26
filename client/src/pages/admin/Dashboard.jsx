import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { staggerContainer, fadeInUp } from '../../utils/animations';

const StatCard = ({ title, value, icon, highlighted }) => (
  <motion.div 
    variants={fadeInUp}
    className={`p-6 rounded-custom border ${highlighted ? 'border-primary/50 bg-primary/10' : 'border-text/20 bg-surface/50'} flex flex-col`}
  >
    <div className="flex justify-between items-start mb-4">
      <span className="text-4xl">{icon}</span>
      <span className="text-4xl font-heading">{value}</span>
    </div>
    <div className={`text-xs font-accent uppercase tracking-widest ${highlighted ? 'text-primary' : 'text-text/70'}`}>
      {title}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalMessages: 0,
    unreadMessages: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projectsRes, messagesRes] = await Promise.all([
          api.get('/projects?limit=5&sort=-createdAt'),
          api.get('/messages?limit=5')
        ]);
        
        const projects = projectsRes.data.data || [];
        const messages = messagesRes.data.data || [];
        
        setRecentProjects(projects);
        setRecentMessages(messages);
        
        setStats({
          totalProjects: projectsRes.data.pagination?.total || projects.length,
          featuredProjects: projects.filter(p => p.featured).length || 0,
          totalMessages: messagesRes.data.pagination?.total || messages.length,
          unreadMessages: messages.filter(m => !m.read).length
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-primary font-accent animate-pulse uppercase tracking-widest">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-8">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={stats.totalProjects} icon="📁" />
        <StatCard title="Featured" value={stats.featuredProjects} icon="⭐" />
        <StatCard title="Total Messages" value={stats.totalMessages} icon="📬" />
        <StatCard 
          title="Unread Messages" 
          value={stats.unreadMessages} 
          icon="🔔" 
          highlighted={stats.unreadMessages > 0} 
        />
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeInUp} className="bg-surface/50 border border-text/20 rounded-custom p-6">
        <h3 className="text-lg font-heading mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/admin/projects/add" className="flex flex-col items-center justify-center p-6 bg-text/10 hover:bg-primary/20 hover:text-primary hover:border-primary/30 border border-text/20 rounded transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</span>
            <span className="font-accent text-xs uppercase tracking-widest">Add New Project</span>
          </Link>
          <Link to="/admin/profile" className="flex flex-col items-center justify-center p-6 bg-text/10 hover:bg-primary/20 hover:text-primary hover:border-primary/30 border border-text/20 rounded transition-colors group">
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">👤</span>
            <span className="font-accent text-xs uppercase tracking-widest">Edit Profile</span>
          </Link>
        </div>
      </motion.div>

      {/* Two Column Layout for Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Projects */}
        <motion.div variants={fadeInUp} className="bg-surface/50 border border-text/20 rounded-custom overflow-hidden flex flex-col">
          <div className="p-6 border-b border-text/20 flex justify-between items-center bg-surface">
            <h3 className="text-lg font-heading">Recent Projects</h3>
            <Link to="/admin/projects" className="text-xs font-accent uppercase tracking-widest text-primary hover:text-text transition-colors">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-text/20">
                  <th className="py-3 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Project</th>
                  <th className="py-3 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Category</th>
                  <th className="py-3 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.length === 0 ? (
                  <tr><td colSpan="3" className="py-8 text-center text-text/70 font-body text-sm">No projects found.</td></tr>
                ) : (
                  recentProjects.map((p) => (
                    <tr key={p._id} className="border-b border-text/20 hover:bg-text/10 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded overflow-hidden bg-black flex-shrink-0">
                            <img src={p.thumbnail?.url || 'https://placehold.co/100'} alt={p.title} className="w-full h-full object-cover opacity-80" />
                          </div>
                          <div>
                            <div className="font-body text-sm font-medium">{p.title}</div>
                            <div className="text-xs text-text/70 font-accent mt-0.5">{p.views || 0} views</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-accent tracking-wider text-text/70 bg-text/10 px-2 py-1 rounded">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`text-[10px] uppercase font-accent font-bold px-2 py-1 rounded-full ${p.featured ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                          {p.featured ? 'Featured' : 'Live'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div variants={fadeInUp} className="bg-surface/50 border border-text/20 rounded-custom overflow-hidden flex flex-col">
          <div className="p-6 border-b border-text/20 flex justify-between items-center bg-surface">
            <h3 className="text-lg font-heading">Recent Messages</h3>
            <Link to="/admin/messages" className="text-xs font-accent uppercase tracking-widest text-primary hover:text-text transition-colors">
              View All →
            </Link>
          </div>
          <div className="p-4 space-y-2">
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-text/70 font-body text-sm">No messages yet.</div>
            ) : (
              recentMessages.map((m) => (
                <div key={m._id} className={`p-4 rounded border transition-colors flex gap-4 ${m.read ? 'border-text/20 bg-transparent opacity-70' : 'border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.1)]'}`}>
                  <div className="w-10 h-10 rounded-full bg-text/10 flex items-center justify-center font-heading text-lg flex-shrink-0">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div className={`text-sm truncate ${m.read ? 'font-body' : 'font-heading font-bold'}`}>{m.name}</div>
                      <div className="text-[10px] font-accent text-text/70 whitespace-nowrap ml-2">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-xs text-text/70 truncate font-accent">{m.projectType || 'General Inquiry'}</div>
                    <div className="text-sm font-body mt-2 line-clamp-1 text-text/70">{m.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Dashboard;
