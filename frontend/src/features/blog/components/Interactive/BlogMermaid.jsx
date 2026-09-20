import React, { memo, useEffect, useState, useId, useCallback } from "react";
import { Maximize2, X } from "lucide-react";
import { useTheme } from "../../../../core/context/ThemeContext.jsx";
import "./BlogMermaid.css";

let mermaidInstance = null;
const getMermaid = async () => {
  if (!mermaidInstance) {
    const mod = await import("mermaid");
    mermaidInstance = mod.default;
  }
  return mermaidInstance;
};

const MERMAID_BASE_CONFIG = {
  startOnLoad: false,
  securityLevel: "strict",
  fontFamily: "var(--ds-font-body, -apple-system, 'SF Pro Text', Inter, sans-serif)",
  flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
  sequence: { useMaxWidth: true, wrap: true },
  gantt: { useMaxWidth: true },
  pie: { useMaxWidth: true },
  er: { useMaxWidth: true },
  journey: { useMaxWidth: true },
  mindmap: { useMaxWidth: true },
  state: { useMaxWidth: true },
};

const BlogMermaid = memo(({ chart }) => {
  const { theme } = useTheme();
  const uid = useId().replace(/[:]/g, "");
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!chart || !chart.trim()) {
        setError("Bos diyagram verisi.");
        return;
      }
      try {
        const mermaid = await getMermaid();
        mermaid.initialize({
          ...MERMAID_BASE_CONFIG,
          theme: theme === "dark" ? "dark" : "default",
        });
        const { svg: renderedSvg } = await mermaid.render(`bm-${uid}`, chart.trim());
        if (!cancelled) {
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message || "Diyagram render edilemedi.");
          setSvg(null);
        }
      }
    };

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, theme, uid]);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setExpanded(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [expanded]);

  const openExpanded = useCallback(() => setExpanded(true), []);
  const closeExpanded = useCallback(() => setExpanded(false), []);

  if (error) {
    return (
      <div className="bm-error">
        <span>&#9888; Mermaid diyagrami olusturulamadi: {error}</span>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bm-loading">
        <div className="bm-loading__spinner" />
        <span>Diyagram olusturuluyor...</span>
      </div>
    );
  }

  return (
    <>
      <div className="bm-wrap">
        <button
          type="button"
          className="bm-expand-btn"
          onClick={openExpanded}
          aria-label="Diyagrami buyut"
          title="Buyut"
        >
          <Maximize2 size={15} />
        </button>
        <div className="bm-scroll">
          <div className="bm-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>

      {expanded && (
        <div className="bm-modal-overlay" onClick={closeExpanded} role="presentation">
          <div className="bm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button
              type="button"
              className="bm-modal-close"
              onClick={closeExpanded}
              aria-label="Kapat"
            >
              <X size={18} />
            </button>
            <div className="bm-modal-scroll">
              <div className="bm-diagram bm-diagram--expanded" dangerouslySetInnerHTML={{ __html: svg }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

BlogMermaid.displayName = "BlogMermaid";
export default BlogMermaid;
