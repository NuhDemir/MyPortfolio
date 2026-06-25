import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { PatternBackground, useModalAnimation } from "@shared";
import { overlayVariants, panelSlideDown } from "@shared/hooks/useModalAnimation";

const ServiceModal = ({ service, onClose }) => {
  const isOpen = Boolean(service);
  const { panelRef } = useModalAnimation(isOpen, onClose);

  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="svc-modal-overlay"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          ref={panelRef}
          className="svc-modal"
          variants={panelSlideDown}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="svc-modal-close"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={22} />
          </button>

          <div className="svc-modal-grid">
            <div className="svc-modal-visual">
              <PatternBackground seed={service.id} opacity={0.12} />
              <span className="svc-modal-fallback">{service.title[0]}</span>
            </div>

            <div className="svc-modal-content">
              <span className="svc-modal-badge">Servis</span>
              <h2 className="svc-modal-title">{service.title}</h2>

              <div className="svc-modal-section">
                <h3 className="svc-modal-label">Problem</h3>
                <p className="svc-modal-text">{service.problem}</p>
              </div>

              <div className="svc-modal-section">
                <h3 className="svc-modal-label">Çözüm</h3>
                <p className="svc-modal-text">{service.solution || service.desc}</p>
              </div>

              {service.tech?.length > 0 && (
                <div className="svc-modal-section">
                  <h3 className="svc-modal-label">Kullandığım Teknolojiler</h3>
                  <div className="svc-modal-tech">
                    {service.tech.map((t) => (
                      <span key={t} className="svc-modal-tech-pill">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {service.links?.length > 0 && (
                <div className="svc-modal-links">
                  {service.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="svc-modal-link"
                    >
                      {l.label} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ServiceModal;
