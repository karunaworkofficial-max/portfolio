import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from '../../components/admin/ProjectForm';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const EditProject = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/admin/${id}`);
        setProject(data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="text-text font-accent uppercase tracking-widest animate-pulse p-8">Loading project data...</div>;
  if (!project) return <div className="text-red-500 font-accent uppercase tracking-widest p-8">Project not found.</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ProjectForm mode="edit" initialData={project} />
    </motion.div>
  );
};

export default EditProject;
