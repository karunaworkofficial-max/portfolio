import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import TagInput from '../ui/TagInput';
import ColorPaletteInput from '../ui/ColorPaletteInput';
import ImageUploader from '../ui/ImageUploader';

const CATEGORIES = [
  'Brand Identity', 'Logo Design', 'Poster Design', 'Packaging Design',
  'Editorial Design', 'Social Media Design', 'Typography', 'Illustration',
  'Print Design', 'UI Design', 'Motion Graphics', 'Infographic',
  'Merchandise', 'Album Art', 'Book Cover', 'Other'
];

const TOOLS = [
  'Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe After Effects',
  'Adobe XD', 'Figma', 'Sketch', 'Procreate', 'Cinema 4D', 'Blender', 'Canva'
];

const ProjectForm = ({ initialData, mode = 'add' }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', designType: '', category: '',
    clientName: '', clientIndustry: '', projectYear: '', duration: '',
    liveUrl: '', tags: [], challenge: '', approach: '',
    solution: '', results: '',
    videoUrl: '', tools: [], deliverables: [],
    testimonialText: '', testimonialAuthor: '', testimonialRole: '',
    isVisible: true, featured: false, showcase3D: false, accentColor: '#6C63FF',
    colorPalette: []
  });

  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        subtitle: initialData.subtitle || '',
        designType: initialData.designType || '',
        category: initialData.category || '',
        clientName: initialData.clientName || '',
        clientIndustry: initialData.clientIndustry || '',
        projectYear: initialData.projectYear || '',
        duration: initialData.duration || '',
        liveUrl: initialData.liveUrl || '',
        tags: initialData.tags || [],
        challenge: initialData.challenge || '',
        approach: initialData.approach || '',
        solution: initialData.solution || '',
        results: initialData.results || '',
        videoUrl: initialData.videoUrl || '',
        tools: initialData.tools || [],
        deliverables: initialData.deliverables || [],
        testimonialText: initialData.testimonial?.text || '',
        testimonialAuthor: initialData.testimonial?.author || '',
        testimonialRole: initialData.testimonial?.role || '',
        isVisible: initialData.isVisible !== false,
        featured: initialData.featured || false,
        showcase3D: initialData.showcase3D || false,
        accentColor: initialData.accentColor || '#6C63FF',
        colorPalette: initialData.colorPalette || []
      });
      setDescription(initialData.description || '');
      setFonts(initialData.fonts || []);
      
      if (initialData.images) {
        setImages(initialData.images.map(img => ({ ...img, isNew: false })));
        const coverIdx = initialData.images.findIndex(img => img.url === initialData.thumbnail?.url);
        setCoverIndex(coverIdx >= 0 ? coverIdx : 0);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToolToggle = (tool) => {
    setFormData(prev => {
      if (prev.tools.includes(tool)) return { ...prev, tools: prev.tools.filter(t => t !== tool) };
      return { ...prev, tools: [...prev.tools, tool] };
    });
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (publish = true) => {
    if (!formData.title) return alert("Title is required");
    if (!formData.category) return alert("Category is required");
    if (!description) return alert("Brief/Description is required");
    if (images.length === 0) return alert("At least one image is required");

    setLoading(true);

    try {
      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const processedImages = await Promise.all(images.map(async (img) => {
        if (!img.isNew) return { url: img.url, alt: img.alt, isMockup: img.isMockup, publicId: img.publicId };
        
        const base64Image = await fileToBase64(img.file);
        const { data } = await api.post('/upload/image', { image: base64Image });
        return { url: data.data.url, alt: img.alt, isMockup: img.isMockup, publicId: data.data.publicId };
      }));

      const payload = {
        ...formData,
        description,
        fonts,
        testimonial: {
          text: formData.testimonialText,
          author: formData.testimonialAuthor,
          role: formData.testimonialRole
        },
        isVisible: publish,
        images: processedImages,
        thumbnail: processedImages[coverIndex || 0]
      };

      if (mode === 'add') {
        await api.post('/projects', payload);
      } else {
        await api.put(`/projects/${initialData._id}`, payload);
      }
      
      navigate('/admin/projects');
    } catch (err) {
      console.error(err);
      alert("Error saving project. See console.");
    } finally {
      setLoading(false);
    }
  };

  const addFont = () => setFonts([...fonts, { name: '', role: 'Body Text' }]);
  const updateFont = (index, field, val) => {
    const next = [...fonts];
    next[index][field] = val;
    setFonts(next);
  };
  const removeFont = (index) => setFonts(fonts.filter((_, i) => i !== index));

  return (
    <div className="pb-24">
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white text-bg px-6 py-3 rounded shadow-2xl z-50 font-accent uppercase tracking-widest text-sm font-bold">
          {toast}
        </div>
      )}

      <div className="space-y-8 max-w-5xl">
        <section className="bg-surface/50 border border-text/20 rounded-custom p-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
            Basic Info
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Project Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-bg border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none appearance-none cursor-pointer">
                <option value="" disabled>Select Category</option>
                {CATEGORIES.map(c => <option key={c} value={c.toLowerCase().replace(/\s+/g, '-')}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Design Type</label>
              <input type="text" name="designType" value={formData.designType} onChange={handleChange} placeholder="e.g. Complete Brand Identity Package" className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Subtitle</label>
              <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Client Name</label>
              <input type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Industry</label>
              <input type="text" name="clientIndustry" value={formData.clientIndustry} onChange={handleChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Year</label>
              <input type="text" name="projectYear" value={formData.projectYear} onChange={handleChange} className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Duration</label>
              <input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 2 weeks" className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">Tags</label>
              <TagInput tags={formData.tags} onChange={(t) => setFormData(p => ({...p, tags: t}))} />
            </div>
          </div>
        </section>

        <section className="bg-surface/50 border border-text/20 rounded-custom p-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm">2</span>
            Case Study
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">The Brief</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What the client asked for..." className="w-full bg-bg border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">The Challenge</label>
              <textarea name="challenge" value={formData.challenge} onChange={handleChange} rows={3} placeholder="The main challenge was..." className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">The Approach</label>
              <textarea name="approach" value={formData.approach} onChange={handleChange} rows={3} placeholder="I started with..." className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-2">The Solution</label>
              <textarea name="solution" value={formData.solution} onChange={handleChange} rows={3} placeholder="The final design features..." className="w-full bg-transparent border border-text/20 rounded px-4 py-3 font-body focus:border-primary focus:outline-none resize-none" />
            </div>
          </div>
        </section>

        <section className="bg-surface/50 border border-text/20 rounded-custom p-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm">3</span>
            Media
          </h2>
          <ImageUploader images={images} setImages={setImages} coverIndex={coverIndex} setCoverIndex={setCoverIndex} />
        </section>

        <section className="bg-surface/50 border border-text/20 rounded-custom p-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-500 flex items-center justify-center text-sm">4</span>
            Design Details
          </h2>
          <div className="space-y-10">
            <div>
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-4">Project Colors</label>
              <ColorPaletteInput colors={formData.colorPalette} onChange={c => setFormData(p => ({...p, colorPalette: c}))} />
            </div>
            
            <div className="border-t border-text/20 pt-8">
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-4">Tools Used</label>
              <div className="flex flex-wrap gap-3">
                {TOOLS.map(t => (
                  <button 
                    key={t}
                    type="button"
                    onClick={() => handleToolToggle(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-accent tracking-widest uppercase transition-colors border ${formData.tools.includes(t) ? 'bg-primary/20 border-primary text-primary' : 'bg-transparent border-text/20 text-text/70 hover:border-text/20 hover:text-text'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-text/20 pt-8">
              <label className="block text-xs font-accent uppercase tracking-widest opacity-60 mb-4 flex justify-between items-center">
                Fonts Used
                <button type="button" onClick={addFont} className="text-primary hover:transition-colors">+ Add Font</button>
              </label>
              <div className="space-y-3">
                {fonts.map((f, i) => (
                  <div key={i} className="flex gap-4 items-center bg-bg p-3 border border-text/20 rounded">
                    <input type="text" placeholder="Font Name" value={f.name} onChange={e => updateFont(i, 'name', e.target.value)} className="flex-1 bg-transparent border-none focus:outline-none" />
                    <select value={f.role} onChange={e => updateFont(i, 'role', e.target.value)} className="bg-transparent border-l border-text/20 pl-4 focus:outline-none appearance-none w-48 text-sm">
                      <option value="Primary Heading">Primary Heading</option>
                      <option value="Secondary Heading">Secondary Heading</option>
                      <option value="Body Text">Body Text</option>
                      <option value="Accent">Accent</option>
                    </select>
                    <button type="button" onClick={() => removeFont(i)} className="text-text/70 hover:text-red-500 pl-4 border-l border-text/20">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface/50 border border-text/20 rounded-custom p-8">
          <h2 className="text-2xl font-heading mb-6 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-text/10 flex items-center justify-center text-sm">⚙</span>
            Settings
          </h2>
          <div className="space-y-6">
            <label className="flex items-center gap-4 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.isVisible ? 'bg-primary' : 'bg-text/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.isVisible ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" className="hidden" name="isVisible" checked={formData.isVisible} onChange={handleChange} />
              <div>
                <div className="text-sm font-accent tracking-widest uppercase">Visible</div>
                <div className="text-xs font-body text-text/70">Show this project on the public site</div>
              </div>
            </label>
            
            <label className="flex items-center gap-4 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.featured ? 'bg-yellow-500' : 'bg-text/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.featured ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" className="hidden" name="featured" checked={formData.featured} onChange={handleChange} />
              <div>
                <div className="text-sm font-accent tracking-widest uppercase">Featured</div>
                <div className="text-xs font-body text-text/70">Highlight this project on the home/featured sections</div>
              </div>
            </label>

            <label className="flex items-center gap-4 cursor-pointer">
              <div className={`w-12 h-6 rounded-full transition-colors relative ${formData.showcase3D ? 'bg-primary' : 'bg-text/10'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${formData.showcase3D ? 'translate-x-7' : 'translate-x-1'}`} />
              </div>
              <input type="checkbox" className="hidden" name="showcase3D" checked={formData.showcase3D} onChange={handleChange} />
              <div>
                <div className="text-sm font-accent tracking-widest uppercase">3D Showcase</div>
                <div className="text-xs font-body text-text/70">Display this project in the immersive 3D scene</div>
              </div>
            </label>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#1a1a1c] border-t border-text/20 p-4 z-40 flex justify-between items-center px-6 lg:px-12">
        <button type="button" onClick={() => navigate('/admin/projects')} className="text-text/70 hover:font-accent uppercase tracking-widest text-sm transition-colors">
          Cancel
        </button>
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-6 py-3 border border-text/20 bg-transparent font-accent uppercase tracking-widest text-sm rounded hover:bg-text/10 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-8 py-3 bg-primary text-white font-accent uppercase tracking-widest text-sm rounded hover:bg-secondary transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            {loading && <span className="w-4 h-4 border-2 border-text/20 border-t-white rounded-full animate-spin"></span>}
            {mode === 'add' ? 'Publish Project' : 'Update Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
