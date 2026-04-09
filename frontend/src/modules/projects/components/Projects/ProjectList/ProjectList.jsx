import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../ProjectCard/ProjectCard";
import ProjectListMenu from "./ProjectListMenu.jsx";
import ProjectModal from "@shared/ui/ProjectModal.jsx";
import "./ProjectList.css";
import {
  FALLBACK_PROJECTS as fallbackProjects,
  fetchProjects,
} from "@modules/projects/services/projectService.js";

// İkonlar ve Başlık SVG'si
const MY_PROJECTS_SVG_PATH = "/assets/icons/project/MyProject.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProjectList = () => {
  const navigate = useNavigate();

  // --- MEVCUT HOOK'LAR ---
  const listContainerRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState(fallbackProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const filters = {
      q: searchQuery,
      status: statusFilter,
      platform: platformFilter,
      featured: featuredOnly ? true : undefined,
    };

    const loadProjects = async () => {
      try {
        const response = await fetchProjects({
          signal: controller.signal,
          filters,
          includeSource: true,
        });
        if (!isMounted) return;

        const data = Array.isArray(response?.items) ? response.items : [];
        const nextProjects =
          Array.isArray(data) && data.length > 0 ? data : fallbackProjects;

        setProjects(nextProjects);
      } catch {
        if (!isMounted) return;
        setProjects(fallbackProjects);
      }
    };

    loadProjects();

    const intervalId = window.setInterval(
      () => {
        if (!isMounted) return;
        loadProjects();
      },
      5 * 60 * 1000,
    );

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, [featuredOnly, platformFilter, searchQuery, statusFilter]);

  const platformOptions = React.useMemo(() => {
    const options = new Set();
    fallbackProjects.forEach((project) => {
      const platform =
        project?.metadata?.platform || project?.platform || project?.category;
      if (platform && String(platform).trim()) {
        options.add(String(platform).trim());
      }
    });
    return ["all", ...Array.from(options).sort((a, b) => a.localeCompare(b))];
  }, []);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPlatformFilter("all");
    setFeaturedOnly(false);
  };

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
  return (
    <>
      <section className="project-list-section" id="projects-section">
        <h2 className="visually-hidden">Projelerim</h2>
        <img
          className="project-list-title-svg"
          src={MY_PROJECTS_SVG_PATH}
          alt="Projelerim Başlığı"
          width={503}
          height={109}
        />
        <ProjectListMenu
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformFilterChange={setPlatformFilter}
          platformOptions={platformOptions}
          featuredOnly={featuredOnly}
          onFeaturedOnlyChange={setFeaturedOnly}
          onClearFilters={clearFilters}
          onOpenAllProjects={() => navigate("/projects")}
        />

        {/* Eğer backend yoksa sessizce fallback gösteriyoruz; hata UI'sı yok */}
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
            {projects.map((project) => {
              const projectKey =
                project.id || project._id || project.slug || project.title;

              return (
                <ProjectCard
                  key={projectKey}
                  project={project}
                  onClick={() => handleCardClick(project)}
                />
              );
            })}
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
