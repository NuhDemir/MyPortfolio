import { useEffect, useState } from "react";
import "./ProjectListMenu.css";

const ProjectListMenu = ({
  searchQuery,
  onSearchQueryChange,

  platformFilter,
  onPlatformFilterChange,
  platformOptions,
  featuredOnly,
  onFeaturedOnlyChange,
  onClearFilters,
  onOpenAllProjects,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth > 768;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className="project-list-menu" aria-label="Proje menusu">
      <div className="project-list-menu__header">
        <div className="project-list-menu__title">Menu</div>
        <button
          type="button"
          className="project-list-menu__toggle"
          aria-expanded={isMenuOpen}
          aria-controls="project-list-menu-content"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? "Filtreleri gizle" : "Filtreleri goster"}
        </button>
      </div>

      <div
        id="project-list-menu-content"
        className={`project-list-menu__content ${isMenuOpen ? "is-open" : ""}`}
      >
        <div className="project-list-actions">
          <button
            type="button"
            className="project-list-all-btn"
            onClick={onOpenAllProjects}
          >
            Tum projeler
          </button>
        </div>

        <div className="project-list-filter-group">
          <label htmlFor="project-filter-search">Ara</label>
          <input
            id="project-filter-search"
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Baslik, etiket, kategori"
          />
        </div>

        <div className="project-list-filter-group">
          <label htmlFor="project-filter-platform">Platform</label>
          <select
            id="project-filter-platform"
            value={platformFilter}
            onChange={(event) => onPlatformFilterChange(event.target.value)}
          >
            {platformOptions.map((platform) => (
              <option key={platform} value={platform}>
                {platform === "all" ? "Tumu" : platform}
              </option>
            ))}
          </select>
        </div>

        <label className="project-list-filter-checkbox" htmlFor="featured-only">
          <input
            id="featured-only"
            type="checkbox"
            checked={featuredOnly}
            onChange={(event) => onFeaturedOnlyChange(event.target.checked)}
          />
          <span>Sadece one cikanlar</span>
        </label>

        <button
          type="button"
          className="project-list-clear-btn"
          onClick={onClearFilters}
        >
          Filtreleri temizle
        </button>
      </div>
    </aside>
  );
};

export default ProjectListMenu;
