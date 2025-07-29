import React, { useState, useRef } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import ProjectModal from "../../common/ProjectModal"; // Yeni modalı import et
import "./ProjectList.css";
import projectsData from "../../../data/projectData.json";

import MyProjectsSvg from "/assets/icons/project/MyProject.svg";
import { ChevronLeft, ChevronRight } from "lucide-react"; // lucide-react ikonları

const ProjectList = () => {
  const listContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const scrollList = (direction) => {
    if (listContainerRef.current) {
      const scrollAmount = listContainerRef.current.clientWidth * 0.75;
      listContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="My Projects"
        />
        <div className="project-list-wrapper">
          <button
            className="scroll-button-v2 scroll-button-left"
            onClick={() => scrollList("left")}
            aria-label="Sola Kaydır"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="project-list-container" ref={listContainerRef}>
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleCardClick}
              />
            ))}
          </div>
          <button
            className="scroll-button-v2 scroll-button-right"
            onClick={() => scrollList("right")}
            aria-label="Sağa Kaydır"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectList;
