import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import ProjectCard from "../ProjectCard/ProjectCard.jsx";
import SkeletonCard from "../SkeletonCard/SkeletonCard.jsx";
import "./ProjectGrid.css";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const ProjectGrid = ({ projects, loading, visibleItems, setVisibleItems, totalCount, onProjectClick, likedMap, onLike, viewMap }) => {
  const visible = projects.slice(0, visibleItems);
  const hasMore = visibleItems < totalCount;

  if (loading) {
    return (
      <div className="pgrid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="pgrid__empty">
        <p>Filtrelere uygun proje bulunamadi.</p>
      </div>
    );
  }

  return (
    <>
      <motion.div className="pgrid" variants={containerVariants} initial="hidden" animate="visible">
        {visible.map((project, index) => (
          <ProjectCard
            key={project.id || project.slug || index}
            project={project}
            index={index}
            onClick={() => onProjectClick(project)}
            liked={likedMap[project.id] || false}
            onLike={() => onLike(project.id)}
            views={viewMap[project.id] || 0}
          />
        ))}
      </motion.div>

      {hasMore && (
        <div className="pgrid__more">
          <button
            type="button"
            className="pgrid__load-btn"
            onClick={() => setVisibleItems((v) => v + 6)}
          >
            Daha Fazla Yukle ({totalCount - visibleItems} proje kaldi)
          </button>
        </div>
      )}
    </>
  );
};

export default ProjectGrid;
