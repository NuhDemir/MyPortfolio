import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { X, ExternalLink } from "lucide-react";
import { PatternBackground } from "@shared";

const ServiceModal = ({ service, onClose }) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 60, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" });
    });
    document.body.style.overflow = "hidden";
    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, { opacity: 0, y: 30, scale: 0.97, duration: 0.25, ease: "power2.in" });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.25, onComplete: onClose });
  };

  return (
    <div ref={overlayRef} className="svc-modal-overlay" onClick={handleClose}>
      <div ref={panelRef} className="svc-modal" onClick={(e) => e.stopPropagation()}>
        <button className="svc-modal-close" onClick={handleClose}><X size={22} /></button>

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
                  <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" className="svc-modal-link">
                    {l.label} <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
