import Reveal from "@shared/ui/Reveal/Reveal.jsx";
import "./ProjectGallery.css";

const ProjectGallery = ({ project, onLightbox }) => {
  const gallery = Array.isArray(project?.galleryImages) ? project.galleryImages : [];
  if (gallery.length === 0) return null;

  const images = gallery
    .filter((item) => item && (item.url || item.src))
    .map((item) => ({
      url: item.url || item.src,
      alt: item.alt || item.caption || "",
      caption: item.caption || "",
    }));

  if (images.length === 0) return null;

  return (
    <section className="pgal" aria-label="Ekran goruntuleri">
      <Reveal className="pgal__head" as="header">
        <h2>Screens</h2>
        <p>Gorselleri tiklayip full-screen inceleyin.</p>
      </Reveal>

      <div className="pgal__grid">
        {images.slice(0, 12).map((item) => (
          <button
            key={item.url}
            type="button"
            className="pgal__item"
            onClick={() => onLightbox(item)}
          >
            <img src={item.url} alt={item.alt} loading="lazy" />
            {item.caption && <span className="pgal__caption">{item.caption}</span>}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallery;
