import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { ThemeContext } from '../context/ThemeContext';
import ProjectCard from '../components/ui/ProjectCard';
import { letterReveal, staggerContainer } from '../utils/animations';

const SkeletonCard = ({ index }) => {
  const isLarge = index % 4 === 0 || index % 4 === 3;
  const spanClass = isLarge ? 'md:col-span-7' : 'md:col-span-5';
  
  return (
    <div className={`aspect-[4/3] bg-surface/50 animate-pulse rounded-custom ${spanClass}`} />
  );
};

const Projects = () => {
  const { theme } = useContext(ThemeContext);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('order'); // order, createdAt, views, title
  const [page, setPage] = useState(1);
  const [gridCols, setGridCols] = useState(4);
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
      
      const { data } = await api.get(`/projects?page=${pageNum}&limit=6${categoryParam}${sortParam}`);
      
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

  const layoutMode = theme?.projectsLayout || 'grid';

  return (
    <motion.div 
      className="min-h-screen pt-24 pb-20 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >


      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-20 pb-16">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <div className="overflow-hidden">
            <motion.h1 variants={letterReveal} className="text-6xl md:text-8xl font-heading mb-4">
              Projects
            </motion.h1>
          </div>
          <motion.p variants={letterReveal} className="text-xl text-muted font-body max-w-2xl">
            A curated exhibition of {totalCount} projects exploring visual identities, digital experiences, and creative solutions.
          </motion.p>
        </motion.div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-40 bg-bg/80 backdrop-blur-md border-b border-text/20 py-4 mb-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setFilter('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-accent text-sm transition-colors ${filter === 'all' ? 'bg-primary text-text' : 'bg-surface hover:bg-text/10'}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button 
                key={cat._id}
                onClick={() => setFilter(cat._id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-accent text-sm transition-colors ${filter === cat._id ? 'bg-primary text-text' : 'bg-surface hover:bg-text/10'}`}
              >
                {cat._id.replace('-', ' ')} <span className="opacity-50 ml-1 text-xs">({cat.count})</span>
              </button>
            ))}
          </div>

          {/* Sort & Grid Toggle */}
          <div className="shrink-0 flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-surface/50 border border-text/20 rounded-full p-1">
              <span className="text-[10px] font-accent uppercase tracking-widest text-text/50 pl-3">Grid:</span>
              {[2, 3, 4, 5, 6].map(col => (
                <button
                  key={col}
                  onClick={() => setGridCols(col)}
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-accent transition-colors ${gridCols === col ? 'bg-primary text-white' : 'hover:bg-text/10 text-text/70'}`}
                  title={`${col} Columns`}
                >
                  {col}
                </button>
              ))}
            </div>
            <select 
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-surface border border-text/20 rounded-full px-4 py-2 font-accent text-sm focus:outline-none focus:border-primary"
            >
              <option value="order">Custom Order</option>
              <option value="-createdAt">Latest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-views">Most Viewed</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6">
        {loading && page === 1 ? (
          <div className={`grid gap-6 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : gridCols === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : gridCols === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[4/3] bg-surface/50 animate-pulse rounded-custom" />)}
          </div>
        ) : (
          <motion.div layout className={`grid gap-6 items-start ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : gridCols === 5 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5' : gridCols === 6 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  index={index} 
                  layoutMode={layoutMode} 
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && projects.length === 0 && (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4 opacity-50">✨</div>
            <h3 className="text-2xl font-heading mb-2">No projects found</h3>
            <p className="text-muted font-body">There are currently no projects in this category.</p>
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && (
          <div className="mt-16 flex justify-center">
            <button 
              onClick={loadMore}
              className="px-8 py-4 bg-surface border border-text/20 hover:border-primary rounded-custom font-accent uppercase tracking-widest text-sm transition-all hover:bg-primary"
            >
              Load More
            </button>
          </div>
        )}
        
        {!hasMore && projects.length > 0 && (
          <div className="mt-16 text-center text-muted font-accent uppercase tracking-widest text-xs">
            All projects loaded
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Projects;
