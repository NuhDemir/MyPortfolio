import { motion } from "framer-motion";
import { Heart, Eye, ExternalLink, Github, ArrowRight } from "lucide-react";
import { getProjectTitle, getProjectTagline, getProjectStatus, getProjectPlatform, getProjectLinks, getProjectRole, isProjectFeatured, hasCaseStudy } from "../../utils/projectFormatters.js";
import HoverVideo from "@shared/ui/HoverVideo/HoverVideo.jsx";
import "./ProjectHero.css";

const ProjectHero = ({ project, onOpen, liked, onLike, views }) => {
  const title = getProjectTitle(project);
  const tagline = getProjectTagline(project);
  const status = getProjectStatus(project);
  const platform = getProjectPlatform(project);
  const role = getProjectRole(project);
  const featured = isProjectFeatured(project);
  const study = hasCaseStudy(project);
  const links = getProjectLinks(project);
  const heroMedia = project?.visuals || {};
  const heroVideo = heroMedia.heroVideoUrl;
  const heroImage = heroMedia.heroImageUrl || heroMedia.thumbnailUrl || project?.thumbnailUrl || project?.imageUrl;

  if (!project) return null;

  return (
    <motion.section
      className="phero"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
    >
      <div className="phero__content">
        <div className="phero__badges">
          {featured && <span className="phero__badge phero__badge--feat">Featured</span>}
          {study && <span className="phero__badge">Case Study</span>}
          {status && <span className="phero__badge">{status}</span>}
          {platform && <span className="phero__badge phero__badge--platform">{platform}</span>}
        </div>

        <h1 className="phero__title">{title}</h1>
        <p className="phero__tagline">{tagline}</p>
        {role && <p className="phero__role">{role}</p>}

        <div className="phero__actions">
          <button type="button" className="phero__cta phero__cta--primary" onClick={onOpen}>
            Detayi Ac <ArrowRight size={16} />
          </button>
          {links.liveDemo && (
            <a className="phero__cta phero__cta--secondary" href={links.liveDemo} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
          {links.github && (
            <a className="phero__cta phero__cta--ghost" href={links.github} target="_blank" rel="noopener noreferrer">
              <Github size={14} /> GitHub
            </a>
          )}
        </div>

        <div className="phero__stats">
          <button
            type="button"
            className={`phero__stat ${liked ? "phero__stat--liked" : ""}`}
            onClick={(e) => { e.stopPropagation(); onLike?.(); }}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} /> {views || 0}
          </button>
          <span className="phero__stat">
            <Eye size={14} /> {views || 0} goruntuleme
          </span>
        </div>
      </div>

      <div className="phero__media">
        {heroVideo ? (
          <HoverVideo src={heroVideo} poster={heroImage} />
        ) : heroImage ? (
          <img src={heroImage} alt={title} className="phero__img" loading="eager" />
        ) : (
          <div className="phero__img-plc">{title.charAt(0)}</div>
        )}
      </div>
    </motion.section>
  );
};

export default ProjectHero;
