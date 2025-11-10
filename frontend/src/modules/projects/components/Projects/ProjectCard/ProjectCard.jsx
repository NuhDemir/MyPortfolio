import React, { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import "./ProjectCard.css";
import imageSvg from "/assets/icons/img/image.svg";

// React.memo ile gereksiz re-render engelleniyor
const ProjectCard = React.memo(({ project, onClick }) => {
  const { title, description, tags = [], imageUrl } = project;

  // Eğer imageUrl varsa onu kullan, yoksa varsayılan svg
  const imageSource = imageUrl || imageSvg;

  // İlk 3 tag'ı useMemo ile optimize et
  const displayTags = useMemo(() => tags.slice(0, 3), [tags]);

  const handleActivate = () => onClick(project);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate();
    }
  };

  const handleCtaClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleActivate();
  };

  return (
    <div
      className="project-card-v2-wrapper"
      onClick={handleActivate}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown} // klavye erişilebilirliği
      aria-label={`${title} projesinin detaylarını aç`}
    >
      <div className="project-card-v2">
        <div className="project-card-v2-image-container">
          <img
            src={imageSource}
            alt={`${title} Proje Görseli`}
            className="project-card-v2-image"
            loading="lazy" // lazy load
            width={300} // performans için genişlik
            height={200} // performans için yükseklik
            onError={(e) => {
              e.currentTarget.src = imageSvg; // fallback
            }}
          />
        </div>
        <div className="project-card-v2-content">
          <div className="project-card-v2-tags">
            {displayTags.map((tag, index) => (
              <span key={index} className="project-card-v2-tag">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="project-card-v2-title">{title}</h3>
          <p className="project-card-v2-description">{description}</p>
          <button
            type="button"
            className="project-card-v2-cta"
            onClick={handleCtaClick}
          >
            <span>Detayları Gör</span>
            <ArrowUpRight size={18} className="project-card-v2-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
