import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollReveal } from "@shared";
import { useProjectData } from "../hooks/useProjectData.js";
import { useProjectFilters } from "../hooks/useProjectFilters.js";
import { getProjectRouteParam, isProjectFeatured } from "../utils/projectFormatters.js";
import { toggleLike, isLiked } from "../utils/analytics.js";
import ProjectHero from "../components/ProjectHero/ProjectHero.jsx";
import ProjectFilters from "../components/ProjectFilters/ProjectFilters.jsx";
import TagCloud from "../components/TagCloud/TagCloud.jsx";
import ProjectGrid from "../components/ProjectGrid/ProjectGrid.jsx";
import "./styles/projects-page.css";

const ProjectsPage = () => {
  const navigate = useNavigate();

  const {
    query, setQuery,
    status, setStatus,
    platform, setPlatform,
    difficulty, setDifficulty,
    sortKey, setSortKey,
    featuredOnly, setFeaturedOnly,
    caseStudyOnly, setCaseStudyOnly,
    selectedTags, toggleTag,
    visibleItems, setVisibleItems,
    filters,
    clearFilters,
  } = useProjectFilters();

  const { projects, processed, filterOptions, allTags } = useProjectData({ filters });
  const [likedMap, setLikedMap] = useState({});
  const [viewMap, setViewMap] = useState({});

  useEffect(() => {
    const liked = {};
    for (const p of processed) {
      if (p?.id) liked[p.id] = isLiked(p.id);
    }
    setLikedMap(liked);
  }, [processed]);

  const heroProject = processed.find(isProjectFeatured) || processed[0] || null;
  const nonHeroProjects = heroProject ? processed.filter((p) => p !== heroProject) : processed;

  const handleProjectClick = (project) => {
    const param = getProjectRouteParam(project);
    if (!param) return;
    navigate(`/projects/${encodeURIComponent(param)}`);
  };

  const handleLike = (projectId) => {
    const result = toggleLike(projectId);
    setLikedMap((prev) => ({ ...prev, [projectId]: result.liked }));
    setViewMap((prev) => ({ ...prev, [projectId]: result.count }));
  };

  const handleClearFilters = () => {
    clearFilters();
    setVisibleItems(6);
  };

  const revHeader = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });
  const revFilters = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 });
  const revTags = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.2 });
  const revHero = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.3 });
  const revGrid = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.4 });

  return (
    <main className="prj-page">
      <motion.header className="prj-page__header" {...revHeader}>
        <button type="button" className="prj-page__back" onClick={() => navigate("/")}>
          ← Ana Sayfa
        </button>
        <h1 className="prj-page__title">Projeler</h1>
      </motion.header>

      <motion.div {...revFilters}>
        <ProjectFilters
          query={query} setQuery={setQuery}
          status={status} setStatus={setStatus}
          platform={platform} setPlatform={setPlatform}
          difficulty={difficulty} setDifficulty={setDifficulty}
          sortKey={sortKey} setSortKey={setSortKey}
          featuredOnly={featuredOnly} setFeaturedOnly={setFeaturedOnly}
          caseStudyOnly={caseStudyOnly} setCaseStudyOnly={setCaseStudyOnly}
          filterOptions={filterOptions}
          clearFilters={handleClearFilters}
          resultCount={processed.length}
        />
      </motion.div>

      {allTags.length > 0 && (
        <motion.div {...revTags}>
          <TagCloud tags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />
        </motion.div>
      )}

      {heroProject && (
        <motion.section {...revHero}>
          <ProjectHero
            project={heroProject}
            onOpen={() => handleProjectClick(heroProject)}
            liked={likedMap[heroProject.id]}
            onLike={() => handleLike(heroProject.id)}
            views={viewMap[heroProject.id]}
          />
        </motion.section>
      )}

      {nonHeroProjects.length > 0 && (
        <motion.section {...revGrid}>
          <ProjectGrid
            projects={nonHeroProjects}
            loading={false}
            visibleItems={visibleItems}
            setVisibleItems={setVisibleItems}
            totalCount={nonHeroProjects.length}
            onProjectClick={handleProjectClick}
            likedMap={likedMap}
            onLike={handleLike}
            viewMap={viewMap}
          />
        </motion.section>
      )}
    </main>
  );
};

export default ProjectsPage;
