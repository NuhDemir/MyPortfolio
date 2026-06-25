import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@core";
import { ProjectCard } from "@features/projects";
import {
  FALLBACK_PROJECTS as fallbackProjects,
  fetchProjects,
} from "@features/projects/services/projectService.js";
import "./ProjectsPage.css";

const REQUEST_REFRESH_INTERVAL_MS = 5 * 60 * 1000;
const PROJECTS_PAGE_SIZE = 3;

const isProjectFeatured = (project) =>
  project?.isFeatured === true || project?.featured === true;

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const getProjectTitle = (project) =>
  project?.metadata?.title || project?.title || "";

const getProjectDescription = (project) =>
  project?.metadata?.tagline || project?.description || "";

const getProjectPlatform = (project) =>
  project?.metadata?.platform || project?.platform || "";

const getProjectStatus = (project) =>
  project?.metadata?.status || project?.status || "";

const getProjectCreatedAt = (project) =>
  project?.metadata?.createdAt || project?.createdAt || "";

const hasCaseStudy = (project) => {
  const cs = project?.caseStudy;
  if (!cs || typeof cs !== "object") return false;
  return Boolean(
    cs?.problem?.description ||
    cs?.solution?.description ||
    (Array.isArray(cs?.challenges) && cs.challenges.length > 0) ||
    (Array.isArray(cs?.metrics) && cs.metrics.length > 0) ||
    cs?.highlightCode?.codeSnippet,
  );
};

const collectTechTokens = (project) => {
  const tokens = [];

  if (Array.isArray(project?.tags)) {
    tokens.push(...project.tags);
  }

  if (Array.isArray(project?.technologies)) {
    for (const tech of project.technologies) {
      if (typeof tech === "string") tokens.push(tech);
      else if (tech && typeof tech === "object") {
        if (tech.name) tokens.push(tech.name);
      }
    }
  }

  if (Array.isArray(project?.techStack)) {
    for (const group of project.techStack) {
      if (group?.category) tokens.push(group.category);
      if (Array.isArray(group?.items)) tokens.push(...group.items);
    }
  }

  return tokens
    .map((t) => normalizeText(t))
    .filter(Boolean)
    .slice(0, 200);
};

const ProjectsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  const [projects, setProjects] = useState(fallbackProjects);
  const [dataSource, setDataSource] = useState("fallback");
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [caseStudyOnly, setCaseStudyOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setRefreshing(true);
      try {
        const data = await fetchProjects({ signal: controller.signal });
        if (!isMounted) return;
        const nextProjects =
          Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        setProjects(nextProjects);
        setDataSource(
          Array.isArray(data) && data.length > 0 ? "live" : "fallback",
        );
      } catch {
        if (!isMounted) return;
        setProjects(fallbackProjects);
        setDataSource("fallback");
      } finally {
        if (isMounted) setRefreshing(false);
      }
    };

    load();

    const intervalId = window.setInterval(load, REQUEST_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const filterOptions = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const statuses = new Set();
    const platforms = new Set();

    for (const project of list) {
      const status = normalizeText(getProjectStatus(project));
      const platform = normalizeText(getProjectPlatform(project));
      if (status) statuses.add(status);
      if (platform) platforms.add(platform);
    }

    return {
      statuses: Array.from(statuses).sort((a, b) => a.localeCompare(b)),
      platforms: Array.from(platforms).sort((a, b) => a.localeCompare(b)),
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    const q = normalizeText(query);

    return list.filter((project) => {
      if (featuredOnly && !isProjectFeatured(project)) return false;
      if (caseStudyOnly && !hasCaseStudy(project)) return false;

      const status = normalizeText(getProjectStatus(project));
      const platform = normalizeText(getProjectPlatform(project));

      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (platformFilter !== "all" && platform !== platformFilter) return false;

      if (!q) return true;

      const title = normalizeText(getProjectTitle(project));
      const desc = normalizeText(getProjectDescription(project));
      const slug = normalizeText(project?.slug);
      const category = normalizeText(
        project?.metadata?.category || project?.category,
      );
      const techTokens = collectTechTokens(project);
      const links = normalizeText(
        [
          project?.links?.github,
          project?.links?.liveDemo,
          project?.links?.figma,
          project?.githubUrl,
          project?.liveUrl,
        ]
          .filter(Boolean)
          .join(" "),
      );

      const haystack = [title, desc, slug, category, status, platform, links]
        .filter(Boolean)
        .join(" ");

      if (haystack.includes(q)) return true;
      return techTokens.some((t) => t.includes(q));
    });
  }, [
    projects,
    query,
    statusFilter,
    platformFilter,
    featuredOnly,
    caseStudyOnly,
  ]);

  const sortedProjects = useMemo(() => {
    const list = Array.isArray(filteredProjects) ? [...filteredProjects] : [];
    list.sort((a, b) => {
      const af = isProjectFeatured(a) ? 1 : 0;
      const bf = isProjectFeatured(b) ? 1 : 0;
      if (af !== bf) return bf - af;

      const ad = getProjectCreatedAt(a);
      const bd = getProjectCreatedAt(b);
      if (ad && bd) return new Date(bd) - new Date(ad);
      return 0;
    });
    return list;
  }, [filteredProjects]);

  const totalPages = useMemo(() => {
    const total = sortedProjects.length;
    return total > 0 ? Math.ceil(total / PROJECTS_PAGE_SIZE) : 1;
  }, [sortedProjects.length]);

  const clampedPage = useMemo(() => {
    const safeTotal = Math.max(1, totalPages);
    return Math.min(Math.max(1, currentPage), safeTotal);
  }, [currentPage, totalPages]);

  const pagedProjects = useMemo(() => {
    const startIndex = (clampedPage - 1) * PROJECTS_PAGE_SIZE;
    return sortedProjects.slice(startIndex, startIndex + PROJECTS_PAGE_SIZE);
  }, [sortedProjects, clampedPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, statusFilter, platformFilter, featuredOnly, caseStudyOnly]);

  useEffect(() => {
    if (currentPage !== clampedPage) setCurrentPage(clampedPage);
  }, [currentPage, clampedPage]);

  const scrollResultsIntoView = () => {
    const el = resultsRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    window.requestAnimationFrame(scrollResultsIntoView);
  };

  const pageItems = useMemo(() => {
    const items = [];
    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i += 1) items.push(i);
      return items;
    }

    items.push(1);

    const left = Math.max(2, clampedPage - 1);
    const right = Math.min(total - 1, clampedPage + 1);

    if (left > 2) items.push("…");
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < total - 1) items.push("…");

    items.push(total);
    return items;
  }, [totalPages, clampedPage]);

  const heroProject = useMemo(() => {
    const featured = sortedProjects.find(isProjectFeatured);
    return featured ?? sortedProjects[0] ?? null;
  }, [sortedProjects]);

  const getProjectRouteParam = (project) =>
    project?.slug || project?.id || project?._id || project?.title;

  const handleOpenProject = (project) => {
    const param = getProjectRouteParam(project);
    if (!param) return;
    navigate(`/projects/${encodeURIComponent(param)}`);
  };

  return (
    <div className={`app-container show theme-${theme}`}>
      <main className="projects-page">
        <header className="projects-page-header">
          <button
            type="button"
            className="projects-back-btn"
            onClick={() => navigate("/")}
          >
            ← Ana sayfaya dön
          </button>

          <div className="projects-page-title">
            <h1>Projeler</h1>
          </div>

          <div className="projects-page-status" aria-live="polite">
            <span className="projects-page-chip" data-state={dataSource}>
              {dataSource === "live" ? "Canlı veri" : "Yedek içerik"}
              {refreshing ? " • Güncelleniyor" : ""}
            </span>
          </div>
        </header>

        <section className="projects-filters" aria-label="Proje filtreleri">
          <div className="projects-filters-row">
            <label className="projects-filter" htmlFor="projects-search">
              <span>Arama</span>
              <input
                id="projects-search"
                className="projects-filter-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Başlık, platform, teknoloji, tag…"
              />
            </label>

            <label className="projects-filter" htmlFor="projects-status">
              <span>Durum</span>
              <select
                id="projects-status"
                className="projects-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Hepsi</option>
                {filterOptions.statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="projects-filter" htmlFor="projects-platform">
              <span>Platform</span>
              <select
                id="projects-platform"
                className="projects-filter-select"
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
              >
                <option value="all">Hepsi</option>
                {filterOptions.platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="projects-filters-row" data-variant="toggles">
            <label className="projects-filter-toggle">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(e) => setFeaturedOnly(e.target.checked)}
              />
              <span>Featured</span>
            </label>

            <label className="projects-filter-toggle">
              <input
                type="checkbox"
                checked={caseStudyOnly}
                onChange={(e) => setCaseStudyOnly(e.target.checked)}
              />
              <span>Case Study olanlar</span>
            </label>

            <button
              type="button"
              className="projects-filter-clear"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setPlatformFilter("all");
                setFeaturedOnly(false);
                setCaseStudyOnly(false);
              }}
            >
              Filtreleri sıfırla
            </button>

            <div className="projects-results-meta" aria-live="polite">
              {sortedProjects.length} sonuç
            </div>
          </div>
        </section>

        {heroProject && (
          <section
            className="projects-hero"
            style={{
              borderColor:
                heroProject?.visuals?.primaryColor ||
                "var(--color-text-primary)",
            }}
          >
            <div className="projects-hero-media">
              {heroProject?.visuals?.heroVideoUrl ? (
                <video
                  className="projects-hero-video"
                  src={heroProject.visuals.heroVideoUrl}
                  muted
                  playsInline
                  autoPlay
                  loop
                />
              ) : (
                <img
                  className="projects-hero-image"
                  src={
                    heroProject?.visuals?.thumbnailUrl || heroProject?.imageUrl
                  }
                  alt={heroProject?.metadata?.title || heroProject?.title}
                  loading="lazy"
                />
              )}
            </div>

            <div className="projects-hero-content">
              <div className="projects-hero-badges">
                {isProjectFeatured(heroProject) && (
                  <span className="projects-hero-badge">FEATURED</span>
                )}
                {heroProject?.metadata?.status && (
                  <span className="projects-hero-badge" data-variant="status">
                    {heroProject.metadata.status}
                  </span>
                )}
                {heroProject?.metadata?.platform && (
                  <span className="projects-hero-badge" data-variant="platform">
                    {heroProject.metadata.platform}
                  </span>
                )}
              </div>

              <h2 className="projects-hero-title">
                {heroProject?.metadata?.title || heroProject?.title}
              </h2>

              <p className="projects-hero-tagline">
                {heroProject?.metadata?.tagline || heroProject?.description}
              </p>

              <div className="projects-hero-cta">
                <button
                  type="button"
                  className="projects-hero-primary"
                  onClick={() => handleOpenProject(heroProject)}
                >
                  Detayı aç
                </button>

                {heroProject?.links?.liveDemo || heroProject?.liveUrl ? (
                  <a
                    className="projects-hero-secondary"
                    href={heroProject?.links?.liveDemo || heroProject?.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </a>
                ) : null}

                {heroProject?.links?.github || heroProject?.githubUrl ? (
                  <a
                    className="projects-hero-secondary"
                    href={heroProject?.links?.github || heroProject?.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        )}

        <section className="projects-grid" aria-label="Tüm projeler">
          {sortedProjects.length > 0 ? (
            pagedProjects.map((project) => {
              const key =
                project._id || project.id || project.slug || project.title;
              return (
                <ProjectCard
                  key={key}
                  project={project}
                  onClick={() => handleOpenProject(project)}
                />
              );
            })
          ) : (
            <div className="projects-empty" role="status">
              Filtrelere uygun proje bulunamadı.
            </div>
          )}
        </section>

        {sortedProjects.length > 0 ? (
          <nav
            className="projects-pagination"
            aria-label="Projeler sayfalama"
            ref={resultsRef}
          >
            <div className="projects-pagination-meta" aria-live="polite">
              Sayfa {clampedPage} / {totalPages} • {sortedProjects.length} sonuç
            </div>

            <div className="projects-pagination-controls">
              <button
                type="button"
                className="projects-page-btn"
                onClick={() => handlePageChange(clampedPage - 1)}
                disabled={clampedPage <= 1}
                aria-label="Önceki sayfa"
              >
                ← Önceki
              </button>

              <div
                className="projects-page-numbers"
                aria-label="Sayfa numaraları"
              >
                {pageItems.map((item, index) => {
                  if (item === "…") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="projects-page-ellipsis"
                      >
                        …
                      </span>
                    );
                  }

                  const pageNumber = item;
                  const isActive = pageNumber === clampedPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className="projects-page-number"
                      data-active={isActive ? "true" : "false"}
                      onClick={() => handlePageChange(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="projects-page-btn"
                onClick={() => handlePageChange(clampedPage + 1)}
                disabled={clampedPage >= totalPages}
                aria-label="Sonraki sayfa"
              >
                Sonraki →
              </button>
            </div>
          </nav>
        ) : null}
      </main>
    </div>
  );
};

export default ProjectsPage;
