import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useScrollReveal } from "@shared";
import Lightbox from "@shared/ui/Lightbox/Lightbox.jsx";
import HoverVideo from "@shared/ui/HoverVideo/HoverVideo.jsx";
import { useProjectData } from "../hooks/useProjectData.js";
import { useProjectAnalytics } from "../hooks/useProjectAnalytics.js";
import {
  getProjectTitle, getProjectTagline, getProjectLinks,
  getProjectHeroMedia, isProjectFeatured, hasCaseStudy,
  matchesProjectParam,
  getProjectStatus, getProjectPlatform,
} from "../utils/projectFormatters.js";
import ProjectSEO from "../components/ProjectSEO/ProjectSEO.jsx";
import ContextBar from "../components/ContextBar/ContextBar.jsx";
import BentoGrid from "../components/BentoGrid/BentoGrid.jsx";
import ProcessGrid from "../components/ProcessGrid/ProcessGrid.jsx";
import DeepDive from "../components/DeepDive/DeepDive.jsx";
import ProjectGallery from "../components/ProjectGallery/ProjectGallery.jsx";
import ProjectFooter from "../components/ProjectFooter/ProjectFooter.jsx";
import "./styles/project-details.css";

const ProjectDetailsPage = () => {
  const navigate = useNavigate();
  const { slugOrId } = useParams();

  const { projects } = useProjectData({});
  const [lightbox, setLightbox] = useState({ open: false, url: "", alt: "" });
  const [contextExpanded, setContextExpanded] = useState(true);

  const project = useMemo(() => {
    if (!slugOrId || !projects?.length) return null;
    return projects.find((p) => matchesProjectParam(p, slugOrId)) || null;
  }, [projects, slugOrId]);

  const { recordView, handleLike, liked } = useProjectAnalytics(project?.id || "");

  useEffect(() => {
    if (project?.id) recordView();
  }, [project?.id]);

  const sortedProjects = useMemo(() => {
    if (!projects?.length) return [];
    return [...projects].sort((a, b) => {
      const af = isProjectFeatured(a) ? 1 : 0;
      const bf = isProjectFeatured(b) ? 1 : 0;
      return bf - af;
    });
  }, [projects]);

  const prevNext = useMemo(() => {
    if (!project) return { prev: null, next: null };
    const idx = sortedProjects.findIndex((p) => p.id === project.id || p.slug === project.slug);
    if (idx < 0) return { prev: null, next: null };
    return {
      prev: idx > 0 ? sortedProjects[idx - 1] : null,
      next: idx < sortedProjects.length - 1 ? sortedProjects[idx + 1] : null,
    };
  }, [project, sortedProjects]);

  const openLightbox = useCallback((item) => {
    setLightbox({ open: true, url: item.url, alt: item.alt || "" });
  }, []);

  const revSection = useScrollReveal({ variant: "fadeUp", threshold: 0.08 });
  const revCtx = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 });
  const revBento = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.2 });
  const revProcess = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.3 });
  const revGallery = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.4 });
  const revDeep = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.5 });
  const revFooter = useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.6 });

  if (!project) {
    return (
      <main className="prj-detail prj-detail--notfound">
        <button type="button" className="prj-detail__back" onClick={() => navigate("/projects")}>
          ← Projelere Don
        </button>
        <h1>Proje Bulunamadi</h1>
        <p>Bu proje kaldirilmis veya link hatali olabilir.</p>
        <Link to="/projects" className="prj-detail__link">Tum Projeler</Link>
      </main>
    );
  }

  const title = getProjectTitle(project);
  const heroMedia = getProjectHeroMedia(project);
  const links = getProjectLinks(project);
  const featured = isProjectFeatured(project);
  const study = hasCaseStudy(project);
  const status = getProjectStatus(project);
  const platform = getProjectPlatform(project);

  return (
    <>
      <ProjectSEO project={project} />
      <main className="prj-detail">
        <header className="prj-detail__topbar">
          <button type="button" className="prj-detail__back" onClick={() => navigate("/projects")}>
            ← Projelere Don
          </button>
        </header>

        <motion.section className="prj-detail__hero" {...revSection}>
          <div className="prj-detail__hero-left">
            <div className="prj-detail__kickers">
              {featured && <span className="prj-detail__kicker prj-detail__kicker--feat">Featured</span>}
              {study && <span className="prj-detail__kicker">Case Study</span>}
              {status && <span className="prj-detail__kicker">{status}</span>}
              {platform && <span className="prj-detail__kicker prj-detail__kicker--platform">{platform}</span>}
            </div>

            <h1 className="prj-detail__title">{title}</h1>
            <p className="prj-detail__tagline">{getProjectTagline(project)}</p>

            <div className="prj-detail__ctas">
              {links.liveDemo ? (
                <a className="prj-detail__cta prj-detail__cta--primary" href={links.liveDemo} target="_blank" rel="noopener noreferrer">
                  Projeyi Incele
                </a>
              ) : (
                <button type="button" className="prj-detail__cta prj-detail__cta--primary" disabled>Live Demo (yok)</button>
              )}
              {links.github ? (
                <a className="prj-detail__cta prj-detail__cta--secondary" href={links.github} target="_blank" rel="noopener noreferrer">
                  Kaynak Kod
                </a>
              ) : null}
              {links.figma ? (
                <a className="prj-detail__cta prj-detail__cta--ghost" href={links.figma} target="_blank" rel="noopener noreferrer">Figma</a>
              ) : null}
              {links.documentation ? (
                <a className="prj-detail__cta prj-detail__cta--ghost" href={links.documentation} target="_blank" rel="noopener noreferrer">Docs</a>
              ) : null}
            </div>
          </div>

          <div className="prj-detail__hero-right">
            {heroMedia.heroVideoUrl ? (
              <HoverVideo src={heroMedia.heroVideoUrl} poster={heroMedia.heroImageUrl || heroMedia.thumbnailUrl} />
            ) : heroMedia.heroImageUrl || heroMedia.thumbnailUrl ? (
              <img
                className="prj-detail__hero-img"
                src={heroMedia.heroImageUrl || heroMedia.thumbnailUrl}
                alt={title}
                loading="eager"
              />
            ) : null}
          </div>
        </motion.section>

        <motion.div {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.1 })}>
          <ContextBar
            project={project}
            expanded={contextExpanded}
            onToggle={() => setContextExpanded((v) => !v)}
          />
        </motion.div>

        <motion.section {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.2 })}>
          <BentoGrid project={project} />
        </motion.section>

        <motion.section {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.3 })}>
          <ProcessGrid project={project} onLightbox={openLightbox} />
        </motion.section>

        <motion.section {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.4 })}>
          <ProjectGallery project={project} onLightbox={openLightbox} />
        </motion.section>

        <motion.section {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.5 })}>
          <DeepDive project={project} />
        </motion.section>

        <motion.section {...useScrollReveal({ variant: "fadeUp", threshold: 0.08, delay: 0.6 })}>
          <ProjectFooter project={project} nextProject={prevNext.next} prevProject={prevNext.prev} />
        </motion.section>

        <Lightbox
          open={lightbox.open}
          onClose={() => setLightbox({ open: false, url: "", alt: "" })}
          src={lightbox.url}
          alt={lightbox.alt}
        />
      </main>
    </>
  );
};

export default ProjectDetailsPage;
