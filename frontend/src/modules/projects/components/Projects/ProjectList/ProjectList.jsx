import React, { useState, useRef, useEffect, useMemo } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import ProjectModal from "@shared/ui/ProjectModal.jsx";
import "./ProjectList.css";
import projectsData from "@modules/projects/data/projectData.json";

// İkonlar ve Başlık SVG'si
import MyProjectsSvg from "/assets/icons/project/MyProject.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProjectList = () => {
  // --- MEVCUT HOOK'LAR ---
  const listContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ses dosyaları için ref
  const popSoundRef = useRef(null);
  const arcadeSoundRef = useRef(null);

  // Sesleri preload et
  useEffect(() => {
    popSoundRef.current = new Audio("/audio/hover-click.mp3");
    arcadeSoundRef.current = new Audio("/audio/arcade.mp3");

    popSoundRef.current.preload = "auto";
    arcadeSoundRef.current.preload = "auto";
  }, []);

  // Ses çalma işlemini basitleştiren yardımcı fonksiyon
  const playSound = (audioRef) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .catch((error) => console.error("Audio playback failed:", error));
  };

  const handleCardClick = (project) => {
    playSound(arcadeSoundRef); // Arcade sesini çal
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  // Modal'ı kapatır ve seçili projeyi sıfırlar
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  // Ok butonlarına tıklandığında listeyi kaydırır ve "pop" sesini çalar
  const scrollList = (direction) => {
    playSound(popSoundRef); // Pop sesini çal
    if (listContainerRef.current) {
      const scrollAmount = listContainerRef.current.clientWidth * 0.75;
      listContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Project listesi için useMemo — yeniden render’da gereksiz map engellenir
  const projects = useMemo(() => projectsData, []);

  return (
    <>
      <section className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="Projelerim Başlığı"
        />
        <div className="project-list-wrapper">
          {/* Sola Kaydırma Butonu */}
          <button
            className="scroll-button-v2 scroll-button-left"
            onClick={() => scrollList("left")}
            aria-label="Sola Kaydır"
          >
            <ChevronLeft size={28} className="icon" />
          </button>

          {/* Proje Kartlarının Bulunduğu Kaydırılabilir Alan */}
          <div className="project-list-container" ref={listContainerRef}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleCardClick(project)}
              />
            ))}
          </div>

          {/* Sağa Kaydırma Butonu */}
          <button
            className="scroll-button-v2 scroll-button-right"
            onClick={() => scrollList("right")}
            aria-label="Sağa Kaydır"
          >
            <ChevronRight size={28} className="icon" />
          </button>
        </div>
      </section>

      {/* Proje Detaylarını Gösteren Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectList;
