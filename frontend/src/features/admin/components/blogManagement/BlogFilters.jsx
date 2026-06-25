import { Search, X } from "lucide-react";
import "./BlogFilters.css";

const SORT_OPTIONS = [
  { value: "newest", label: "En yeni" },
  { value: "oldest", label: "En eski" },
  { value: "views", label: "En cok goruntulenen" },
  { value: "readingTime", label: "Okuma suresi" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tum durumlar" },
  { value: "draft", label: "Taslak" },
  { value: "published", label: "Yayinda" },
  { value: "archived", label: "Arsivlenmis" },
  { value: "scheduled", label: "Zamanlanmis" },
];

const PUBLISHED_OPTIONS = [
  { value: "", label: "Tumu" },
  { value: "true", label: "Yayinda" },
  { value: "false", label: "Taslak" },
];

const BlogFilters = ({ filters, onChange, tags }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="blog-filters">
      <div className="blog-filters__search">
        <Search size={14} />
        <input type="text" value={filters.query} onChange={(e) => update("query", e.target.value)}
          placeholder="Baslik ile ara..." className="blog-filters__input" />
        {filters.query && (
          <button type="button" className="blog-filters__clear" onClick={() => update("query", "")}>
            <X size={14} />
          </button>
        )}
      </div>

      <select value={filters.tag} onChange={(e) => update("tag", e.target.value)} className="blog-filters__select">
        <option value="">Tum etiketler</option>
        {tags.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select value={filters.status} onChange={(e) => update("status", e.target.value)} className="blog-filters__select">
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select value={filters.isPublished} onChange={(e) => update("isPublished", e.target.value)} className="blog-filters__select">
        {PUBLISHED_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <input type="date" value={filters.dateFrom} onChange={(e) => update("dateFrom", e.target.value)}
        className="blog-filters__date" title="Baslangic tarihi" />

      <input type="date" value={filters.dateTo} onChange={(e) => update("dateTo", e.target.value)}
        className="blog-filters__date" title="Bitis tarihi" />

      <select value={filters.sort} onChange={(e) => update("sort", e.target.value)} className="blog-filters__select">
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

export default BlogFilters;
