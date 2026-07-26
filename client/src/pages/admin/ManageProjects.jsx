import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../utils/api';
import { fadeInUp, staggerContainer } from '../../utils/animations';

const SortableRow = ({ project, selected, toggleSelect, onToggleStatus, onConfirmDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`border-b border-text/20 transition-colors ${isDragging ? 'bg-primary/20 shadow-2xl relative' : 'hover:bg-text/10 bg-surface/50'}`}
    >
      <td className="py-4 px-4 w-10">
        <div {...attributes} {...listeners} className="cursor-grab text-text/70 hover:text-text flex items-center justify-center p-2 outline-none">
          ☰
        </div>
      </td>
      <td className="py-4 px-4 w-10">
        <input 
          type="checkbox" 
          checked={selected}
          onChange={() => toggleSelect(project._id)}
          className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary focus:ring-offset-bg cursor-pointer"
        />
      </td>
      <td className="py-4 px-4">
        <div className="w-16 h-16 rounded overflow-hidden bg-black flex-shrink-0">
          <img src={project.thumbnail?.url || 'https://placehold.co/100'} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </td>
      <td className="py-4 px-4">
        <Link to={`/admin/projects/edit/${project._id}`} className="font-heading text-lg hover:text-primary transition-colors">
          {project.title}
        </Link>
        {project.clientName && <div className="text-xs text-text/70 font-accent mt-1">Client: {project.clientName}</div>}
      </td>
      <td className="py-4 px-4">
        <span className="text-[10px] uppercase font-accent tracking-widest text-text/70 bg-text/10 px-2 py-1 rounded">
          {project.category}
        </span>
      </td>
      <td className="py-4 px-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onToggleStatus(project._id, 'isVisible', !project.isVisible)}
            className={`text-[10px] uppercase font-accent font-bold px-2 py-1 rounded-full border transition-colors ${project.isVisible ? 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20' : 'bg-text/10 text-text/70 border-text/20 hover:bg-text/10'}`}
          >
            {project.isVisible ? 'Visible' : 'Hidden'}
          </button>
          <button 
            onClick={() => onToggleStatus(project._id, 'isFeatured', !project.isFeatured)}
            className={`text-[10px] uppercase font-accent font-bold px-2 py-1 rounded-full border transition-colors ${project.isFeatured ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20' : 'bg-text/10 text-text/70 border-text/20 hover:bg-text/10'}`}
          >
            Featured
          </button>
          <button 
            onClick={() => onToggleStatus(project._id, 'is3DShowcase', !project.is3DShowcase)}
            className={`text-[10px] uppercase font-accent font-bold px-2 py-1 rounded-full border transition-colors ${project.is3DShowcase ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20' : 'bg-text/10 text-text/70 border-text/20 hover:bg-text/10'}`}
          >
            3D
          </button>
        </div>
      </td>
      <td className="py-4 px-4 text-text/70 font-accent text-sm">
        {project.views || 0}
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-3">
          <Link to={`/admin/projects/edit/${project._id}`} className="text-text/70 hover:text-text transition-colors" title="Edit">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </Link>
          <button onClick={() => onConfirmDelete(project)} className="text-text/70 hover:text-red-500 transition-colors" title="Delete">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('table'); // table or grid
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
    fetchCategories();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/projects?limit=100'); // Assuming we want all for reordering
      setProjects(data.data);
    } catch (err) {
      console.error(err);
      showToast('Error loading projects', true);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/projects/categories');
      setCategories(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg, isError = false) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Save to backend
        saveOrder(newOrder);
        
        return newOrder;
      });
    }
  };

  const saveOrder = async (orderedProjects) => {
    try {
      const updates = orderedProjects.map((p, index) => ({ id: p._id, order: index }));
      await api.put('/projects/reorder', { updates });
      showToast('Order saved successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to save order', true);
    }
  };

  const handleToggleStatus = async (id, field, value) => {
    try {
      // Optimistic update
      setProjects(projects.map(p => p._id === id ? { ...p, [field]: value } : p));
      
      let endpoint = '';
      if (field === 'isVisible') endpoint = `/projects/${id}/visibility`;
      else if (field === 'isFeatured') endpoint = `/projects/${id}/featured`;
      else if (field === 'is3DShowcase') endpoint = `/projects/${id}/3d-showcase`;
      
      if (endpoint) {
        await api.patch(endpoint);
      } else {
        await api.put(`/projects/${id}`, { [field]: value });
      }
      
      showToast('Project updated');
    } catch (err) {
      console.error(err);
      // Revert on error
      fetchProjects();
      showToast('Failed to update', true);
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      await api.delete(`/projects/${projectToDelete._id}`);
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setSelectedIds(selectedIds.filter(id => id !== projectToDelete._id));
      showToast('Project deleted permanently');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete project', true);
    } finally {
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} projects?`)) return;
        await Promise.all(selectedIds.map(id => api.delete(`/projects/${id}`)));
        setProjects(projects.filter(p => !selectedIds.includes(p._id)));
        showToast(`${selectedIds.length} projects deleted`);
      } else if (action === 'hide') {
        await Promise.all(selectedIds.map(id => api.patch(`/projects/${id}`, { isVisible: false })));
        setProjects(projects.map(p => selectedIds.includes(p._id) ? { ...p, isVisible: false } : p));
        showToast(`${selectedIds.length} projects hidden`);
      }
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showToast('Bulk action failed', true);
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-heading mb-1">Projects <span className="text-text/70 text-lg">({projects.length})</span></h1>
          <p className="text-text/70 font-body text-sm">Manage your portfolio case studies and ordering.</p>
        </div>
        <Link 
          to="/admin/projects/add" 
          className="px-6 py-3 bg-primary text-white font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <span>➕</span> Add New Project
        </Link>
      </div>

      {/* Controls Bar */}
      <div className="bg-surface/50 border border-text/20 p-4 rounded-custom flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg border border-text/20 rounded px-4 py-2 pl-10 text-text font-body focus:outline-none focus:border-primary transition-colors text-sm"
            />
            <span className="absolute left-3 top-2.5 text-text/70">🔍</span>
          </div>
          
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 bg-bg border border-text/20 rounded px-4 py-2 text-text font-body focus:outline-none focus:border-primary transition-colors text-sm appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c._id}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-primary/20 text-primary' : 'bg-text/10 text-text/70 hover:text-text transition-colors'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary/20 text-primary' : 'bg-text/10 text-text/70 hover:text-text transition-colors'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/20 border border-primary/30 p-4 rounded-custom mb-6 flex justify-between items-center"
          >
            <span className="font-accent text-sm uppercase tracking-widest text-primary font-bold">
              {selectedIds.length} Projects Selected
            </span>
            <div className="flex gap-4">
              <button onClick={() => handleBulkAction('hide')} className="text-text hover:text-primary text-sm font-accent uppercase tracking-widest transition-colors">
                Hide Selected
              </button>
              <button onClick={() => handleBulkAction('delete')} className="text-red-400 hover:text-red-500 text-sm font-accent uppercase tracking-widest transition-colors">
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content List */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-text/10 rounded-custom"></div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-surface/50 border border-text/20 p-16 rounded-custom text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-text/10 rounded-full flex items-center justify-center text-4xl mb-6">📁</div>
          <h3 className="text-2xl font-heading mb-2">No projects found</h3>
          <p className="text-text/70 font-body mb-8">Get started by creating your first case study.</p>
          <Link to="/admin/projects/add" className="px-6 py-3 bg-primary text-white font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors">
            Add New Project
          </Link>
        </div>
      ) : (
        viewMode === 'table' ? (
          <div className="bg-surface/50 border border-text/20 rounded-custom overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-text/20 bg-black/20">
                  <th className="py-4 px-4 w-10"></th>
                  <th className="py-4 px-4 w-10">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Thumb</th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Project Details</th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Category</th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Status</th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal">Views</th>
                  <th className="py-4 px-4 text-xs font-accent uppercase tracking-widest text-text/70 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <tbody>
                  <SortableContext 
                    items={filteredProjects.map(p => p._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredProjects.map(project => (
                      <SortableRow 
                        key={project._id}
                        project={project}
                        selected={selectedIds.includes(project._id)}
                        toggleSelect={toggleSelect}
                        onToggleStatus={handleToggleStatus}
                        onConfirmDelete={confirmDelete}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </DndContext>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredProjects.map(p => p._id)} strategy={verticalListSortingStrategy}>
                {filteredProjects.map(project => (
                  <motion.div key={project._id} variants={fadeInUp} initial="hidden" animate="visible" className="bg-surface/50 border border-text/20 rounded-custom overflow-hidden group">
                    <div className="relative aspect-[4/3] overflow-hidden bg-black">
                      <img src={project.thumbnail?.url || 'https://placehold.co/400x300'} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent opacity-80" />
                      
                      <div className="absolute top-2 left-2">
                        <input 
                          type="checkbox" 
                          checked={selectedIds.includes(project._id)}
                          onChange={() => toggleSelect(project._id)}
                          className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer shadow-lg"
                        />
                      </div>
                      
                      <div className="absolute top-2 right-2 flex gap-1">
                        {project.isFeatured && <span className="bg-yellow-500 text-bg text-[10px] font-accent font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-lg">Featured</span>}
                        {!project.isVisible && <span className="bg-red-500 text-text text-[10px] font-accent font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-lg">Hidden</span>}
                      </div>

                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <span className="text-[10px] font-accent tracking-widest uppercase text-primary mb-1 block">{project.category}</span>
                        <h4 className="font-heading text-lg leading-tight">{project.title}</h4>
                      </div>
                    </div>
                    
                    <div className="p-4 flex justify-between items-center border-t border-text/20">
                      <div className="text-xs text-text/70 font-accent">{project.views || 0} views</div>
                      <div className="flex gap-2">
                        <Link to={`/admin/projects/edit/${project._id}`} className="text-text/70 hover:text-text transition-colors p-1">✎</Link>
                        <button onClick={() => confirmDelete(project)} className="text-text/70 hover:text-red-500 transition-colors p-1">🗑</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface border border-text/20 rounded-custom p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-heading mb-4 text-text">Delete Project?</h2>
              <p className="text-text/70 font-body mb-6">
                Are you sure you want to delete <span className="text-text font-bold">"{projectToDelete.title}"</span>? 
                This action cannot be undone and will permanently remove all associated images and data.
              </p>
              <div className="flex gap-4 justify-end">
                <button 
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                  className="px-6 py-2 rounded border border-text/20 text-text/70 hover:bg-text/10 hover:text-text transition-colors font-accent text-sm uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-6 py-2 rounded bg-red-500 hover:bg-red-600 text-text transition-colors font-accent text-sm uppercase tracking-widest shadow-lg shadow-red-500/20"
                >
                  Delete Permanently
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-white text-bg px-6 py-3 rounded shadow-2xl font-accent text-sm tracking-widest uppercase font-bold"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProjects;
