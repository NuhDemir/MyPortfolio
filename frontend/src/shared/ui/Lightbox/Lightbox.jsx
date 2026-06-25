import { useEffect } from "react";
import { X } from "lucide-react";
import "./Lightbox.css";

const Lightbox = ({ open, onClose, src, alt }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="lightbox__inner" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox__close" onClick={onClose} aria-label="Kapat">
          <X size={24} strokeWidth={2} />
        </button>
        <div className="lightbox__media">
          <img src={src} alt={alt || "Onizleme"} draggable={false} />
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
