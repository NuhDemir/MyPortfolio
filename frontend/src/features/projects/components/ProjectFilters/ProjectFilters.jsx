import { Search, X } from "lucide-react";
import "./ProjectFilters.css";

const ProjectFilters = ({
  query, setQuery,
  status, setStatus,
  platform, setPlatform,
  difficulty, setDifficulty,
  sortKey, setSortKey,
  featuredOnly, setFeaturedOnly,
  caseStudyOnly, setCaseStudyOnly,
  filterOptions,
  clearFilters,
  resultCount,
}) => {
  const hasActive = query || status !== "all" || platform !== "all" || difficulty !== "all" || featuredOnly || caseStudyOnly || sortKey !== "featured";

  return (
    <section className="pfilters" aria-label="Proje filtreleri">
      <div className="pfilters__row">
        <div className="pfilters__search">
          <Search size={16} className="pfilters__search-icon" />
          <input
            className="pfilters__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Baslik, teknoloji, tag..."
          />
          {query && (
            <button type="button" className="pfilters__clear-btn" onClick={() => setQuery("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <select className="pfilters__select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Tum Durumlar</option>
          {filterOptions.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select className="pfilters__select" value={platform} onChange={(e) => setPlatform(e.target.value)}>
          <option value="all">Tum Platformlar</option>
          {filterOptions.platforms.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select className="pfilters__select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">Tum Seviyeler</option>
          {filterOptions.difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>

        <select className="pfilters__select" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
          <option value="featured">One Cikanlar</option>
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="az">A-Z</option>
        </select>
      </div>

      <div className="pfilters__row pfilters__row--toggles">
        <label className="pfilters__toggle">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} />
          <span>Featured</span>
        </label>

        <label className="pfilters__toggle">
          <input type="checkbox" checked={caseStudyOnly} onChange={(e) => setCaseStudyOnly(e.target.checked)} />
          <span>Case Study</span>
        </label>

        {hasActive && (
          <button type="button" className="pfilters__reset" onClick={clearFilters}>
            Filtreleri Sifirla
          </button>
        )}

        <span className="pfilters__count">{resultCount} sonuc</span>
      </div>
    </section>
  );
};

export default ProjectFilters;
