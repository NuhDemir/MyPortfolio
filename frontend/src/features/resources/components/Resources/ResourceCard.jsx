import React, { useMemo } from "react";
import { ExternalLink, Star, BookOpen, Play, FileText, GraduationCap, Wrench, Ellipsis } from "lucide-react";
import { PatternBackground } from "@shared";
import "./ResourceCard.css";

const TYPE_ICONS = {
  kitap: BookOpen,
  video: Play,
  makale: FileText,
  kurs: GraduationCap,
  arac: Wrench,
  diger: Ellipsis,
};

const TYPE_LABELS = {
  kitap: "Kitap",
  video: "Video",
  makale: "Makale",
  kurs: "Kurs",
  arac: "Arac",
  diger: "Diger",
};

const DIFFICULTY_LABELS = {
  baslangic: "Baslangic",
  orta: "Orta",
  ileri: "Ileri",
  uzman: "Uzman",
};

const ResourceCard = React.memo(({ resource }) => {
  const { title, description, url, type, tags, author, rating, difficulty, coverImage } = resource;

  const displayTags = useMemo(() => (Array.isArray(tags) ? tags.slice(0, 3) : []), [tags]);
  const TypeIcon = TYPE_ICONS[type] || Ellipsis;

  const handleClick = () => {
    if (url) window.open(url, "_blank", "noopener noreferrer");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="res-card-wrapper"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${title} kaynagini ac`}
    >
      <div className="res-card">
        <div className="res-card-cover">
          {coverImage ? (
            <img src={coverImage} alt={title} className="res-card-cover-img" loading="lazy" />
          ) : (
            <PatternBackground seed={resource.id || resource.slug} opacity={0.2} />
          )}
          <div className="res-card-type-badge">
            <TypeIcon size={14} />
            <span>{TYPE_LABELS[type] || "Diger"}</span>
          </div>
        </div>

        <div className="res-card-body">
          <h3 className="res-card-title">{title}</h3>

          {author && <p className="res-card-author">{author}</p>}

          {description && <p className="res-card-desc">{description}</p>}

          <div className="res-card-meta">
            {displayTags.length > 0 && (
              <div className="res-card-tags">
                {displayTags.map((tag) => (
                  <span key={tag} className="res-card-tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="res-card-footer">
              <div className="res-card-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={`res-card-star ${i < rating ? "filled" : ""}`}
                  />
                ))}
              </div>

              {difficulty && (
                <span className="res-card-difficulty">
                  {DIFFICULTY_LABELS[difficulty] || difficulty}
                </span>
              )}

              <ExternalLink size={14} className="res-card-ext-link" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ResourceCard;
