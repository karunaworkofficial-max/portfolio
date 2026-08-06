import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const AdminAnalytics = () => {
  const [data, setData] = useState({ stats: null, recentViews: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchAnalytics = async (isInitial = false) => {
      try {
        const res = await api.get('/analytics');
        setData(res.data.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        if (isInitial) setLoading(false);
      }
    };
    
    // Initial fetch
    fetchAnalytics(true);

    // Live sync every 5 seconds
    intervalId = setInterval(() => {
      fetchAnalytics(false);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-heading text-white mb-2">Analytics</h1>
        <p className="text-white/50 font-body">Track real-time location based views across your website.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
          </div>
          <h3 className="text-white/50 font-accent text-xs uppercase tracking-widest mb-2">Total Page Views</h3>
          <p className="text-4xl font-heading text-white">{data.stats?.totalPageViews || 0}</p>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          </div>
          <h3 className="text-white/50 font-accent text-xs uppercase tracking-widest mb-2">Total Project Views</h3>
          <p className="text-4xl font-heading text-white">{data.stats?.totalProjectViews || 0}</p>
        </div>

        <div className="bg-[#111] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
          </div>
          <h3 className="text-white/50 font-accent text-xs uppercase tracking-widest mb-2">Total Image Views</h3>
          <p className="text-4xl font-heading text-white">{data.stats?.totalImageViews || 0}</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-heading text-white">Recent Visitors Tracking</h2>
          <span className="text-xs font-accent text-white/40 tracking-widest uppercase">Last 100 Logs</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-4 text-xs font-accent tracking-widest uppercase text-white/50">Location</th>
                <th className="p-4 text-xs font-accent tracking-widest uppercase text-white/50">IP Address</th>
                <th className="p-4 text-xs font-accent tracking-widest uppercase text-white/50">Type</th>
                <th className="p-4 text-xs font-accent tracking-widest uppercase text-white/50">Target</th>
                <th className="p-4 text-xs font-accent tracking-widest uppercase text-white/50">Time</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm">
              {data.recentViews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/50">
                    No tracking data available yet.
                  </td>
                </tr>
              ) : (
                data.recentViews.map((view, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    key={view._id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        <span className="text-white">{view.city}, {view.country}</span>
                      </div>
                    </td>
                    <td className="p-4 text-white/50 font-mono text-xs">{view.ip}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-widest rounded font-accent ${
                        view.type === 'PAGE_VIEW' ? 'bg-blue-500/20 text-blue-400' :
                        view.type === 'PROJECT_VIEW' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {view.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-white/70">{view.target}</td>
                    <td className="p-4 text-white/50">
                      {new Date(view.timestamp).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
