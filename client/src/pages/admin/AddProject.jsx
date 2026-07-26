import React from 'react';
import ProjectForm from '../../components/admin/ProjectForm';
import { motion } from 'framer-motion';

const AddProject = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ProjectForm mode="add" />
    </motion.div>
  );
};

export default AddProject;
