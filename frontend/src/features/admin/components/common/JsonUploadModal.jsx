import { X, Upload, Code } from "lucide-react";
import JsonEditor from "./JsonEditor.jsx";
import "./JsonModal.css";

const JsonUploadModal = ({ isOpen, loading, title, jsonInput, onChangeJsonInput, onClose, onFilePick, onSubmit, onOpenTemplate, placeholder, filePickLabel = "Dosya Sec", templateButtonText = "JSON Sablonunu Gor", validator }) => {
  if (!isOpen) return null;

  return (
    <div className="json-modal-overlay" onClick={onClose}>
      <div className="json-modal" onClick={(e) => e.stopPropagation()}>
        <div className="json-modal-header">
          <h2>{title}</h2>

          {typeof onFilePick === "function" && (
            <label className="admin-btn admin-btn--secondary json-modal-file-btn">
              <Upload size={14} />
              {filePickLabel}
              <input type="file" accept="application/json,.json" onChange={onFilePick} hidden />
            </label>
          )}

          <button type="button" onClick={onOpenTemplate} className="admin-btn admin-btn--secondary">
            <Code size={14} />
            {templateButtonText}
          </button>

          <button type="button" onClick={onClose} className="json-modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="json-modal-body">
          <JsonEditor
            value={jsonInput}
            onChange={onChangeJsonInput}
            placeholder={placeholder}
            validator={validator}
          />
        </div>

        <div className="json-modal-footer">
          <button type="button" onClick={onClose} className="admin-btn admin-btn--cancel">
            <X size={14} />
            Iptal
          </button>
          <button type="button" onClick={onSubmit} disabled={loading || !String(jsonInput || "").trim()} className="admin-btn admin-btn--primary">
            <Upload size={14} />
            {loading ? "Yukleniyor..." : "JSON'u Yukle"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonUploadModal;
