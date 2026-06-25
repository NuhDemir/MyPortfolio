import { useEffect, useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";

const safeParseArray = (jsonText) => {
  const raw = String(jsonText ?? "").trim();
  if (!raw) return [];
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
};

const normalizeGroup = (group) => {
  const category = typeof group?.category === "string" ? group.category : "";
  const items = Array.isArray(group?.items) ? group.items.map((x) => String(x)).filter(Boolean) : [];
  return { category, items };
};

const TechStackEditor = ({ jsonText, onChangeJsonText }) => {
  const [groups, setGroups] = useState(() => safeParseArray(jsonText).map(normalizeGroup));
  const [mode, setMode] = useState("form");

  useEffect(() => {
    const parsed = safeParseArray(jsonText).map(normalizeGroup);
    const a = JSON.stringify(parsed);
    const b = JSON.stringify(groups);
    if (a !== b) setGroups(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonText]);

  const serialized = useMemo(() => JSON.stringify(groups, null, 2), [groups]);

  useEffect(() => {
    onChangeJsonText(serialized);
  }, [onChangeJsonText, serialized]);

  return (
    <div className="form-group">
      <div className="form-editor-header">
        <label>Tech Stack</label>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setMode((m) => (m === "form" ? "json" : "form"))}>
          {mode === "form" ? "JSON" : "Form"}
        </button>
      </div>

      {mode === "form" ? (
        <div className="form-editor-grid">
          {groups.map((group, groupIndex) => (
            <div key={`group-${groupIndex}`} className="form-editor-section">
              <div className="form-grid">
                <div className="form-group">
                  <label>Kategori</label>
                  <input type="text" value={group.category} onChange={(e) => {
                    const next = [...groups];
                    next[groupIndex] = { ...next[groupIndex], category: e.target.value };
                    setGroups(next);
                  }} placeholder="Core / Styling & UI" />
                </div>
                <div className="form-group form-group--action">
                  <button type="button" className="admin-btn-icon admin-btn-icon--danger" onClick={() => setGroups((prev) => prev.filter((_, i) => i !== groupIndex))}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Items</label>
                <input type="text" value={group.items.join(", ")} onChange={(e) => {
                  const next = [...groups];
                  next[groupIndex] = { ...next[groupIndex], items: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) };
                  setGroups(next);
                }} placeholder="React, Vite, TypeScript" />
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setGroups((prev) => [...prev, { category: "", items: [] }])}>
            <Plus size={14} />
            Grup Ekle
          </button>
        </div>
      ) : (
        <textarea rows={8} value={serialized} onChange={(e) => { onChangeJsonText(e.target.value); setGroups(safeParseArray(e.target.value).map(normalizeGroup)); }} className="admin-json-textarea" placeholder='[{ "category": "Core", "items": ["React"] }]' />
      )}
    </div>
  );
};

export default TechStackEditor;
