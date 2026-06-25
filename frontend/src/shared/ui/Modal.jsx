// src/components/common/Modal.jsx
import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import "@shared/design-system/components/Modal.css";
import { useAboutModalGsapAnimation, PatternBackground } from "@shared";

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  // GSAP animasyon hook'undan modal fonksiyonlarını al
  const { animateModalOpen, animateModalClose } = useAboutModalGsapAnimation();

  useEffect(() => {
    const modalElement = modalRef.current;
    const overlayElement = overlayRef.current;

    if (isOpen && modalElement && overlayElement) {
      // Açılma animasyonunu tetikle
      animateModalOpen(overlayElement, modalElement);

      // Dışarı tıklama ve Escape tuşu dinleyicileri
      const handleClickOutside = (event) => {
        if (overlayElement && event.target === overlayElement) {
          handleCloseClick(); // Kapanma animasyonuyla kapat
        }
      };
      const handleEscapeKey = (event) => {
        if (event.key === "Escape") {
          handleCloseClick(); // Kapanma animasyonuyla kapat
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);

      // Temizleme
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isOpen, onClose, animateModalOpen]); // Sadece isOpen değiştiğinde çalıştır

  // Kapanma butonu için animasyonlu kapatma
  const handleCloseClick = () => {
    if (overlayRef.current && modalRef.current) {
      animateModalClose(overlayRef.current, modalRef.current, onClose); // Animasyon bitince onClose çağrılır
    } else {
      onClose(); // Yedek olarak direkt kapat
    }
  };

  // isOpen false ise render etme (performans)
  if (!isOpen) {
    return null;
  }

  return (
    // Overlay (arka plan karartması)
    <div className="modal-overlay" ref={overlayRef}>
      {/* Modal Konteyneri */}
      <div className="modal-container" ref={modalRef}>
        <PatternBackground variant="naiveSketch" opacity={0.06} />
        {/* Modal Başlığı */}
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            onClick={handleCloseClick}
            className="modal-close-button"
            aria-label="Kapat"
          >
            <IoClose size={24} />
          </button>
        </div>
        {/* Modal İçeriği */}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
