import React, { useEffect, useRef, useState, memo } from "react";
import "./BlogMermaid.css";

let mermaidLoaded = false;
let mermaidLib = null;

const loadMermaid = async () => {
  if (mermaidLoaded) return mermaidLib;
  const m = await import("mermaid");
  mermaidLib = m.default;
  mermaidLib.initialize({
    startOnLoad: false,
    theme: "dark",
    themeVariables: {
      primaryColor: "#6366f1",
      primaryTextColor: "#f8f8f2",
      primaryBorderColor: "#4f46e5",
      lineColor: "#94a3b8",
      secondaryColor: "#1e1e2e",
      tertiaryColor: "#2a2a3e",
      background: "#13131f",
      mainBkg: "#1e1e2e",
      nodeBorder: "#4f46e5",
      clusterBkg: "#252535",
      titleColor: "#f8f8f2",
      edgeLabelBackground: "#1e1e2e",
      fontFamily: "var(--ds-font-body, sans-serif)",
    },
    flowchart: { useMaxWidth: true, curve: "basis" },
  });
  mermaidLoaded = true;
  return mermaidLib;
};

const BlogMermaid = memo(({ code }) => {
  const containerRef = useRef(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const m = await loadMermaid();
        if (cancelled || !containerRef.current) return;
        const { svg } = await m.render(idRef.current, code.trim());
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        // Make SVG responsive
        const svgEl = containerRef.current.querySelector("svg");
        if (svgEl) {
          svgEl.removeAttribute("height");
          svgEl.style.maxWidth = "100%";
          svgEl.style.height = "auto";
        }
        setStatus("ready");
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err?.message || "Diagram render hatasi.");
          setStatus("error");
        }
      }
    };
    render();
    return () => { cancelled = true; };
  }, [code]);

  if (status === "error") {
    return (
      <div className="bmm-wrap bmm-wrap--error">
        <div className="bmm-error-header">
          <span className="bmm-badge">Mermaid</span>
          <span className="bmm-error-msg">Diagram olusturulamadi: {errorMsg}</span>
        </div>
        <pre className="bmm-raw-code">{code}</pre>
      </div>
    );
  }

  return (
    <div className="bmm-wrap">
      <div className="bmm-badge-row">
        <span className="bmm-badge">Diagram</span>
      </div>
      {status === "loading" && (
        <div className="bmm-skeleton">
          <span className="bmm-skeleton__dot" />
          <span className="bmm-skeleton__dot" />
          <span className="bmm-skeleton__dot" />
        </div>
      )}
      <div ref={containerRef} className="bmm-diagram" />
    </div>
  );
});

BlogMermaid.displayName = "BlogMermaid";
export default BlogMermaid;
