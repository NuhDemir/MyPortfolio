// src/components/Projects/ProjectList/ProjectList.jsx
import React, { useState, useEffect, useRef } from "react";
import ProjectCard from "../ProjectCard/ProjectCard";
import {
  fetchUserRepos,
  fetchReadmeContent,
  extractFirstImageUrlFromReadme,
} from "../../../services/githubApi";
import LoadingSpinner from "../../common/LoadingSpinner";
import ErrorMessage from "../../common/ErrorMessage";
import "./ProjectList.css";
import MyProjectsSvg from "../../../assets/icons/MyProject.svg";
import leftArrowIcon from "../../../assets/icons/arrows/left-arrow.svg";
import rightArrowIcon from "../../../assets/icons/arrows/right-arrow.svg";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listContainerRef = useRef(null);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const repos = await fetchUserRepos();
        const filteredRepos = repos.filter(
          (repo) => !repo.fork && !repo.archived
        );

        const projectsWithImages = await Promise.all(
          filteredRepos.map(async (repo) => {
            let imageUrl = null;
            try {
              const readmeContent = await fetchReadmeContent(repo.full_name);
              if (readmeContent) {
                imageUrl = extractFirstImageUrlFromReadme(readmeContent);
                if (imageUrl && !imageUrl.startsWith("http")) {
                  console.warn(
                    `README image for ${repo.name} might be relative: ${imageUrl}. Assuming it's in the repo assets.`
                  );
                  // Eğer göreceli ise ve GitHub'da doğru bir şekilde gösteriliyorsa,
                  // repo'nun html_url'sinden veya raw content URL'sinden tam bir URL oluşturmak gerekebilir.
                  // Şimdilik basit bir kontrol yapıyoruz.
                  // imageUrl = `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${imageUrl.startsWith('./') ? imageUrl.substring(2) : imageUrl}`;
                  // Bu satır karmaşıklaşabilir, README'deki resimlerin mutlak URL'ler olması en iyisidir.
                  // Şimdilik null bırakıp, fallback avatarı kullanmasını sağlayalım.
                  imageUrl = null;
                }
              }
            } catch (readmeError) {
              console.error(
                `Error fetching README for ${repo.full_name}:`,
                readmeError
              );
            }

            return {
              id: repo.id,
              name: repo.name.replace(/-/g, " ").replace(/_/g, " "),
              description: repo.description,
              image: imageUrl || repo.owner?.avatar_url,
              html_url: repo.html_url,
            };
          })
        );
        setProjects(projectsWithImages);
      } catch (err) {
        setError(
          err.message || "Projeler yüklenirken bilinmeyen bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const scrollList = (direction) => {
    if (listContainerRef.current) {
      const scrollAmount = listContainerRef.current.clientWidth * 0.8;
      listContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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

  if (projects.length === 0) {
    return (
      <div className="project-list-section" id="projects-section">
        <img
          className="project-list-title-svg"
          src={MyProjectsSvg}
          alt="My Projects"
        />
        <div className="project-list-empty">
          GitHub'da gösterilecek proje bulunamadı.
        </div>
      </div>
    );
  }

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
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              image={project.image}
              link={project.html_url}
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