import React from "react";
import "./ProjectCard.css";
import GoToProjectArrowSvg from "../../../assets/icons/project/GoToProjectArrow.svg";
import imageSvg from "../../../assets/img/image.svg";
import borderSvg from "../../../assets/icons/project/border.svg";

const ProjectCard = ({ title, description, link }) => {
  return (
    <div className="project-card-wrapper">
      <img className="project-card-border" src={borderSvg} alt="card border" />
      <div className="project-card">
        <img src={imageSvg} alt={title} className="project-card-image" />
        <div className="project-card-content">
          <div className="project-card-header">
            <h3 className="project-card-title">{title}</h3>
            <a
              href={link}
              className="project-card-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={GoToProjectArrowSvg}
                alt="Go to Project"
                className="icon"
              />
            </a>
          </div>
          <p className="project-card-description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
