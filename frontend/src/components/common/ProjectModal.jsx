import React, { useEffect } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import "./style/ProjectModal.css";

const ProjectModal = ({ project, isOpen, onClose }) => {
  // Modal açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Component unmount olduğunda stili temizle
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC tuşu ile modalı kapat
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Eğer açık değilse veya proje verisi yoksa, null render et
  if (!isOpen || !project) return null;

  return (
    // Overlay: Arkadaki içeriği karartır
    <div className="project-modal-overlay" onClick={onClose}>
      {/* Modal'ın kendisi: Tıklamaların overlay'e gitmesini engeller */}
      <div
        className="project-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Başlığı ve Kapatma Butonu */}
        <div className="project-modal-header">
          <h2 className="project-modal-title">{project.title}</h2>
          <button
            className="project-modal-close-btn"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal İçeriği */}
        <div className="project-modal-content">
          <div className="project-modal-image-wrapper">
            <img src={project.imageUrl} alt={`${project.title} görseli`} />
          </div>
          <div className="project-modal-details">
            <div
              className="project-modal-description"
              dangerouslySetInnerHTML={{ __html: project.details }}
            />

            <div className="project-modal-tags-section">
              <h4>Teknolojiler</h4>
              <div className="project-modal-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="project-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-modal-links">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <ExternalLink size={18} />
                  <span>Siteyi Ziyaret Et</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <Github size={18} />
                  <span>GitHub Reposu</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
