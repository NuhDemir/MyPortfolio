import React, { useState, useRef } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
// Modal bileşeninin projenizdeki doğru yolunu belirttiğinizden emin olun
import ProjectModal from "../../common/ProjectModal";
import "./ProjectList.css";
import projectsData from "../../../data/projectData.json";

// İkonlar ve Başlık SVG'si
import MyProjectsSvg from "/assets/icons/project/MyProject.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProjectList = () => {
  // --- MEVCUT HOOK'LAR ---
  const listContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- YENİ EKLENEN SES YÖNETİMİ ---
  // public klasöründeki ses dosyalarına referanslar oluşturuluyor.
  // useRef, her render'da yeni bir Audio nesnesi oluşturulmasını engeller.
  const popSoundRef = useRef(new Audio("/audio/hover-click.mp3"));
  const arcadeSoundRef = useRef(new Audio("/audio/arcade.mp3"));

  // Ses çalma işlemini basitleştiren yardımcı fonksiyon
  const playSound = (audioRef) => {
    // Sesi başa sararak art arda tıklamalarda çalmasını sağlar
    audioRef.current.currentTime = 0;
    // Sesi çal ve olası tarayıcı politikası hatalarını yakala
    audioRef.current.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
  };

  // --- GÜNCELLENEN FONKSİYONLAR ---

  // Bir proje kartına tıklandığında modal'ı açar ve "arcade" sesini çalar
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
            {/* 
              Not: İkonun etrafındaki fazladan div kaldırıldı. 
              Doğrudan ikona class vermek daha temiz bir yapıdır.
            */}
            <ChevronLeft size={28} className="icon" />
          </button>

          {/* Proje Kartlarının Bulunduğu Kaydırılabilir Alan */}
          <div className="project-list-container" ref={listContainerRef}>
            {projectsData.map((project) => (
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
