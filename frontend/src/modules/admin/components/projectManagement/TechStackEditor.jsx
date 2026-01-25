import { useEffect, useMemo, useState } from "react";

const safeParseArray = (jsonText) => {
  const raw = String(jsonText ?? "").trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizeGroup = (group) => {
  const category = typeof group?.category === "string" ? group.category : "";
  const items = Array.isArray(group?.items)
    ? group.items.map((x) => String(x)).filter(Boolean)
    : [];
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <label>techStack</label>
        <button
          type="button"
          className="template-btn"
          onClick={() => setMode((m) => (m === "form" ? "json" : "form"))}
        >
          {mode === "form" ? "JSON" : "Form"}
        </button>
      </div>

      {mode === "form" ? (
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {groups.map((group, groupIndex) => (
            <div
              key={`group-${groupIndex}`}
              style={{ border: "1px solid rgba(0,0,0,0.1)", padding: "0.75rem", borderRadius: 10 }}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label>Kategori</label>
                  <input
                    type="text"
                    value={group.category}
                    onChange={(e) => {
                      const next = [...groups];
                      next[groupIndex] = { ...next[groupIndex], category: e.target.value };
                      setGroups(next);
                    }}
                    placeholder="Core / Styling & UI ..."
                  />
                </div>

                <div className="form-group" style={{ display: "flex", alignItems: "end", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => setGroups((prev) => prev.filter((_, i) => i !== groupIndex))}
                  >
                    Sil
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Items</label>
                <input
                  type="text"
                  value={group.items.join(", ")}
                  onChange={(e) => {
                    const next = [...groups];
                    next[groupIndex] = {
                      ...next[groupIndex],
                      items: e.target.value
                        .split(",")
                        .map((x) => x.trim())
                        .filter(Boolean),
                    };
                    setGroups(next);
                  }}
                  placeholder="React, Vite, TypeScript"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            className="admin-add-new-btn"
            onClick={() => setGroups((prev) => [...prev, { category: "", items: [] }])}
          >
            Grup Ekle
          </button>
        </div>
      ) : (
        <textarea
          rows={8}
          value={serialized}
          onChange={(e) => {
            onChangeJsonText(e.target.value);
            setGroups(safeParseArray(e.target.value).map(normalizeGroup));
          }}
          className="json-textarea"
          placeholder='[{ "category": "Core", "items": ["React"] }]'
        />
      )}
    </div>
  );
};

export default TechStackEditor;
