import React, { useState, useCallback, memo } from "react";
import Modal from "../../../../shared/ui/Modal.jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Play } from "lucide-react";
import "./BlogCodePlayground.css";

const SAFE_CONSOLE_EXEC = (code) => {
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push({ type: "log", msg: args.map(a => {
      try { return typeof a === "object" ? JSON.stringify(a, null, 2) : String(a); } catch { return String(a); }
    }).join(" ") }),
    error: (...args) => logs.push({ type: "error", msg: args.map(a => String(a)).join(" ") }),
    warn: (...args) => logs.push({ type: "warn", msg: args.map(a => String(a)).join(" ") }),
    info: (...args) => logs.push({ type: "info", msg: args.map(a => String(a)).join(" ") }),
  };

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("console", code);
    fn(mockConsole);
    return { logs, error: null };
  } catch (err) {
    return { logs, error: err.message };
  }
};

const BlogCodePlayground = memo(({ code: initialCode, language = "javascript", title }) => {
  const [editorCode, setEditorCode] = useState(initialCode || "");
  const [output, setOutput] = useState([]);
  const [runError, setRunError] = useState(null);
  const [hasRun, setHasRun] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRun = useCallback(() => {
    const { logs, error } = SAFE_CONSOLE_EXEC(editorCode);
    setOutput(logs);
    setRunError(error);
    setHasRun(true);
  }, [editorCode]);

  const handleClear = useCallback(() => {
    setOutput([]);
    setRunError(null);
    setHasRun(false);
  }, []);

  const handleReset = useCallback(() => {
    setEditorCode(initialCode || "");
    handleClear();
  }, [initialCode, handleClear]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = editorCode.slice(0, start) + "  " + editorCode.slice(end);
      setEditorCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = start + 2;
        e.target.selectionEnd = start + 2;
      }, 0);
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleRun();
    }
  };

  return (
    <>
      <div 
        className="bcp-text-snippet-wrapper" 
        onClick={() => setIsModalOpen(true)}
      >
        <SyntaxHighlighter
          PreTag="div"
          language={language || "javascript"}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: 0, background: "transparent", display: "block" }}
          showLineNumbers={false}
          wrapLines={true}
          wrapLongLines={true}
        >
          {initialCode}
        </SyntaxHighlighter>
        <div className="bcp-snippet-hover-overlay">
          <Play size={16} fill="currentColor" /> <span>Playground'da Aç</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={title ? `Playground - ${title}` : "Code Playground"}
      >
        <div className="bcp-wrap bcp-wrap--modal">
          <div className="bcp-header">
            <div className="bcp-header__left">
              <span className="bcp-badge">Live</span>
              <span className="bcp-lang">{language}</span>
              {title && <span className="bcp-title">{title}</span>}
            </div>
            <div className="bcp-header__actions">
              <button className="bcp-btn bcp-btn--ghost" onClick={handleReset} title="Baslangica don">
                Reset
              </button>
              <button className="bcp-btn bcp-btn--ghost" onClick={handleClear} title="Temizle">
                Temizle
              </button>
              <button className="bcp-btn bcp-btn--run" onClick={handleRun} title="Ctrl+Enter">
                ▶ Calistir
              </button>
            </div>
          </div>

          <div className="bcp-editor-area">
            <div className="bcp-line-numbers" aria-hidden="true">
              {editorCode.split("\n").map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              className="bcp-textarea"
              value={editorCode}
              onChange={e => setEditorCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Kod editoru"
              rows={Math.max(5, editorCode.split("\n").length + 1)}
            />
          </div>

          {hasRun && (
            <div className="bcp-output">
              <div className="bcp-output__header">
                <span>Konsol Ciktisi</span>
                <span className="bcp-output__count">
                  {output.length} satir
                </span>
              </div>
              <div className="bcp-output__body">
                {runError && (
                  <div className="bcp-output__line bcp-output__line--error">
                    <span className="bcp-output__prefix">✗</span>
                    <span>{runError}</span>
                  </div>
                )}
                {output.length === 0 && !runError && (
                  <div className="bcp-output__line bcp-output__line--empty">
                    Cikti yok.
                  </div>
                )}
                {output.map((log, i) => (
                  <div key={i} className={`bcp-output__line bcp-output__line--${log.type}`}>
                    <span className="bcp-output__prefix">
                      {log.type === "error" ? "✗" : log.type === "warn" ? "⚠" : "›"}
                    </span>
                    <pre>{log.msg}</pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bcp-footer">
            <span>Ctrl+Enter ile calistir</span>
          </div>
        </div>
      </Modal>
    </>
  );
});

BlogCodePlayground.displayName = "BlogCodePlayground";
export default BlogCodePlayground;
