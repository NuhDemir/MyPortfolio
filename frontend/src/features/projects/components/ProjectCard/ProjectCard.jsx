import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { getProjectTitle, getProjectTagline, getProjectStatus, getProjectPlatform, getProjectCreatedAt, getPrimaryTechStack, isProjectFeatured, hasCaseStudy } from "../../utils/projectFormatters.js";
import "./ProjectCard.css";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.2, 0, 0, 1] },
  }),
};

const ProjectCard = ({ project, onClick, index = 0, liked, onLike, views }) => {
  const title = getProjectTitle(project);
  const tagline = getProjectTagline(project);
  const status = getProjectStatus(project);
  const platform = getProjectPlatform(project);
  const date = getProjectCreatedAt(project);
  const techs = getPrimaryTechStack(project).slice(0, 4);
  const featured = isProjectFeatured(project);
  const study = hasCaseStudy(project);
  const thumbnail = project?.thumbnailUrl || project?.imageUrl;

  return (
    <motion.article
      className="pcard"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
    >
      <div className="pcard__media">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="pcard__img" loading="lazy" />
        ) : (
          <div className="pcard__img-plc">{title.charAt(0)}</div>
        )}
        <div className="pcard__overlay">
          <div className="pcard__overlay-badges">
            {featured && <span className="pcard__badge pcard__badge--feat">Featured</span>}
            {study && <span className="pcard__badge">Case Study</span>}
            {status && <span className="pcard__badge">{status}</span>}
          </div>
          <div className="pcard__overlay-tech">
            {techs.map((t) => <span key={t} className="pcard__tech-chip">{t}</span>)}
          </div>
        </div>
      </div>

      <div className="pcard__body">
        <h3 className="pcard__title">{title}</h3>
        <p className="pcard__tagline">{tagline}</p>

        <div className="pcard__meta">
          <span className="pcard__platform">{platform}</span>
          <div className="pcard__actions">
            <button
              type="button"
              className={`pcard__like ${liked ? "pcard__like--active" : ""}`}
              onClick={(e) => { e.stopPropagation(); onLike?.(); }}
              aria-label={liked ? "Unlike" : "Like"}
            >
              <Heart size={14} fill={liked ? "currentColor" : "none"} />
            </button>
            {views != null && (
              <span className="pcard__views">
                <Eye size={12} /> {views}
              </span>
            )}
          </div>
        </div>

        {date && (
          <time className="pcard__date" dateTime={date}>
            {new Date(date).toLocaleDateString("tr-TR")}
          </time>
        )}
      </div>
    </motion.article>
  );
};

export default ProjectCard;
