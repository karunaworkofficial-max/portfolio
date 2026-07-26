import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/messages?limit=100');
      setMessages(data.data || data);
    } catch (err) {
      console.error(err);
      showToast('Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleUpdateMessage = async (id, updates) => {
    try {
      setMessages(prev => prev.map(m => m._id === id ? { ...m, ...updates } : m));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(prev => ({ ...prev, ...updates }));
      }
      await api.patch(`/messages/${id}`, updates);
    } catch (err) {
      console.error(err);
      showToast('Action failed');
      fetchMessages(); // revert
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selectedMessage && selectedMessage._id === id) setSelectedMessage(null);
      showToast('Message deleted');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete');
    }
  };

  const handleBulkAction = async (action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm(`Delete ${selectedIds.length} messages?`)) return;
        await Promise.all(selectedIds.map(id => api.delete(`/messages/${id}`)));
        setMessages(prev => prev.filter(m => !selectedIds.includes(m._id)));
        if (selectedMessage && selectedIds.includes(selectedMessage._id)) setSelectedMessage(null);
      } else {
        const updates = {};
        if (action === 'read') updates.read = true;
        if (action === 'unread') updates.read = false;
        if (action === 'archive') updates.archived = true;
        
        await Promise.all(selectedIds.map(id => api.patch(`/messages/${id}`, updates)));
        setMessages(prev => prev.map(m => selectedIds.includes(m._id) ? { ...m, ...updates } : m));
        
        if (selectedMessage && selectedIds.includes(selectedMessage._id)) {
          setSelectedMessage(prev => ({ ...prev, ...updates }));
        }
      }
      setSelectedIds([]);
      showToast(`Bulk action successful`);
    } catch (err) {
      console.error(err);
      showToast('Bulk action failed');
    }
  };

  const handleSelectMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleUpdateMessage(msg._id, { read: true });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    const diffHrs = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m._id));
    }
  };

  const unreadCount = messages.filter(m => !m.read && !m.archived).length;
  
  let filteredMessages = messages.filter(m => {
    if (activeTab === 'Unread') return !m.read && !m.archived;
    if (activeTab === 'Starred') return m.starred && !m.archived;
    if (activeTab === 'Archived') return m.archived;
    return !m.archived;
  });

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredMessages = filteredMessages.filter(m => 
      m.name.toLowerCase().includes(term) || 
      m.email.toLowerCase().includes(term) || 
      m.message.toLowerCase().includes(term)
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col pb-6">
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white text-bg px-6 py-3 rounded shadow-2xl z-50 font-accent uppercase tracking-widest text-sm font-bold">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-heading mb-1">Messages</h1>
          <p className="text-text/70 font-body text-sm font-accent tracking-widest uppercase">
            {messages.filter(m=>!m.archived).length} Total &middot; <span className="text-primary">{unreadCount} Unread</span>
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 bg-surface/30 rounded-custom border border-text/20 overflow-hidden">
        
        {/* Left List */}
        <div className={`w-full ${selectedMessage ? 'hidden lg:flex' : 'flex'} lg:w-1/2 xl:w-2/5 flex-col border-r border-text/20 bg-surface/50`}>
          
          {/* Controls */}
          <div className="p-4 border-b border-text/20 shrink-0">
            <div className="relative mb-4">
              <input 
                type="text" 
                placeholder="Search messages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-bg border border-text/20 rounded px-4 py-2 pl-10 text-text font-body focus:outline-none focus:border-primary transition-colors text-sm"
              />
              <span className="absolute left-3 top-2.5 text-text/70">🔍</span>
            </div>

            <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
              {['All', 'Unread', 'Starred', 'Archived'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-accent tracking-widest uppercase whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-transparent text-text/70 hover:text-text border border-transparent'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Action Bar */}
          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-primary/10 border-b border-primary/20 px-4 py-2 flex items-center justify-between overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filteredMessages.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-text/20 bg-transparent text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-xs font-accent text-primary uppercase tracking-widest font-bold">
                    {selectedIds.length} Selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAction('read')} className="p-1.5 text-text/70 hover:text-text" title="Mark Read">📖</button>
                  <button onClick={() => handleBulkAction('unread')} className="p-1.5 text-text/70 hover:text-text" title="Mark Unread">📕</button>
                  <button onClick={() => handleBulkAction('archive')} className="p-1.5 text-text/70 hover:text-text" title="Archive">📦</button>
                  <button onClick={() => handleBulkAction('delete')} className="p-1.5 text-red-400 hover:text-red-500 ml-2" title="Delete">🗑</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-8 text-center text-text/70 font-accent uppercase tracking-widest text-sm animate-pulse">Loading messages...</div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-4 opacity-50">📬</div>
                <h3 className="font-heading text-lg mb-1">
                  {searchTerm ? 'No messages found' : activeTab === 'Unread' ? 'All caught up! ✨' : 'No messages yet'}
                </h3>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg._id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`border-b border-text/20 p-4 cursor-pointer transition-colors group relative ${selectedMessage?._id === msg._id ? 'bg-text/10 border-l-4 border-l-primary' : !msg.read ? 'bg-primary/5 hover:bg-text/10 border-l-4 border-l-primary/30' : 'bg-transparent hover:bg-text/10 border-l-4 border-l-transparent'}`}
                >
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(msg._id)}
                      onChange={(e) => toggleSelect(msg._id, e)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-text/20 bg-bg text-primary focus:ring-primary cursor-pointer mt-1"
                    />
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUpdateMessage(msg._id, { starred: !msg.starred }); }}
                      className={`mt-0.5 transition-colors ${msg.starred ? 'text-yellow-500' : 'text-text/70 group-hover:text-text/70'}`}
                    >
                      {msg.starred ? '★' : '☆'}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`truncate text-sm ${!msg.read ? 'font-bold text-text' : 'font-body text-text/70'}`}>
                          {msg.name}
                        </span>
                        <span className={`text-[10px] font-accent uppercase tracking-widest whitespace-nowrap ml-2 ${!msg.read ? 'text-primary font-bold' : 'text-text/70'}`}>
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        {msg.projectType && (
                          <span className="bg-text/10 text-text/70 text-[9px] font-accent uppercase tracking-widest px-1.5 py-0.5 rounded truncate">
                            {msg.projectType}
                          </span>
                        )}
                        {!msg.read && <span className="w-2 h-2 rounded-full bg-primary mt-1"></span>}
                      </div>

                      <p className={`text-xs truncate ${!msg.read ? 'text-text/70' : 'text-text/70'} font-body`}>
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Detail */}
        <div className={`w-full ${!selectedMessage ? 'hidden lg:flex' : 'flex'} lg:w-1/2 xl:w-3/5 flex-col bg-bg relative`}>
          {selectedMessage ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-text/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-surface/30">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden p-2 bg-text/10 rounded text-text/70"
                  >
                    ←
                  </button>
                  <div>
                    <h2 className="text-xl font-heading mb-1">{selectedMessage.name}</h2>
                    <a href={`mailto:${selectedMessage.email}`} className="text-sm font-body text-text/70 hover:text-primary transition-colors">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: Design Inquiry`}
                    className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded font-accent uppercase tracking-widest text-xs hover:bg-primary hover:text-text transition-colors"
                  >
                    Reply
                  </a>
                  <div className="h-8 w-px bg-text/10 mx-1 self-center"></div>
                  <button onClick={() => handleUpdateMessage(selectedMessage._id, { starred: !selectedMessage.starred })} className="p-2 text-text/70 hover:text-yellow-500" title="Star">
                    {selectedMessage.starred ? '★' : '☆'}
                  </button>
                  <button onClick={() => handleUpdateMessage(selectedMessage._id, { archived: !selectedMessage.archived })} className="p-2 text-text/70 hover:text-text" title={selectedMessage.archived ? "Unarchive" : "Archive"}>
                    📦
                  </button>
                  <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 text-text/70 hover:text-red-500" title="Delete">
                    🗑
                  </button>
                </div>
              </div>

              {/* Detail Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                
                <div className="text-xs font-accent uppercase tracking-widest text-text/70 mb-8 pb-4 border-b border-text/20 flex justify-between">
                  <span>Sent via Contact Form</span>
                  <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {selectedMessage.projectType && (
                    <div className="bg-surface border border-text/20 p-4 rounded">
                      <div className="text-[10px] font-accent uppercase tracking-widest text-text/70 mb-1">Project Type</div>
                      <div className="text-sm font-body font-bold">{selectedMessage.projectType}</div>
                    </div>
                  )}
                  {selectedMessage.budget && (
                    <div className="bg-surface border border-text/20 p-4 rounded">
                      <div className="text-[10px] font-accent uppercase tracking-widest text-text/70 mb-1">Budget Range</div>
                      <div className="text-sm font-body font-bold text-primary">{selectedMessage.budget}</div>
                    </div>
                  )}
                  {selectedMessage.timeline && (
                    <div className="bg-surface border border-text/20 p-4 rounded sm:col-span-2">
                      <div className="text-[10px] font-accent uppercase tracking-widest text-text/70 mb-1">Expected Timeline</div>
                      <div className="text-sm font-body">{selectedMessage.timeline}</div>
                    </div>
                  )}
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-[10px] font-accent uppercase tracking-widest text-text/70 mb-4">Message</div>
                  <div className="font-body text-text/70 leading-relaxed whitespace-pre-wrap text-[15px]">
                    {selectedMessage.message}
                  </div>
                </div>

              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-text/70 p-8">
              <div className="text-6xl mb-6 opacity-20">📭</div>
              <h3 className="font-heading text-xl mb-2 text-text/70">Select a message to read</h3>
              <p className="font-body text-sm max-w-xs text-center">Your inbox is synced directly from your portfolio's contact form.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
