// frontend/src/components/Projects/ProjectList/ProjectList.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import { getProjects } from "../../../services/projectService";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import "./ProjectList.css";
import MyProjectsSvg from "/assets/icons/project/MyProject.svg";
import leftArrowIcon from "/assets/icons/arrows/left-arrow.svg";
import rightArrowIcon from "/assets/icons/arrows/right-arrow.svg";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listContainerRef = useRef(null);

  // useCallback ile fonksiyonun gereksiz yere yeniden oluşmasını engelliyoruz.
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedData = await getProjects(); // Veriyi al

      // --- ÇÖZÜM: Gelen verinin bir dizi olup olmadığını kontrol et ---
      if (Array.isArray(fetchedData)) {
        setProjects(fetchedData); // Eğer bir dizi ise state'i güncelle
      } else {
        // Eğer dizi değilse, bu bir hata durumudur.
        console.error(
          "API'den beklenen format (dizi) gelmedi, gelen veri:",
          fetchedData
        );
        throw new Error("Projeler yüklenirken bir format hatası oluştu.");
      }
    } catch (err) {
      // Hata mesajını yakala ve state'e ata
      setError(
        err.message || "Projeler yüklenirken bilinmeyen bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  }, []); // Bağımlılığı olmadığı için boş dizi yeterli

  useEffect(() => {
    loadProjects();
  }, [loadProjects]); // loadProjects fonksiyonuna bağımlı hale getir

  const scrollList = (direction) => {
    if (listContainerRef.current) {
      const scrollAmount = listContainerRef.current.clientWidth * 0.8;
      listContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Yükleme durumu gösterimi
  if (loading) {
    return (
      <div className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="My Projects"
        />
        <div className="project-list-loading">
          <LoadingSpinner message="Projeler Yükleniyor..." />
        </div>
      </div>
    );
  }

  // Hata durumu gösterimi
  if (error) {
    return (
      <div className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="My Projects"
        />
        <div className="project-list-error">
          <ErrorMessage title="Projeler Yüklenemedi" message={error} />
        </div>
      </div>
    );
  }

  // Proje yoksa gösterilecek mesaj (Bu kısım .map'ten önce olduğu için hatayı engeller)
  if (projects.length === 0) {
    return (
      <div className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="My Projects"
        />
        <div className="project-list-empty">
          Henüz hiç proje eklenmemiş. Admin panelinden proje ekleyebilirsiniz.
        </div>
      </div>
    );
  }

  // Başarılı veri yükleme durumu
  return (
    <div className="project-list-section" id="projects-section">
      <img
        className="project-list-title-svg"
        src={MyProjectsSvg}
        alt="My Projects"
      />
      <div className="project-list-wrapper">
        <button
          className="scroll-button scroll-button-left"
          onClick={() => scrollList("left")}
          aria-label="Sola Kaydır"
        >
          <img src={leftArrowIcon} alt="Sol Ok" />
        </button>
        <div className="project-list-container" ref={listContainerRef}>
          {/* Bu kısma gelindiğinde 'projects'in bir dizi olduğu garantilenmiş olur. */}
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              title={project.title}
              description={project.description}
              image={project.imageUrl}
              link={project.liveUrl || project.githubUrl}
              tags={project.tags}
            />
          ))}
        </div>
        <button
          className="scroll-button scroll-button-right"
          onClick={() => scrollList("right")}
          aria-label="Sağa Kaydır"
        >
          <img src={rightArrowIcon} alt="Sağ Ok" />
        </button>
      </div>
    </div>
  );
};

export default ProjectList;
