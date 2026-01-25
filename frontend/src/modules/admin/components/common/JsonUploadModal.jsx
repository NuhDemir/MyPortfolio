import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import CodeRoundedIcon from "@mui/icons-material/CodeRounded";

const JsonUploadModal = ({
  isOpen,
  loading,
  title,
  jsonInput,
  onChangeJsonInput,
  onClose,
  onFilePick,
  onSubmit,
  onOpenTemplate,
  placeholder,
  filePickLabel = "Dosya Seç",
  templateButtonText = "JSON Şablonunu Gör",
}) => {
  if (!isOpen) return null;

  return (
    <div className="json-modal-overlay" onClick={onClose}>
      <div className="json-modal" onClick={(e) => e.stopPropagation()}>
        <div className="json-modal-header">
          <h2>{title}</h2>

          {typeof onFilePick === "function" ? (
            <label className="template-btn" style={{ cursor: "pointer" }}>
              <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
              <span>{filePickLabel}</span>
              <input
                type="file"
                accept="application/json,.json"
                onChange={onFilePick}
                style={{ display: "none" }}
              />
            </label>
          ) : null}

          <button
            type="button"
            onClick={onOpenTemplate}
            className="template-btn"
          >
            <CodeRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>{templateButtonText}</span>
          </button>

          <button type="button" onClick={onClose} className="modal-close-btn">
            <CloseRoundedIcon fontSize="inherit" />
          </button>
        </div>

        <div className="json-modal-body">
          <textarea
            value={jsonInput}
            onChange={(e) => onChangeJsonInput(e.target.value)}
            placeholder={placeholder}
            rows={15}
            className="json-textarea"
          />
        </div>

        <div className="json-modal-footer">
          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !String(jsonInput || "").trim()}
            className="submit-btn"
          >
            <UploadFileRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>{loading ? "Yükleniyor..." : "JSON'u Yükle"}</span>
          </button>

          <button type="button" onClick={onClose} className="cancel-btn">
            <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>İptal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonUploadModal;
