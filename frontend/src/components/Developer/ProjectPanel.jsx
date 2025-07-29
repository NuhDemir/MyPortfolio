import React from "react";
import { motion } from "framer-motion";
import "./style/ProjectPanel.css";
import { Github, ExternalLink } from "lucide-react";

const ProjectPanel = ({ projects, onSelectProject }) => {
  return (
    <motion.div
      className="project-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <h3>Projelerim (Terminalden Seçim Yap)</h3>
      <div className="project-list">
        {projects.map((p) => (
          <motion.div
            key={p.id}
            className="project-item"
            whileHover={{ scale: 1.05 }}
            onClick={() => onSelectProject(p)}
          >
            <div className="project-item-header">
              <h4>{p.title}</h4>
              <div className="project-item-links">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} />
                  </a>
                )}
                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
            <p>{p.description}</p>
            <div className="project-item-tags">
              {p.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectPanel;
