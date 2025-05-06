// src/components/ProjectCard/ProjectCard.jsx
// Bu dosyada değişiklik yapmaya GEREK YOK. Önceki haliyle kalabilir.
import React from "react";
import "./ProjectCard.css";
import GoToProjectArrowSvg from "../../../assets/icons/project/GoToProjectArrow.svg";
import imageSvg from "../../../assets/img/image.svg";
// import borderSvg from "../../../assets/icons/project/border.svg";

const ProjectCard = ({
  title = "Proje Başlığı",
  description = "Proje açıklaması buraya gelecek.",
  link = "#",
  image,
}) => {
  const imageSource = image || imageSvg;

  return (
    <div className="project-card-wrapper">
      {/* <img
        className="project-card-border"
        src={borderSvg}
        alt=""
        aria-hidden="true"
      /> */}
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
          {/* Açıklama metni olduğu gibi kalıyor */}
          <p className="project-card-description">
            {description || "Açıklama mevcut değil."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
