import { useState, useMemo } from "react";
import { Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { LoadingSpinner } from "@shared";

const TYPE_LABELS = {
  kitap: "Kitap",
  video: "Video",
  makale: "Makale",
  kurs: "Kurs",
  arac: "Arac",
  diger: "Diger",
};

const ResourcesTable = ({ resources, loading, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      const title = (r.title || "").toLowerCase();
      if (search && !title.includes(search.toLowerCase())) return false;
      if (typeFilter && r.type !== typeFilter) return false;
      return true;
    });
  }, [resources, search, typeFilter]);

  if (loading) {
    return (
      <div className="admin-list-container">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="admin-list-container">
      <div className="admin-table-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Baslik ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">Tum Turler</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-state">
          {resources.length === 0
            ? "Henuz kaynak eklenmemis."
            : "Aramanizla eslesen kaynak bulunamadi."}
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Baslik</th>
                <th>Tur</th>
                <th>Puan</th>
                <th>Durum</th>
                <th>Islem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id || r.id}>
                  <td className="admin-table-title">
                    <span className="admin-table-title-text">{r.title}</span>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="admin-table-ext-link">
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </td>
                  <td>
                    <span className="admin-badge">{TYPE_LABELS[r.type] || r.type}</span>
                  </td>
                  <td>
                    <span className="admin-stars">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < (r.rating || 0) ? "filled" : ""}
                        />
                      ))}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-status-dot ${r.isActive ? "active" : "inactive"}`} />
                    {r.isActive ? "Aktif" : "Pasif"}
                  </td>
                  <td>
                    <div className="admin-table-actions">
                      <button
                        type="button"
                        className="admin-btn-icon"
                        title="Duzenle"
                        onClick={() => onEdit(r)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn-icon admin-btn-icon--danger"
                        title="Sil"
                        onClick={() => onDelete(r)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResourcesTable;
