// src/components/Projects/ProjectCard/ProjectCard.jsx
import React from "react";
import "./ProjectCard.css"; // CSS dosyasının adı doğru olmalı, eğer farklıysa düzeltin
import GoToProjectArrowSvg from "/assets/icons/project/GoToProjectArrow.svg";
import imageSvg from "/assets/icons/img/image.svg"; // Varsayılan görsel için

const ProjectCard = ({
  title = "Proje Başlığı",
  description = "Proje açıklaması buraya gelecek.",
  link = "#",
  image, // Bu prop GitHub'dan gelen görsel URL'si olacak
}) => {
  const imageSource = image || imageSvg; // Eğer GitHub'dan görsel gelmezse varsayılanı kullan

  return (
    <div className="project-card-wrapper">
      <div className="project-card">
        <div className="project-card-image-container">
          <img
            src={imageSource}
            alt={`${title} Proje Görseli`}
            className="project-card-image"
          />
        </div>
        <div className="project-card-content">
          <div className="project-card-header">
            <h3 className="project-card-title" title={title}>
              {title}
            </h3>
            <a
              href={link}
              className="project-card-link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} projesine git`}
            >
              <img
                src={GoToProjectArrowSvg}
                alt="Projeye Git"
                className="project-link-icon"
              />
            </a>
          </div>
          <p className="project-card-description">
            {description || "Açıklama mevcut değil."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
