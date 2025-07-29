import React, { useState } from "react";
import { motion } from "framer-motion";
import projectsData from "../../data/developerProjects.json";
import ProjectModal from "../common/ProjectModal"; // Developer modundaki modalı yeniden kullanıyoruz
import "./style/RecruiterProjectGrid.css";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Kartların peş peşe gelmesini sağlar
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const RecruiterProjectGrid = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div
        className="recruiter-project-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projectsData.map((project) => (
          <motion.div
            key={project.id}
            className="recruiter-project-card"
            variants={itemVariants}
            onClick={() => handleCardClick(project)}
            whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
          >
            <div className="card-image-container">
              <img src={project.imageUrl} alt={`${project.title} Projesi`} />
            </div>
            <div className="card-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="card-tags">
                {project.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default RecruiterProjectGrid;
