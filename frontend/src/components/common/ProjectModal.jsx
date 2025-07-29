import React from "react";
import { useEffect } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import "./style/ProjectModal.css";

const ProjectModal = ({ project, isOpen, onClose }) => {
  // Efekt 1: Modal açıkken arkadaki sayfanın kaymasını engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    // Component kaldırıldığında (unmount) stilin temizlendiğinden emin ol
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Efekt 2: "Escape" tuşuna basıldığında modalı kapat
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Olay dinleyicisini ekle
    window.addEventListener("keydown", handleKeyDown);

    // Temizlik: Component kaldırıldığında olay dinleyicisini kaldır
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]); // onClose değişirse (genellikle değişmez) yeniden çalıştır

  // Eğer modalın açık olmaması gerekiyorsa veya gösterilecek proje verisi yoksa,
  // hiçbir şey render etme (boş dön).
  if (!isOpen || !project) {
    return null;
  }

  return (
    // 1. Overlay: Tüm ekranı kaplayan yarı saydam arka plan.
    // Tıklandığında `onClose` fonksiyonunu tetikler.
    <div className="project-modal-overlay" onClick={onClose}>
      {/* 2. Modal Konteyneri: İçerik kutusu.
          Tıklamaların overlay'e gitmesini engellemek için `stopPropagation` kullanılır. */}
      <div
        className="project-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. Başlık Çubuğu: Nostaljik pencere başlığı */}
        <div className="project-modal-header">
          {/* Sahte pencere kontrol butonları (sadece görsel) */}
          <div className="project-modal-window-controls">
            <span />
            <span />
          </div>
          <h2 className="project-modal-title">{project.title}</h2>
          <button
            className="project-modal-close-btn"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* 4. Ana İçerik Alanı: Kaydırılabilir bölüm */}
        <div className="project-modal-content">
          {/* Sol Sütun: Proje Görseli */}
          <div className="project-modal-image-wrapper">
            <img src={project.imageUrl} alt={`${project.title} görseli`} />
          </div>

          {/* Sağ Sütun: Proje Detayları */}
          <div className="project-modal-details">
            {/* Proje hakkında detaylı bilgi (HTML olarak render edilir) */}
            <div
              className="project-modal-description"
              dangerouslySetInnerHTML={{ __html: project.details }}
            />

            {/* Kullanılan Teknolojiler */}
            <div className="project-modal-tags-section">
              <h4>Teknolojiler</h4>
              <div className="project-modal-tags">
                {project.tags.map((tag, index) => (
                  <span key={index} className="project-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Link Butonları */}
            <div className="project-modal-links">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <ExternalLink size={18} />
                  <span>Siteyi Ziyaret Et</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <Github size={18} />
                  <span>GitHub Reposu</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
