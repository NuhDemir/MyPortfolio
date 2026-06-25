import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    filterOptions,
    allTags,
    clearFilters,
  } = useProjectFilters();

  const { projects, processed } = useProjectData({ filters });
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

  return (
    <main className="prj-page">
      <header className="prj-page__header">
        <button type="button" className="prj-page__back" onClick={() => navigate("/")}>
          ← Ana Sayfa
        </button>
        <h1 className="prj-page__title">Projeler</h1>
      </header>

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

      {allTags.length > 0 && (
        <TagCloud tags={allTags} selectedTags={selectedTags} onToggle={toggleTag} />
      )}

      {heroProject && nonHeroProjects.length > 0 && (
        <ProjectHero
          project={heroProject}
          onOpen={() => handleProjectClick(heroProject)}
          liked={likedMap[heroProject.id]}
          onLike={() => handleLike(heroProject.id)}
          views={viewMap[heroProject.id]}
        />
      )}

      <ProjectGrid
        projects={heroProject && nonHeroProjects.length > 0 ? nonHeroProjects : processed}
        loading={false}
        visibleItems={visibleItems}
        setVisibleItems={setVisibleItems}
        totalCount={nonHeroProjects.length || processed.length}
        onProjectClick={handleProjectClick}
        likedMap={likedMap}
        onLike={handleLike}
        viewMap={viewMap}
      />
    </main>
  );
};

export default ProjectsPage;
