import React, { useMemo } from "react";
import "./ProjectTVScreen.css";

const getStatus = (project) =>
  project?.metadata?.status || project?.status || "active";

const getPlatform = (project) =>
  project?.metadata?.platform || project?.platform || "general";

const getTitle = (project) =>
  project?.metadata?.title || project?.title || "Untitled Project";

const getDescription = (project) =>
  project?.metadata?.tagline ||
  project?.description ||
  "Bu kanal icin aciklama bulunamadi.";

const getBackgroundImage = (project) =>
  project?.visuals?.thumbnailUrl || project?.imageUrl || "";

const getTechStack = (project) => {
  if (Array.isArray(project?.tags) && project.tags.length > 0) {
    return project.tags.slice(0, 6);
  }

  if (Array.isArray(project?.technologies) && project.technologies.length > 0) {
    return project.technologies
      .map((item) => (typeof item === "string" ? item : item?.name))
      .filter(Boolean)
      .slice(0, 6);
  }

  return ["stack-bilinmiyor"];
};

const formatBadge = (value) => String(value || "").trim().toLowerCase();

const StarDoodle = () => (
  <svg
    className="project-tv-screen__doodle project-tv-screen__doodle--star"
    viewBox="0 0 40 40"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20 4 L24 14 L35 14 L26 21 L30 33 L20 26 L10 33 L14 21 L5 14 L16 14 Z"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  </svg>
);

const DotsDoodle = () => (
  <svg
    className="project-tv-screen__doodle project-tv-screen__doodle--dots"
    viewBox="0 0 56 34"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="8"
      cy="10"
      r="5"
      fill="var(--color-primary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="27"
      cy="22"
      r="4"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="47"
      cy="11"
      r="5.5"
      fill="var(--color-secondary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
  </svg>
);

const ProjectTVScreen = ({ project, isOn }) => {
  const techStack = useMemo(() => getTechStack(project), [project]);
  const backgroundImage = useMemo(() => getBackgroundImage(project), [project]);

  if (!isOn) {
    return (
      <section className="project-tv-screen project-tv-screen--off" role="status">
        <div className="project-tv-screen__panel">
          <p className="project-tv-screen__off-text">TV OFF</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section
        className="project-tv-screen project-tv-screen--empty"
        role="status"
      >
        <div className="project-tv-screen__panel">
          <p className="project-tv-screen__empty-text">Sinyal bulunamadi</p>
        </div>
      </section>
    );
  }

  return (
    <section className="project-tv-screen" aria-live="polite">
      <div className="project-tv-screen__panel">
        {backgroundImage ? (
          <div
            className="project-tv-screen__image-layer"
            style={{ "--project-bg-image": `url("${backgroundImage}")` }}
            aria-hidden="true"
          />
        ) : null}

        <StarDoodle />
        <DotsDoodle />

        <div className="project-tv-screen__content">
          <header className="project-tv-screen__header">
            <h3 className="project-tv-screen__title">{getTitle(project)}</h3>
            <div className="project-tv-screen__badges">
              <span className="naive-tag project-tv-screen__badge">
                {formatBadge(getStatus(project))}
              </span>
              <span className="naive-tag project-tv-screen__badge">
                {formatBadge(getPlatform(project))}
              </span>
            </div>
          </header>

          <p className="project-tv-screen__description">{getDescription(project)}</p>

          <ul className="project-tv-screen__tech-list" aria-label="Tech stack">
            {techStack.map((tech) => (
              <li key={tech} className="project-tv-screen__tech-item">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ProjectTVScreen;
