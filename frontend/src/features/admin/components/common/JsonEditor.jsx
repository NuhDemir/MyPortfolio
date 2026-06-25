import { useRef, useCallback, useMemo } from "react";
import { highlightJson, formatJson, isValidJson } from "../../utils/jsonHighlighter.js";
import "./JsonEditor.css";

const JsonEditor = ({ value, onChange, placeholder, rows = 15, validator }) => {
  const textareaRef = useRef(null);
  const highlightRef = useRef(null);

  const highlighted = useMemo(() => highlightJson(value), [value]);

  const validation = useMemo(() => {
    if (validator) return validator(value);
    const valid = isValidJson(value);
    return {
      valid,
      errors: valid ? [] : value.trim() ? ["Gecersiz JSON formati."] : [],
    };
  }, [value, validator]);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleChange = useCallback((e) => onChange(e.target.value), [onChange]);

  const handleFormat = useCallback(() => {
    const formatted = validation.formatted || formatJson(value);
    if (formatted !== value) onChange(formatted);
  }, [value, onChange, validation.formatted]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = value.substring(0, start) + "  " + value.substring(end);
        onChange(newValue);
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + 2; });
      }
    },
    [value, onChange],
  );

  return (
    <div className="json-editor">
      <div className="json-editor__toolbar">
        <span className={`json-editor__status ${validation.valid ? "json-editor__status--valid" : value.trim() ? "json-editor__status--invalid" : ""}`}>
          {validation.valid ? "Gecerli" : value.trim() ? `${validation.errors.length} hata` : ""}
        </span>
        <button type="button" className="admin-btn admin-btn--secondary" onClick={handleFormat}>
          Format
        </button>
      </div>

      {validation.errors.length > 0 && (
        <ul className="json-editor__errors">
          {validation.errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <div className="json-editor__container">
        <pre ref={highlightRef} className="json-editor__highlight" aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: highlighted + "\n" }} />
        <textarea ref={textareaRef} value={value} onChange={handleChange}
          onScroll={syncScroll} onKeyDown={handleKeyDown} placeholder={placeholder}
          rows={rows} className="json-editor__textarea"
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off" />
      </div>
    </div>
  );
};

export default JsonEditor;
