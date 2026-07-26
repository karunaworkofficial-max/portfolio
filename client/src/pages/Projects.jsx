import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import ProjectCard from '../components/ui/ProjectCard';

const Projects = () => {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('order'); 
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/projects/categories');
      setCategories(data.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const fetchProjects = async (pageNum = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      const categoryParam = filter !== 'all' ? `&category=${filter}` : '';
      const sortParam = `&sort=${sort}`;
      
      const { data } = await api.get(`/projects?page=${pageNum}&limit=12${categoryParam}${sortParam}`);
      
      if (append) {
        setProjects(prev => [...prev, ...data.data]);
      } else {
        setProjects(data.data);
      }
      
      setTotalCount(data.pagination.total);
      setHasMore(data.pagination.page < data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProjects(1, false);
  }, [filter, sort]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProjects(page + 1, true);
    }
  };

  return (
    <motion.div 
      className="min-h-screen pt-32 pb-20 relative bg-bg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0 }}
    >
      {/* Background Glow */}
      <div className="fixed top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 blur-[150px] pointer-events-none mix-blend-screen rounded-full" />

      {/* Hero Section */}
      <div className="max-w-[1400px] mx-auto px-6 mb-16 relative z-10 text-center">
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-heading mb-6 tracking-tight text-white"
        >
          Work Archive
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 font-body max-w-2xl mx-auto"
        >
          A curated exhibition of {totalCount} projects exploring visual identities, digital experiences, and creative solutions.
        </motion.p>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[80px] z-40 bg-bg/80 backdrop-blur-xl border-y border-white/5 py-4 mb-16">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Categories Pill Buttons */}
          <div className="flex items-center justify-center flex-wrap gap-3 w-full md:w-auto">
            <button 
              onClick={() => setFilter('all')}
              className={`px-6 py-2.5 rounded-full font-accent text-xs uppercase tracking-widest transition-all duration-300 ${filter === 'all' ? 'bg-primary text-white shadow-[0_0_20px_rgba(170,59,255,0.4)]' : 'bg-surface/50 text-white/70 hover:bg-white/10 border border-white/5'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setFilter(cat._id)}
                className={`px-6 py-2.5 rounded-full font-accent text-xs uppercase tracking-widest transition-all duration-300 ${filter === cat._id ? 'bg-primary text-white shadow-[0_0_20px_rgba(170,59,255,0.4)]' : 'bg-surface/50 text-white/70 hover:bg-white/10 border border-white/5'}`}
              >
                {cat._id.replace('-', ' ')} <span className="opacity-50 ml-1">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="shrink-0 flex items-center justify-center">
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-surface/50 border border-white/5 rounded-full px-6 py-2.5 font-accent text-xs uppercase tracking-widest text-white/80 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer appearance-none text-center"
            >
              <option value="order">Custom Sort</option>
              <option value="-createdAt">Latest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-views">Most Viewed</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Masonry Grid */}
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        {loading && page === 1 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-surface/30 animate-pulse rounded-[2rem] border border-white/5 break-inside-avoid inline-block w-full" style={{ height: `${Math.floor(Math.random() * (400 - 250 + 1) + 250)}px` }} />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  index={index} 
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center flex flex-col items-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-surface/50 flex items-center justify-center border border-white/10">
              <span className="text-4xl opacity-50">✨</span>
            </div>
            <h3 className="text-3xl font-heading mb-3 text-white">No projects found</h3>
            <p className="text-white/50 font-body text-lg">Try selecting a different category.</p>
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="mt-20 flex justify-center">
            <button 
              onClick={loadMore}
              className="px-10 py-4 bg-surface/40 backdrop-blur-md border border-white/10 hover:border-primary/50 rounded-full font-accent uppercase tracking-widest text-sm transition-all hover:bg-white/5 text-white/90 shadow-xl"
            >
              Load More Work
            </button>
          </div>
        )}
        
        {!hasMore && projects.length > 0 && (
          <div className="mt-24 text-center">
            <div className="w-1 h-16 bg-gradient-to-b from-white/20 to-transparent mx-auto mb-4 rounded-full" />
            <p className="text-white/30 font-accent uppercase tracking-widest text-xs">End of Archive</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
