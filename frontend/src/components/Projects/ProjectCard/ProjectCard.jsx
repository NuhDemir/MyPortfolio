import React from "react";
import { ArrowUpRight } from "lucide-react";
import "./ProjectCard.css";
import imageSvg from "/assets/icons/img/image.svg";

const ProjectCard = ({ project, onClick }) => {
  const { title, description, imageUrl, tags } = project;
  const imageSource = imageUrl || imageSvg;
  const primaryTag = tags[0] || "Proje";

  return (
    <div className="project-card-v2-wrapper" onClick={() => onClick(project)}>
      <div className="project-card-v2">
        <div className="project-card-v2-image-container">
          <img
            src={imageSource}
            alt={`${title} Proje Görseli`}
            className="project-card-v2-image"
          />
        </div>
        <div className="project-card-v2-content">
          <div className="project-card-v2-tags">
            {tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="project-card-v2-tag">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="project-card-v2-title">{title}</h3>
          <p className="project-card-v2-description">{description}</p>
          <div className="project-card-v2-footer">
            <span>Detayları Gör</span>
            <ArrowUpRight size={20} className="project-card-v2-arrow" />
          </div>
        </div>
      </div>
      <div className="project-card-v2-primary-tag">{primaryTag}</div>
    </div>
  );
};

export default ProjectCard;
