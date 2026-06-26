import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsData } from "./skillsData.jsx";
import { useProjectData } from "@features/projects/hooks/useProjectData.js";
import "./style/RecruiterSkills.css";

const SkillDetailPanel = ({ skill, projectsData }) => {
  if (!skill) return null;

  const relatedProjects = projectsData.filter((p) =>
    skill.projectIds.includes(p.id)
  );

  return (
    <motion.div
      className="skill-detail-panel"
      initial={{ opacity: 0, height: 0, marginTop: 0 }}
      animate={{ opacity: 1, height: "auto", marginTop: "var(--spacing-md)" }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <p className="skill-description">{skill.description}</p>
      {relatedProjects.length > 0 && (
        <div className="related-projects">
          <strong>İlgili Projeler:</strong>
          {relatedProjects.map((p) => (
            <span key={p.id} className="related-project-tag">
              {p.title}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

const RecruiterSkills = () => {
  const { projects: projectsData } = useProjectData();
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSkill, setSelectedSkill] = useState(null);

  const filters = ["All", ...skillsData.map((data) => data.category)];

  const handleSkillClick = (skill) => {
    // Tıklanan skill zaten seçiliyse, seçimi kaldır. Değilse, seç.
    setSelectedSkill((prev) => (prev?.name === skill.name ? null : skill));
  };

  return (
    <motion.div
      className="recruiter-skills-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="skills-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
            onClick={() => {
              setActiveFilter(filter);
              setSelectedSkill(null); // Filtre değiştiğinde detay panelini kapat
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="skills-content">
        {skillsData.map((categoryData) => (
          <motion.div
            key={categoryData.category}
            className="skill-category-v2"
            animate={{
              opacity:
                activeFilter === "All" || activeFilter === categoryData.category
                  ? 1
                  : 0.3,
            }}
            transition={{ duration: 0.3 }}
          >
            <h3>{categoryData.category}</h3>
            <motion.div className="skills-grid" layout>
              {categoryData.skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  className={`skill-badge ${
                    selectedSkill?.name === skill.name ? "selected" : ""
                  }`}
                  onClick={() => handleSkillClick(skill)}
                  layout
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="skill-icon">{skill.icon}</div>
                  <span className="skill-name">{skill.name}</span>
                </motion.div>
              ))}
            </motion.div>

            <AnimatePresence>
              {selectedSkill &&
                categoryData.skills.some(
                  (s) => s.name === selectedSkill.name
                ) && <SkillDetailPanel skill={selectedSkill} projectsData={projectsData} />}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecruiterSkills;
