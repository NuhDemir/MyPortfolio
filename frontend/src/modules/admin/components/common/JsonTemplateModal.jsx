import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const JsonTemplateModal = ({
  isOpen,
  onClose,
  template,
  onCopy,
  description,
  infoItems,
  title = "JSON Şablonu",
  infoTitle = "Alan Açıklamaları:",
}) => {
  if (!isOpen) return null;

  return (
    <div className="json-modal-overlay" onClick={onClose}>
      <div
        className="json-modal template-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="json-modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} className="modal-close-btn">
            <CloseRoundedIcon fontSize="inherit" />
          </button>
        </div>

        <div className="json-modal-body">
          {description ? (
            <p className="template-description">{description}</p>
          ) : null}

          <pre className="json-template-code">
            <code>{JSON.stringify(template, null, 2)}</code>
          </pre>

          {Array.isArray(infoItems) && infoItems.length > 0 ? (
            <div className="template-info">
              <h3>{infoTitle}</h3>
              <ul>
                {infoItems.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong>: {item.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="json-modal-footer">
          <button type="button" onClick={onCopy} className="submit-btn">
            Şablonu Kopyala
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            <CloseRoundedIcon className="btn-icon" fontSize="inherit" />
            <span>Kapat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonTemplateModal;
