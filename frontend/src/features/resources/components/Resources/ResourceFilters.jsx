import React from "react";
import "./ResourceFilters.css";

const TYPES = [
  { value: "", label: "Tum" },
  { value: "kitap", label: "Kitaplar" },
  { value: "video", label: "Videolar" },
  { value: "makale", label: "Makaleler" },
  { value: "kurs", label: "Kurslar" },
  { value: "arac", label: "Araclar" },
];

const ResourceFilters = React.memo(({ filters, onChange }) => {
  return (
    <div className="res-filters">
      {TYPES.map((t) => (
        <button
          key={t.value}
          type="button"
          className={`res-filter-pill ${filters.type === t.value || (!filters.type && t.value === "") ? "active" : ""}`}
          onClick={() => onChange({ ...filters, type: t.value || undefined })}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
});

export default ResourceFilters;
