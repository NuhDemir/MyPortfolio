import { useEffect, useMemo, useState } from "react";

const defaultCaseStudy = {
  problem: { title: "", description: "" },
  solution: { title: "", description: "" },
  challenges: [],
  metrics: [],
  highlightCode: { language: "", fileName: "", codeSnippet: "" },
};

const safeParseObject = (jsonText) => {
  const raw = String(jsonText ?? "").trim();
  if (!raw) return { ...defaultCaseStudy };
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...defaultCaseStudy };
    }
    return {
      ...defaultCaseStudy,
      ...parsed,
      problem: { ...defaultCaseStudy.problem, ...(parsed.problem ?? {}) },
      solution: { ...defaultCaseStudy.solution, ...(parsed.solution ?? {}) },
      challenges: Array.isArray(parsed.challenges) ? parsed.challenges : [],
      metrics: Array.isArray(parsed.metrics) ? parsed.metrics : [],
      highlightCode: {
        ...defaultCaseStudy.highlightCode,
        ...(parsed.highlightCode ?? {}),
      },
    };
  } catch {
    return { ...defaultCaseStudy };
  }
};

const CaseStudyEditor = ({ jsonText, onChangeJsonText }) => {
  const [mode, setMode] = useState("form");
  const [data, setData] = useState(() => safeParseObject(jsonText));

  useEffect(() => {
    const parsed = safeParseObject(jsonText);
    const a = JSON.stringify(parsed);
    const b = JSON.stringify(data);
    if (a !== b) setData(parsed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonText]);

  const serialized = useMemo(() => JSON.stringify(data, null, 2), [data]);

  useEffect(() => {
    const hasAnyValue = (value) => {
      if (!value) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object")
        return Object.values(value).some(hasAnyValue);
      return false;
    };

    // Only write JSON when user has started entering something
    if (hasAnyValue(data)) {
      onChangeJsonText(serialized);
    } else {
      onChangeJsonText("");
    }
  }, [data, onChangeJsonText, serialized]);

  return (
    <div className="form-group">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <label>caseStudy</label>
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
          <div className="form-grid">
            <div className="form-group">
              <label>Problem Title</label>
              <input
                type="text"
                value={data.problem.title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    problem: { ...prev.problem, title: e.target.value },
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Solution Title</label>
              <input
                type="text"
                value={data.solution.title}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    solution: { ...prev.solution, title: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Problem Description</label>
              <textarea
                rows={4}
                value={data.problem.description}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    problem: { ...prev.problem, description: e.target.value },
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Solution Description</label>
              <textarea
                rows={4}
                value={data.solution.description}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    solution: { ...prev.solution, description: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "0.75rem",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Challenges</strong>
              <button
                type="button"
                className="admin-add-new-btn"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    challenges: [
                      ...prev.challenges,
                      { title: "", description: "" },
                    ],
                  }))
                }
              >
                Ekle
              </button>
            </div>

            <div
              style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}
            >
              {data.challenges.map((c, i) => (
                <div key={`ch-${i}`} className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={c?.title ?? ""}
                      onChange={(e) => {
                        const next = [...data.challenges];
                        next[i] = { ...next[i], title: e.target.value };
                        setData((prev) => ({ ...prev, challenges: next }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input
                      type="text"
                      value={c?.description ?? ""}
                      onChange={(e) => {
                        const next = [...data.challenges];
                        next[i] = { ...next[i], description: e.target.value };
                        setData((prev) => ({ ...prev, challenges: next }));
                      }}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          challenges: prev.challenges.filter(
                            (_, idx) => idx !== i,
                          ),
                        }))
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "0.75rem",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Metrics</strong>
              <button
                type="button"
                className="admin-add-new-btn"
                onClick={() =>
                  setData((prev) => ({
                    ...prev,
                    metrics: [...prev.metrics, { label: "", value: "" }],
                  }))
                }
              >
                Ekle
              </button>
            </div>

            <div
              style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}
            >
              {data.metrics.map((m, i) => (
                <div key={`m-${i}`} className="form-grid">
                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      value={m?.label ?? ""}
                      onChange={(e) => {
                        const next = [...data.metrics];
                        next[i] = { ...next[i], label: e.target.value };
                        setData((prev) => ({ ...prev, metrics: next }));
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label>Value</label>
                    <input
                      type="text"
                      value={m?.value ?? ""}
                      onChange={(e) => {
                        const next = [...data.metrics];
                        next[i] = { ...next[i], value: e.target.value };
                        setData((prev) => ({ ...prev, metrics: next }));
                      }}
                    />
                  </div>
                  <div
                    className="form-group"
                    style={{
                      display: "flex",
                      alignItems: "end",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          metrics: prev.metrics.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              border: "1px solid rgba(0,0,0,0.1)",
              padding: "0.75rem",
              borderRadius: 10,
            }}
          >
            <strong>Highlight Code</strong>
            <div className="form-grid" style={{ marginTop: "0.75rem" }}>
              <div className="form-group">
                <label>Language</label>
                <input
                  type="text"
                  value={data.highlightCode.language}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      highlightCode: {
                        ...prev.highlightCode,
                        language: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="form-group">
                <label>File Name</label>
                <input
                  type="text"
                  value={data.highlightCode.fileName}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      highlightCode: {
                        ...prev.highlightCode,
                        fileName: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label>Code Snippet</label>
              <textarea
                rows={8}
                value={data.highlightCode.codeSnippet}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    highlightCode: {
                      ...prev.highlightCode,
                      codeSnippet: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      ) : (
        <textarea
          rows={14}
          value={serialized}
          onChange={(e) => {
            onChangeJsonText(e.target.value);
            setData(safeParseObject(e.target.value));
          }}
          className="json-textarea"
          placeholder='{"problem": {"title": "...", "description": "..."}}'
        />
      )}
    </div>
  );
};

export default CaseStudyEditor;
