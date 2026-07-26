import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../utils/api';
import TagInput from '../../components/ui/TagInput';
import { ProfileContext } from '../../context/ProfileContext';

// Helper for Sortable Item
const SortableItem = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : 1 };
  return (
    <div ref={setNodeRef} style={style} className={`relative ${isDragging ? 'opacity-50' : ''}`}>
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-text/70 hover:z-10 p-2">
        ☰
      </div>
      <div className="pl-10">
        {children}
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const { profile, refreshProfile } = useContext(ProfileContext);
  const [activeTab, setActiveTab] = useState('Basic Info');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  
  // Data state
  const [data, setData] = useState({
    name: '', displayName: '', tagline: '', shortBio: '', bio: '', designPhilosophy: '',
    email: '', phone: '', location: { city: '', country: '' },
    availableForWork: true, availableForFreelance: true,
    photo: null,
    skills: [], tools: [], specializations: [],
    experience: [], education: [], awards: [],
    socialLinks: { instagram: '', behance: '', dribbble: '', linkedin: '', twitter: '', github: '' },
    resumeUrl: '',
    stats: { yearsOfExperience: 0, projectsCompleted: 0, happyClients: 0, awardsCount: 0, selfProjects: 0 }
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setData({
        name: profile.name || '',
        displayName: profile.displayName || '',
        tagline: profile.tagline || '',
        shortBio: profile.shortBio || '',
        bio: profile.bio || '',
        designPhilosophy: profile.designPhilosophy || '',
        email: profile.email || '',
        phone: profile.phone || '',
        location: profile.location || { city: '', country: '' },
        availableForWork: profile.availableForWork ?? true,
        availableForFreelance: profile.availableForFreelance ?? true,
        photo: profile.photo || null,
        skills: profile.skills || [],
        tools: profile.tools || [],
        specializations: profile.specializations || [],
        experience: profile.experience || [],
        education: profile.education || [],
        awards: profile.awards || [],
        socialLinks: profile.socialLinks || { instagram: '', behance: '', dribbble: '', linkedin: '', twitter: '', github: '' },
        resumeUrl: profile.resumeUrl || '',
        stats: profile.stats || { yearsOfExperience: 0, projectsCompleted: 0, happyClients: 0, awardsCount: 0, selfProjects: 0 }
      });
    }
  }, [profile]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/profile', data);
      await refreshProfile();
      showToast('Settings saved successfully');
    } catch (err) {
      console.error(err);
      showToast('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // --- Handlers for Basic Info ---
  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setData(p => ({ ...p, [parent]: { ...p[parent], [child]: value } }));
    } else {
      setData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const base64Image = await fileToBase64(file);
      const res = await api.post('/upload/image', { image: base64Image });
      const newPhoto = { url: res.data.data.url, publicId: res.data.data.publicId };
      setData(p => ({ ...p, photo: newPhoto }));
      await api.put('/profile/photo', { photo: newPhoto });
      await refreshProfile();
      showToast('Photo uploaded & saved');
    } catch (err) {
      showToast('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Tabs ---
  const tabs = ['Basic Info', 'Skills & Tools', 'Experience', 'Education', 'Awards', 'Social Links', 'Resume', 'Stats'];

  return (
    <div className="pb-24">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-bg px-6 py-3 rounded shadow-2xl z-50 font-accent uppercase tracking-widest text-sm font-bold">
          {toast}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-heading mb-1">Profile Settings</h1>
          <p className="text-text/70 font-body text-sm">Manage your personal and professional information.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0 bg-surface/50 border border-text/20 rounded-custom p-4 sticky top-24">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap text-left px-4 py-3 rounded text-sm font-accent tracking-widest uppercase transition-colors ${activeTab === tab ? 'bg-primary/20 text-primary border border-primary/20' : 'text-text/70 hover:hover:bg-text/10 border border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-surface/50 border border-text/20 rounded-custom p-6 md:p-8">
          
          {/* TAB: BASIC INFO */}
          {activeTab === 'Basic Info' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex items-center gap-8 mb-8 border-b border-text/20 pb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-black border border-text/20 overflow-hidden flex items-center justify-center">
                    {data.photo?.url ? (
                      <img src={data.photo.url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">👤</span>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                <div>
                  <h3 className="font-accent tracking-widest uppercase text-sm mb-3">Profile Photo</h3>
                  <div className="flex gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-text/10 hover:bg-text/10 rounded font-accent text-xs uppercase tracking-widest transition-colors">Change</button>
                    {data.photo && (
                      <button onClick={async () => {
                        setData(p => ({...p, photo: null}));
                        await api.put('/profile/photo', { photo: null });
                        await refreshProfile();
                        showToast('Photo removed');
                      }} className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded font-accent text-xs uppercase tracking-widest transition-colors">Remove</button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Full Name</label>
                  <input type="text" name="name" value={data.name} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Display Name</label>
                  <input type="text" name="displayName" value={data.displayName} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex justify-between text-xs font-accent uppercase tracking-widest opacity-60 mb-2">
                    <span>Tagline</span>
                    <span>{data.tagline.length}/100</span>
                  </label>
                  <input type="text" name="tagline" maxLength={100} value={data.tagline} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="flex justify-between text-xs font-accent uppercase tracking-widest opacity-60 mb-2">
                    <span>Short Bio (Homepage)</span>
                    <span>{data.shortBio.length}/300</span>
                  </label>
                  <textarea name="shortBio" maxLength={300} rows={3} value={data.shortBio} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Full Bio (About Page)</label>
                  <textarea name="bio" rows={6} value={data.bio} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none resize-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Design Philosophy</label>
                  <textarea name="designPhilosophy" rows={3} value={data.designPhilosophy} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Email</label>
                  <input type="email" name="email" value={data.email} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Phone</label>
                  <input type="text" name="phone" value={data.phone} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">City</label>
                  <input type="text" name="location.city" value={data.location?.city} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Country</label>
                  <input type="text" name="location.country" value={data.location?.country} onChange={handleBasicChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div className="flex gap-8 pt-4 border-t border-text/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="availableForWork" checked={data.availableForWork} onChange={handleBasicChange} className="w-4 h-4" />
                  <span className="text-sm font-accent tracking-widest uppercase">Available for Work</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="availableForFreelance" checked={data.availableForFreelance} onChange={handleBasicChange} className="w-4 h-4" />
                  <span className="text-sm font-accent tracking-widest uppercase">Available for Freelance</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB: SKILLS & TOOLS */}
          {activeTab === 'Skills & Tools' && (
            <div className="space-y-12 animate-fadeIn">
              
              {/* Specializations */}
              <div>
                <h3 className="text-xl font-heading mb-4">Specializations</h3>
                <TagInput tags={data.specializations} onChange={t => setData(p => ({...p, specializations: t}))} placeholder="Add specialization (e.g. Brand Identity)" />
              </div>

              {/* Skills */}
              <div className="border-t border-text/20 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading">Design Skills</h3>
                  <button onClick={() => setData(p => ({...p, skills: [...p.skills, { id: Date.now().toString(), name: '', category: 'design', level: 80 }]}))} className="text-primary hover:transition-colors text-sm font-accent tracking-widest uppercase">+ Add Skill</button>
                </div>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                  const { active, over } = e;
                  if (active.id !== over.id) {
                    setData(p => {
                      const oldI = p.skills.findIndex(i => i.id === active.id);
                      const newI = p.skills.findIndex(i => i.id === over.id);
                      return { ...p, skills: arrayMove(p.skills, oldI, newI) };
                    });
                  }
                }}>
                  <SortableContext items={data.skills.map(s => s.id || s.name)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {data.skills.map((skill, index) => (
                        <SortableItem key={skill.id || skill.name} id={skill.id || skill.name}>
                          <div className="flex flex-col sm:flex-row gap-4 bg-bg border border-text/20 p-4 rounded items-center">
                            <input type="text" placeholder="Skill Name" value={skill.name} onChange={(e) => {
                              const newSkills = [...data.skills]; newSkills[index].name = e.target.value; setData(p => ({...p, skills: newSkills}));
                            }} className="flex-1 bg-transparent border-b border-text/20 focus:border-primary focus:outline-none p-2" />
                            
                            <select value={skill.category} onChange={(e) => {
                              const newSkills = [...data.skills]; newSkills[index].category = e.target.value; setData(p => ({...p, skills: newSkills}));
                            }} className="bg-transparent border border-text/20 rounded px-2 py-2 text-sm focus:outline-none">
                              <option value="design">Design</option>
                              <option value="tools">Tools</option>
                              <option value="soft-skills">Soft Skills</option>
                            </select>

                            <div className="flex items-center gap-4 flex-1">
                              <input type="range" min="0" max="100" value={skill.level} onChange={(e) => {
                                const newSkills = [...data.skills]; newSkills[index].level = parseInt(e.target.value); setData(p => ({...p, skills: newSkills}));
                              }} className="w-full accent-primary" />
                              <span className="w-8 text-right font-accent text-primary">{skill.level}%</span>
                            </div>

                            <button onClick={() => {
                              setData(p => ({...p, skills: p.skills.filter((_, i) => i !== index)}));
                            }} className="text-text/70 hover:text-red-500 p-2">✕</button>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Tools */}
              <div className="border-t border-text/20 pt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-heading">Software Tools</h3>
                  <button onClick={() => setData(p => ({...p, tools: [...p.tools, { id: Date.now().toString(), name: '', proficiency: 'advanced' }]}))} className="text-primary hover:transition-colors text-sm font-accent tracking-widest uppercase">+ Add Tool</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.tools.map((tool, index) => (
                    <div key={index} className="flex gap-2 bg-bg border border-text/20 p-2 rounded">
                      <input type="text" placeholder="Tool Name" value={tool.name} onChange={(e) => {
                        const newTools = [...data.tools]; newTools[index].name = e.target.value; setData(p => ({...p, tools: newTools}));
                      }} className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2" />
                      
                      <select value={tool.proficiency} onChange={(e) => {
                        const newTools = [...data.tools]; newTools[index].proficiency = e.target.value; setData(p => ({...p, tools: newTools}));
                      }} className="bg-transparent border-none rounded text-xs focus:outline-none px-2 w-32">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>

                      <button onClick={() => {
                        setData(p => ({...p, tools: p.tools.filter((_, i) => i !== index)}));
                      }} className="text-text/70 hover:text-red-500 p-2">✕</button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB: EXPERIENCE */}
          {activeTab === 'Experience' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading">Work Experience</h3>
                <button onClick={() => setData(p => ({...p, experience: [{ id: Date.now().toString(), company: '', role: '', type: 'full-time', startDate: '', endDate: '', current: false, description: '' }, ...p.experience]}))} className="text-primary hover:transition-colors text-sm font-accent tracking-widest uppercase">+ Add Experience</button>
              </div>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => {
                  const { active, over } = e;
                  if (active.id !== over.id) {
                    setData(p => {
                      const oldI = p.experience.findIndex(i => i.id === active.id);
                      const newI = p.experience.findIndex(i => i.id === over.id);
                      return { ...p, experience: arrayMove(p.experience, oldI, newI) };
                    });
                  }
                }}>
                  <SortableContext items={data.experience.map(e => e.id || e.company)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-6">
                      {data.experience.map((exp, index) => (
                        <SortableItem key={exp.id || index} id={exp.id || exp.company}>
                          <div className="bg-bg border border-text/20 p-6 rounded relative group">
                            <button onClick={() => setData(p => ({...p, experience: p.experience.filter((_, i) => i !== index)}))} className="absolute top-4 right-4 text-text/70 hover:text-red-500 transition-colors">✕</button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Company</label>
                                <input type="text" value={exp.company} onChange={e => { const n = [...data.experience]; n[index].company = e.target.value; setData(p => ({...p, experience: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Role/Position</label>
                                <input type="text" value={exp.role} onChange={e => { const n = [...data.experience]; n[index].role = e.target.value; setData(p => ({...p, experience: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Type</label>
                                <select value={exp.type} onChange={e => { const n = [...data.experience]; n[index].type = e.target.value; setData(p => ({...p, experience: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm">
                                  <option value="full-time">Full-time</option>
                                  <option value="freelance">Freelance</option>
                                  <option value="contract">Contract</option>
                                  <option value="internship">Internship</option>
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Start Date</label>
                                  <input type="text" placeholder="e.g. Jan 2020" value={exp.startDate} onChange={e => { const n = [...data.experience]; n[index].startDate = e.target.value; setData(p => ({...p, experience: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">End Date</label>
                                  <input type="text" placeholder="e.g. Present" value={exp.current ? 'Present' : exp.endDate} disabled={exp.current} onChange={e => { const n = [...data.experience]; n[index].endDate = e.target.value; setData(p => ({...p, experience: n}))}} className={`w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm ${exp.current ? 'opacity-50' : ''}`} />
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" checked={exp.current} onChange={e => { const n = [...data.experience]; n[index].current = e.target.checked; setData(p => ({...p, experience: n}))}} />
                                  <span className="text-xs font-accent tracking-widest uppercase">Currently working here</span>
                                </label>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Description</label>
                                <textarea rows={3} value={exp.description} onChange={e => { const n = [...data.experience]; n[index].description = e.target.value; setData(p => ({...p, experience: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm resize-none" />
                              </div>
                            </div>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
              </DndContext>
            </div>
          )}

          {/* TAB: EDUCATION */}
          {activeTab === 'Education' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading">Education</h3>
                <button onClick={() => setData(p => ({...p, education: [{ institution: '', degree: '', field: '', year: '' }, ...p.education]}))} className="text-primary hover:transition-colors text-sm font-accent tracking-widest uppercase">+ Add Education</button>
              </div>
              <div className="space-y-4">
                {data.education.map((edu, index) => (
                  <div key={index} className="bg-bg border border-text/20 p-6 rounded relative">
                    <button onClick={() => setData(p => ({...p, education: p.education.filter((_, i) => i !== index)}))} className="absolute top-4 right-4 text-text/70 hover:text-red-500 transition-colors">✕</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <div>
                        <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Institution</label>
                        <input type="text" value={edu.institution} onChange={e => { const n = [...data.education]; n[index].institution = e.target.value; setData(p => ({...p, education: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Degree</label>
                        <input type="text" value={edu.degree} onChange={e => { const n = [...data.education]; n[index].degree = e.target.value; setData(p => ({...p, education: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Field of Study</label>
                        <input type="text" value={edu.field} onChange={e => { const n = [...data.education]; n[index].field = e.target.value; setData(p => ({...p, education: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-1">Year</label>
                        <input type="text" value={edu.year} onChange={e => { const n = [...data.education]; n[index].year = e.target.value; setData(p => ({...p, education: n}))}} className="w-full bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AWARDS */}
          {activeTab === 'Awards' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading">Awards & Recognition</h3>
                <button onClick={() => setData(p => ({...p, awards: [{ title: '', organization: '', year: '', link: '' }, ...p.awards]}))} className="text-primary hover:transition-colors text-sm font-accent tracking-widest uppercase">+ Add Award</button>
              </div>
              <div className="space-y-4">
                {data.awards.map((awd, index) => (
                  <div key={index} className="bg-bg border border-text/20 p-6 rounded relative flex flex-col md:flex-row gap-4 pr-12">
                    <button onClick={() => setData(p => ({...p, awards: p.awards.filter((_, i) => i !== index)}))} className="absolute top-4 right-4 text-text/70 hover:text-red-500 transition-colors">✕</button>
                    <input type="text" placeholder="Award Title" value={awd.title} onChange={e => { const n = [...data.awards]; n[index].title = e.target.value; setData(p => ({...p, awards: n}))}} className="flex-1 bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                    <input type="text" placeholder="Organization" value={awd.organization} onChange={e => { const n = [...data.awards]; n[index].organization = e.target.value; setData(p => ({...p, awards: n}))}} className="flex-1 bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                    <input type="text" placeholder="Year" value={awd.year} onChange={e => { const n = [...data.awards]; n[index].year = e.target.value; setData(p => ({...p, awards: n}))}} className="w-24 bg-transparent border border-text/20 rounded px-3 py-2 focus:border-primary focus:outline-none text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SOCIAL LINKS */}
          {activeTab === 'Social Links' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-heading mb-6">Social & Professional Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(data.socialLinks).map(platform => (
                  <div key={platform}>
                    <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2 capitalize">{platform}</label>
                    <input 
                      type="url" 
                      placeholder={`https://${platform}.com/...`}
                      value={data.socialLinks[platform]} 
                      onChange={e => setData(p => ({...p, socialLinks: {...p.socialLinks, [platform]: e.target.value}}))} 
                      className="w-full bg-bg border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: RESUME */}
          {activeTab === 'Resume' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-heading mb-6">Resume / CV</h3>
              <div className="bg-bg border border-text/20 p-8 rounded-custom text-center relative">
                <div className="text-4xl mb-4">📄</div>
                {data.resumeUrl ? (
                  <div className="mb-6">
                    <p className="text-primary font-accent uppercase tracking-widest text-sm mb-2">Resume is live</p>
                    <a href={data.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-text/70 hover:underline text-sm">View Current Resume</a>
                  </div>
                ) : (
                  <p className="text-text/70 font-body mb-6">No resume uploaded.</p>
                )}
                
                <div className="max-w-md mx-auto space-y-4">
                  <input 
                    type="url" 
                    placeholder="Paste an external URL (e.g. Google Drive)" 
                    value={data.resumeUrl}
                    onChange={e => setData(p => ({...p, resumeUrl: e.target.value}))}
                    className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: STATS */}
          {activeTab === 'Stats' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-heading mb-6">Performance Stats</h3>
              <p className="text-text/70 text-sm mb-6">These numbers appear as animated counters on your About page.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {['yearsOfExperience', 'projectsCompleted', 'happyClients', 'awardsCount', 'selfProjects'].map(stat => (
                  <div key={stat} className="bg-bg border border-text/20 p-6 rounded-custom text-center">
                    <label className="block text-[10px] font-accent uppercase tracking-widest opacity-60 mb-4 h-8 flex items-center justify-center">
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input 
                      type="number" 
                      value={data.stats?.[stat] ?? data[stat] ?? 0} 
                      onChange={e => setData(p => ({...p, [stat]: parseInt(e.target.value) || 0, stats: {...(p.stats || {}), [stat]: parseInt(e.target.value) || 0}}))} 
                      className="w-full bg-transparent border border-text/20 rounded px-4 py-3 focus:border-primary focus:outline-none text-center text-xl font-heading" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-12 pt-6 border-t border-text/20 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-3 bg-primary text-white font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-text/20 border-t-white rounded-full animate-spin"></span>}
              Save {activeTab}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
