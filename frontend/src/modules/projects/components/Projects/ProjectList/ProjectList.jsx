import React from "react";
import { useNavigate } from "react-router-dom";
import ProjectListHeader from "./ProjectListHeader.jsx";
import { useProjectData } from "@modules/projects/hooks/useProjectData.js";
import { useProjectAudio } from "@modules/projects/hooks/useProjectAudio.js";
import { useProjectListGsapAnimation } from "@modules/projects/hooks/useProjectListGsapAnimation.js";
import { useProjectViewer } from "@modules/projects/features/ProjectViewer/hooks/useProjectViewer.js";
import ProjectTV from "@modules/projects/features/ProjectViewer/components/ProjectTV/ProjectTV.jsx";
import ProjectRemote from "@modules/projects/features/ProjectViewer/components/ProjectRemote/ProjectRemote.jsx";
import "./ProjectList.css";

const ProjectList = () => {
  const navigate = useNavigate();
  const projects = useProjectData({
    searchQuery: "",
    statusFilter: "all",
    platformFilter: "all",
    featuredOnly: false,
  });
  const { playPop, playArcade } = useProjectAudio();
  const viewer = useProjectViewer({ projects });
  const { sectionRef } = useProjectListGsapAnimation({
    activeIndex: viewer.activeIndex,
    isOn: viewer.isOn,
  });

  const handleGoToChannel = (index) => {
    playPop();
    viewer.goTo(index);
  };

  const handlePrev = () => {
    playPop();
    viewer.prev();
  };

  const handleNext = () => {
    playPop();
    viewer.next();
  };

  const handleTogglePower = () => {
    playArcade();
    viewer.toggle();
  };

  const openProjectLink = (url) => {
    if (!url) return;
    playArcade();

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="project-list-section" id="projects-section" ref={sectionRef}>
      <h2 className="visually-hidden">Projelerim</h2>

      <ProjectListHeader />

      <div className="project-viewer-layout">
        <ProjectTV
          project={viewer.project}
          isOn={viewer.isOn}
          activeIndex={viewer.activeIndex}
          total={viewer.total}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <ProjectRemote
          project={viewer.project}
          total={viewer.total}
          activeIndex={viewer.activeIndex}
          isOn={viewer.isOn}
          onToggle={handleTogglePower}
          onGoTo={handleGoToChannel}
          onPrev={handlePrev}
          onNext={handleNext}
          onOpenAllProjects={() => navigate("/projects")}
          onOpenDemo={() =>
            openProjectLink(
              viewer.project?.links?.liveDemo || viewer.project?.liveUrl,
            )
          }
          onOpenRepo={() =>
            openProjectLink(
              viewer.project?.links?.github || viewer.project?.githubUrl,
            )
          }
        />
      </div>
    </section>
  );
};

export default ProjectList;
