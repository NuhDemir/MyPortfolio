// src/components/Projects/ProjectList/ProjectList.jsx
import React, { useState, useEffect, useRef } from "react";
import ProjectCard from "../ProjectCard/ProjectCard"; // Correct path
import {
  fetchUserRepos,
  fetchReadmeContent,
  extractFirstImageUrlFromReadme,
} from "../../../services/githubApi"; // Correct path
import LoadingSpinner from "../../common/LoadingSpinner"; // Correct path
import ErrorMessage from "../../common/ErrorMessage"; // Correct path
import "./ProjectList.css"; // Styles for the list itself
import MyProjectsSvg from "../../../assets/icons/MyProject.svg"; // Correct path
import leftArrowIcon from "../../../assets/icons/arrows/left-arrow.svg"; // Correct path
import rightArrowIcon from "../../../assets/icons/arrows/right-arrow.svg"; // Correct path

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const listContainerRef = useRef(null); // Ref for the scrollable container

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const repos = await fetchUserRepos();
        // Filter out forked repositories
        const filteredRepos = repos.filter(
          (repo) => !repo.fork && !repo.archived
        ); // Also filter archived

        // Fetch README image for each repo concurrently
        const projectsWithImages = await Promise.all(
          filteredRepos.map(async (repo) => {
            let imageUrl = null;
            try {
              const readmeContent = await fetchReadmeContent(repo.full_name);
              if (readmeContent) {
                imageUrl = extractFirstImageUrlFromReadme(readmeContent);
                // Basic absolute URL check (could be improved)
                if (imageUrl && !imageUrl.startsWith("http")) {
                  // Potentially construct full URL if needed, otherwise ignore relative
                  console.warn(
                    `README image for ${repo.name} might be relative: ${imageUrl}. Ignoring.`
                  );
                  imageUrl = null;
                }
              }
            } catch (readmeError) {
              // Log readme fetch error but continue
              console.error(
                `Error fetching README for ${repo.full_name}:`,
                readmeError
              );
            }

            return {
              id: repo.id,
              // Clean up repo names (replace hyphens/underscores with spaces)
              name: repo.name.replace(/-/g, " ").replace(/_/g, " "),
              description: repo.description,
              // Use fetched image, fallback to owner's avatar
              image: imageUrl || repo.owner?.avatar_url, // Add optional chaining for owner
              html_url: repo.html_url,
            };
          })
        );

        // Optional: Sort projects if needed, e.g., by name
        // projectsWithImages.sort((a, b) => a.name.localeCompare(b.name));

        setProjects(projectsWithImages);
      } catch (err) {
        // Catch errors from fetchUserRepos or Promise.all
        setError(
          err.message || "Projeler yüklenirken bilinmeyen bir hata oluştu."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []); // Run only once on component mount

  // Scrolling function
  const scrollList = (direction) => {
    if (listContainerRef.current) {
      // Calculate scroll amount (e.g., 80% of visible width)
      const scrollAmount = listContainerRef.current.clientWidth * 0.8;
      listContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // --- Render Logic ---
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

  // --- Main Render ---
  return (
    <div className="project-list-section" id="projects-section">
      <img
        className="project-list-title-svg"
        src={MyProjectsSvg}
        alt="My Projects"
      />

      {/* Wrapper contains the list and the scroll buttons */}
      <div className="project-list-wrapper">
        {/* Left Scroll Button */}
        <button
          className="scroll-button scroll-button-left"
          onClick={() => scrollList("left")}
          aria-label="Sola Kaydır"
        >
          <img src={leftArrowIcon} alt="Sol Ok" />
        </button>

        {/* Scrollable Project Card Container */}
        <div className="project-list-container" ref={listContainerRef}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              image={project.image} // Pass the resolved image URL
              link={project.html_url}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
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
