import React, { memo, useEffect, useState, useId, useCallback, useRef } from "react";
import { Maximize2, X, ZoomIn, ZoomOut, RotateCcw, GitBranch } from "lucide-react";
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

// Compact, Apple-HIG-leaning theme tokens — smaller type, tighter spacing,
// softer strokes so diagrams read as part of the article, not a foreign chart.
const THEME_VARS = {
  light: {
    fontSize: "13px",
    primaryColor: "#eef2ff",
    primaryBorderColor: "#6366f1",
    primaryTextColor: "#1f2430",
    lineColor: "#a1a8b8",
    secondaryColor: "#f4f5f7",
    tertiaryColor: "#ffffff",
    edgeLabelBackground: "#ffffff",
    clusterBkg: "#f6f7fb",
    clusterBorder: "#e2e5ec",
  },
  dark: {
    fontSize: "13px",
    primaryColor: "#232538",
    primaryBorderColor: "#818cf8",
    primaryTextColor: "#e7e9f2",
    lineColor: "#565b73",
    secondaryColor: "#1c1e2c",
    tertiaryColor: "#15161f",
    edgeLabelBackground: "#1c1e2c",
    clusterBkg: "#1a1b28",
    clusterBorder: "#2c2f42",
  },
};

const buildConfig = (theme) => ({
  startOnLoad: false,
  securityLevel: "strict",
  fontFamily: "var(--ds-font-body, -apple-system, 'SF Pro Text', Inter, sans-serif)",
  theme: theme === "dark" ? "dark" : "base",
  themeVariables: theme === "dark" ? THEME_VARS.dark : THEME_VARS.light,
  flowchart: { useMaxWidth: false, htmlLabels: true, curve: "basis", padding: 12, nodeSpacing: 32, rankSpacing: 42 },
  sequence: { useMaxWidth: false, wrap: true, boxMargin: 8, messageFontSize: 13, actorFontSize: 13 },
  gantt: { useMaxWidth: false },
  pie: { useMaxWidth: false },
  er: { useMaxWidth: false },
  journey: { useMaxWidth: false },
  mindmap: { useMaxWidth: false },
  state: { useMaxWidth: false },
});

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.5;
const ZOOM_STEP = 0.25;

const BlogMermaid = memo(({ chart }) => {
  const { theme } = useTheme();
  const uid = useId().replace(/[:]/g, "");
  const [svg, setSvg] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const modalScrollRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const render = async () => {
      if (!chart || !chart.trim()) {
        setError("Bos diyagram verisi.");
        return;
      }
      try {
        const mermaid = await getMermaid();
        mermaid.initialize(buildConfig(theme));
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
    setZoom(1);
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
  const zoomIn = useCallback(() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2))), []);
  const zoomReset = useCallback(() => setZoom(1), []);

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
        <div className="bm-toolbar">
          <span className="bm-toolbar__label">
            <GitBranch size={13} />
            Diyagram
          </span>
          <button
            type="button"
            className="bm-toolbar__btn"
            onClick={openExpanded}
            aria-label="Diyagrami buyut"
            title="Buyut"
          >
            <Maximize2 size={14} />
          </button>
        </div>
        <div className="bm-scroll">
          <div className="bm-diagram" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </div>

      {expanded && (
        <div className="bm-modal-overlay" onClick={closeExpanded} role="presentation">
          <div className="bm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="bm-modal-toolbar">
              <span className="bm-toolbar__label bm-toolbar__label--modal">
                <GitBranch size={13} />
                Diyagram
              </span>
              <div className="bm-zoom-group">
                <button type="button" className="bm-toolbar__btn" onClick={zoomOut} disabled={zoom <= ZOOM_MIN} aria-label="Uzaklastir">
                  <ZoomOut size={14} />
                </button>
                <span className="bm-zoom-value">{Math.round(zoom * 100)}%</span>
                <button type="button" className="bm-toolbar__btn" onClick={zoomIn} disabled={zoom >= ZOOM_MAX} aria-label="Yakinlastir">
                  <ZoomIn size={14} />
                </button>
                <button type="button" className="bm-toolbar__btn" onClick={zoomReset} aria-label="Sifirla">
                  <RotateCcw size={13} />
                </button>
              </div>
              <button type="button" className="bm-modal-close" onClick={closeExpanded} aria-label="Kapat">
                <X size={18} />
              </button>
            </div>
            <div className="bm-modal-scroll" ref={modalScrollRef}>
              <div
                className="bm-diagram bm-diagram--expanded"
                style={{ transform: `scale(${zoom})` }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

BlogMermaid.displayName = "BlogMermaid";
export default BlogMermaid;
