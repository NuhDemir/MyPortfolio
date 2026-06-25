import { X } from "lucide-react";
import "./JsonModal.css";

const JsonTemplateModal = ({ isOpen, onClose, template, onCopy, description, infoItems, title = "JSON Sablonu", infoTitle = "Alan Aciklamalari:" }) => {
  if (!isOpen) return null;

  return (
    <div className="json-modal-overlay" onClick={onClose}>
      <div className="json-modal" onClick={(e) => e.stopPropagation()}>
        <div className="json-modal-header">
          <h2>{title}</h2>
          <button type="button" onClick={onClose} className="json-modal-close">
            <X size={18} />
          </button>
        </div>

        <div className="json-modal-body">
          {description && <p className="json-modal-desc">{description}</p>}

          <pre className="json-modal-code">
            <code>{JSON.stringify(template, null, 2)}</code>
          </pre>

          {Array.isArray(infoItems) && infoItems.length > 0 && (
            <div className="json-modal-info">
              <h3>{infoTitle}</h3>
              <ul>
                {infoItems.map((item) => (
                  <li key={item.label}>
                    <strong>{item.label}</strong>: {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="json-modal-footer">
          <button type="button" onClick={onClose} className="admin-btn admin-btn--cancel">
            <X size={14} />
            Kapat
          </button>
          <button type="button" onClick={onCopy} className="admin-btn admin-btn--primary">
            Sablonu Kopyala
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonTemplateModal;
