import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import projectsData from "../../data/developerProjects.json";
import ProjectModal from "../common/ProjectModal"; // Modal yolunu kontrol edin
import { ExternalLink } from "lucide-react";
import "./style/RecruiterProjectGrid.css";

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: { y: -20, opacity: 0 },
};

// Projelerdeki tüm etiketlerden benzersiz bir filtre listesi oluştur
const allTags = ["Tümü", ...new Set(projectsData.flatMap((p) => p.tags))];

const RecruiterProjectGrid = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tümü");

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Filtrelenmiş projeleri hesapla. `useMemo` ile gereksiz yeniden hesaplamaları önle.
  const filteredProjects = useMemo(() => {
    if (activeFilter === "Tümü") {
      return projectsData;
    }
    return projectsData.filter((project) =>
      project.tags.includes(activeFilter)
    );
  }, [activeFilter]);

  return (
    <>
      <div className="recruiter-projects-container">
        {/* Filtreleme Butonları */}
        <div className="project-filters">
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`filter-chip ${activeFilter === tag ? "active" : ""}`}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Proje Grid'i */}
        <motion.div
          layout // Bu prop, elemanlar eklendiğinde/çıkarıldığında animasyonlu sıralama yapar
          className="recruiter-project-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                className="recruiter-project-card-wrapper"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => handleCardClick(project)}
              >
                <div className="recruiter-project-card">
                  <div className="card-image-container">
                    <img
                      src={project.imageUrl}
                      alt={`${project.title} Projesi`}
                    />
                    <div className="card-image-overlay">
                      <ExternalLink size={32} />
                      <span>Detayları Gör</span>
                    </div>
                  </div>
                  <div className="card-content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="card-tags">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default RecruiterProjectGrid;
