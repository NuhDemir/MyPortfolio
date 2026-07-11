import { useRef, useState, useEffect, useCallback } from "react";
import { Search, X, ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import "./ProjectFilters.css";

/* ── Chip Dropdown ─────────────────────────────────────────────────────── */
const ChipSelect = ({ label, value, options, onChange, allLabel = "Tümü", defaultValue = "all" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isActive = value !== defaultValue;
  const selected = options.find((o) => o.value === value);
  const displayLabel = isActive ? selected?.label ?? value : label;

  return (
    <div className={`pf-chip-select${isActive ? " pf-chip-select--active" : ""}`} ref={ref}>
      <button
        type="button"
        className="pf-chip-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="pf-chip-select__label">{displayLabel}</span>
        <ChevronDown size={12} className={`pf-chip-select__caret${open ? " pf-chip-select__caret--open" : ""}`} />
      </button>

      {open && (
        <ul className="pf-chip-select__menu" role="listbox" aria-label={label}>
          <li
            role="option"
            aria-selected={value === defaultValue}
            className={`pf-chip-select__option${value === defaultValue ? " pf-chip-select__option--selected" : ""}`}
            onClick={() => { onChange(defaultValue); setOpen(false); }}
          >
            {value === defaultValue && <Check size={12} />}
            <span>{allLabel}</span>
          </li>
          {options.map((o) => (
            <li
              key={o.value}
              role="option"
              aria-selected={value === o.value}
              className={`pf-chip-select__option${value === o.value ? " pf-chip-select__option--selected" : ""}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {value === o.value && <Check size={12} />}
              <span>{o.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* ── Toggle Chip ───────────────────────────────────────────────────────── */
const ToggleChip = ({ label, checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={`pf-toggle-chip${checked ? " pf-toggle-chip--on" : ""}`}
    onClick={() => onChange(!checked)}
  >
    {checked && <Check size={11} className="pf-toggle-chip__icon" />}
    <span>{label}</span>
  </button>
);

/* ── Active Badge ──────────────────────────────────────────────────────── */
const ActiveBadge = ({ label, onRemove }) => (
  <span className="pf-active-badge">
    {label}
    <button type="button" aria-label={`${label} filtresini kaldır`} onClick={onRemove}>
      <X size={10} />
    </button>
  </span>
);

/* ── Main Component ────────────────────────────────────────────────────── */
const SORT_OPTS = [
  { value: "featured", label: "Öne Çıkanlar" },
  { value: "newest",   label: "En Yeni" },
  { value: "oldest",   label: "En Eski" },
  { value: "az",       label: "A → Z" },
];

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
  const inputRef = useRef(null);

  const statusOpts    = filterOptions.statuses.map((s) => ({ value: s, label: s }));
  const platformOpts  = filterOptions.platforms.map((p) => ({ value: p, label: p }));
  const difficultyOpts = filterOptions.difficulties.map((d) => ({ value: d, label: d }));

  const hasActive = query || status !== "all" || platform !== "all" ||
    difficulty !== "all" || featuredOnly || caseStudyOnly || sortKey !== "featured";

  /* active badge list */
  const activeBadges = [];
  if (status !== "all")     activeBadges.push({ key: "status",     label: status,     clear: () => setStatus("all") });
  if (platform !== "all")   activeBadges.push({ key: "platform",   label: platform,   clear: () => setPlatform("all") });
  if (difficulty !== "all") activeBadges.push({ key: "difficulty", label: difficulty, clear: () => setDifficulty("all") });
  if (sortKey !== "featured") activeBadges.push({ key: "sort", label: SORT_OPTS.find(o => o.value === sortKey)?.label, clear: () => setSortKey("featured") });
  if (featuredOnly)  activeBadges.push({ key: "featured",   label: "Featured",    clear: () => setFeaturedOnly(false) });
  if (caseStudyOnly) activeBadges.push({ key: "caseStudy",  label: "Case Study",  clear: () => setCaseStudyOnly(false) });

  const handleSearchClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, [setQuery]);

  return (
    <section className="pf" aria-label="Proje filtreleri">

      {/* ── Row 1: Search ─────────────────────────────────────────── */}
      <div className="pf__search-wrap">
        <Search size={15} className="pf__search-icon" aria-hidden="true" />
        <input
          ref={inputRef}
          id="pf-search"
          className="pf__search-input"
          type="search"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Başlık, teknoloji, tag ara…"
          aria-label="Proje ara"
        />
        {query && (
          <button
            type="button"
            className="pf__search-clear"
            aria-label="Aramayı temizle"
            onClick={handleSearchClear}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* ── Row 2: Filter Chips (horizontal scroll on mobile) ─────── */}
      <div className="pf__chips-track" role="group" aria-label="Filtre seçenekleri">
        <div className="pf__chips-inner">
          <SlidersHorizontal size={14} className="pf__chips-icon" aria-hidden="true" />

          <ChipSelect
            label="Durum"
            value={status}
            options={statusOpts}
            onChange={setStatus}
          />
          <ChipSelect
            label="Platform"
            value={platform}
            options={platformOpts}
            onChange={setPlatform}
          />
          <ChipSelect
            label="Seviye"
            value={difficulty}
            options={difficultyOpts}
            onChange={setDifficulty}
          />
          <ChipSelect
            label="Sırala"
            value={sortKey}
            options={SORT_OPTS}
            onChange={setSortKey}
            defaultValue="featured"
            allLabel="Öne Çıkanlar"
          />

          <div className="pf__chips-divider" aria-hidden="true" />

          <ToggleChip label="Featured" checked={featuredOnly} onChange={setFeaturedOnly} />
          <ToggleChip label="Case Study" checked={caseStudyOnly} onChange={setCaseStudyOnly} />
        </div>
      </div>

      {/* ── Row 3: Active filters + result count ──────────────────── */}
      {(activeBadges.length > 0 || resultCount !== undefined) && (
        <div className="pf__meta-row">
          <div className="pf__active-badges">
            {activeBadges.map((b) => (
              <ActiveBadge key={b.key} label={b.label} onRemove={b.clear} />
            ))}
            {hasActive && (
              <button type="button" className="pf__reset-all" onClick={clearFilters}>
                Tümünü Sıfırla
              </button>
            )}
          </div>
          {resultCount !== undefined && (
            <span className="pf__count" aria-live="polite" aria-atomic="true">
              {resultCount} sonuç
            </span>
          )}
        </div>
      )}
    </section>
  );
};

export default ProjectFilters;
