import React from "react";
import { useEffect, useRef, useState } from "react";
import { X, ExternalLink, Github } from "lucide-react";
import "@shared/styles/common/ProjectModal.css";

const ProjectModal = ({ project, isOpen, onClose }) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [hasMediaError, setHasMediaError] = useState(false);

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

  // Efekt 2: Focus trap + ESC kapatma + kapanınca önceki odağa geri dön
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    previousFocusRef.current = document.activeElement;

    const getFocusableElements = () =>
      Array.from(
        modalElement.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        ),
      );

    const focusableElements = getFocusableElements();
    const initialFocus = focusableElements[0] || modalElement;
    initialFocus.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = getFocusableElements();

      if (elements.length === 0) {
        event.preventDefault();
        modalElement.focus();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (
          activeElement === firstElement ||
          !modalElement.contains(activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (
        previousFocusRef.current &&
        typeof previousFocusRef.current.focus === "function"
      ) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const tags = Array.isArray(project?.tags) ? project.tags : [];
  const techStack = Array.isArray(project?.techStack) ? project.techStack : [];
  const hasDetailsHtml =
    typeof project?.details === "string" && project.details.trim().length > 0;
  const descriptionText =
    typeof project?.description === "string" ? project.description.trim() : "";

  const title = project?.metadata?.title || project?.title;
  const tagline = project?.metadata?.tagline || "";
  const platform = project?.metadata?.platform;
  const role = project?.metadata?.role;
  const status = project?.metadata?.status || project.status;
  const createdAt = project?.metadata?.createdAt || project.createdAt;
  const isFeatured = project?.isFeatured === true || project?.featured === true;

  const thumbnailUrl =
    project?.visuals?.thumbnailUrl || project.imageUrl || undefined;
  const heroVideoUrl = project?.visuals?.heroVideoUrl || undefined;

  const liveUrl = project?.links?.liveDemo || project.liveUrl;
  const githubUrl = project?.links?.github || project.githubUrl;
  const figmaUrl = project?.links?.figma;

  const caseStudy = project?.caseStudy;
  const challenges = Array.isArray(caseStudy?.challenges)
    ? caseStudy.challenges
    : [];
  const metrics = Array.isArray(caseStudy?.metrics) ? caseStudy.metrics : [];
  const modalTitleId = "project-modal-title";
  const hasVisualMedia =
    Boolean(heroVideoUrl || thumbnailUrl) && !hasMediaError;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setIsMediaReady(false);
    setHasMediaError(false);
  }, [isOpen, heroVideoUrl, thumbnailUrl]);

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
        ref={modalRef}
        className="project-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalTitleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3. Başlık Çubuğu: Nostaljik pencere başlığı */}
        <div className="project-modal-header">
          {/* Sahte pencere kontrol butonları (sadece görsel) */}
          <div className="project-modal-window-controls">
            <span />
            <span />
          </div>
          <h2 className="project-modal-title" id={modalTitleId}>
            {title}
          </h2>
          <button
            className="project-modal-close-btn"
            type="button"
            onClick={onClose}
            aria-label="Kapat"
          >
            <X size={16} strokeWidth={3} />
          </button>
        </div>

        {/* 4. Ana İçerik Alanı: Kaydırılabilir bölüm */}
        <div className="project-modal-content">
          {/* Sol Sütun: Proje Görseli */}
          <div
            className={`project-modal-image-wrapper ${
              !isMediaReady && hasVisualMedia ? "is-loading" : ""
            }`}
          >
            {!isMediaReady && hasVisualMedia ? (
              <div
                className="project-modal-media-skeleton"
                aria-hidden="true"
              />
            ) : null}

            {heroVideoUrl ? (
              <video
                className={`project-modal-hero-video project-modal-media ${
                  isMediaReady ? "is-ready" : ""
                }`}
                src={heroVideoUrl}
                preload="metadata"
                muted
                playsInline
                autoPlay
                loop
                onLoadedData={() => setIsMediaReady(true)}
                onError={() => {
                  setHasMediaError(true);
                  setIsMediaReady(false);
                }}
              />
            ) : thumbnailUrl ? (
              <img
                className={`project-modal-media ${isMediaReady ? "is-ready" : ""}`}
                src={thumbnailUrl}
                alt={`${title} görseli`}
                loading="lazy"
                width={1280}
                height={720}
                onLoad={() => setIsMediaReady(true)}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  setHasMediaError(true);
                  setIsMediaReady(false);
                }}
              />
            ) : (
              <div className="project-modal-image-fallback">
                Proje gorseli yakinda eklenecek
              </div>
            )}

            {hasMediaError ? (
              <div className="project-modal-image-fallback">
                Medya yuklenemedi
              </div>
            ) : null}
          </div>

          {/* Sağ Sütun: Proje Detayları */}
          <div className="project-modal-details">
            {/* Meta bilgiler (category/status/featured) */}
            <div className="project-modal-meta" aria-label="Proje bilgileri">
              {project.category && (
                <span className="project-modal-meta-chip">
                  Kategori: {project.category}
                </span>
              )}
              {status && (
                <span className="project-modal-meta-chip">Durum: {status}</span>
              )}
              {platform && (
                <span className="project-modal-meta-chip">
                  Platform: {platform}
                </span>
              )}
              {role && (
                <span className="project-modal-meta-chip">Rol: {role}</span>
              )}
              {createdAt && (
                <span className="project-modal-meta-chip">
                  Tarih: {new Date(createdAt).toLocaleDateString("tr-TR")}
                </span>
              )}
              {isFeatured && (
                <span
                  className="project-modal-meta-chip"
                  data-variant="featured"
                >
                  Featured
                </span>
              )}
            </div>

            {/* Proje hakkında detaylı bilgi (HTML olarak render edilir) */}
            <div className="project-modal-description">
              {hasDetailsHtml ? (
                <div dangerouslySetInnerHTML={{ __html: project.details }} />
              ) : (
                <>
                  {tagline ? (
                    <p className="project-modal-tagline">{tagline}</p>
                  ) : null}
                  {descriptionText ? <p>{descriptionText}</p> : null}
                </>
              )}
            </div>

            {/* Case Study */}
            {caseStudy && (
              <div className="project-modal-case">
                <h4>Case Study</h4>

                {(caseStudy.problem?.title ||
                  caseStudy.problem?.description) && (
                  <div className="project-modal-case-block">
                    <h5>{caseStudy.problem?.title || "Problem"}</h5>
                    {caseStudy.problem?.description ? (
                      <p>{caseStudy.problem.description}</p>
                    ) : null}
                  </div>
                )}

                {(caseStudy.solution?.title ||
                  caseStudy.solution?.description) && (
                  <div className="project-modal-case-block">
                    <h5>{caseStudy.solution?.title || "Solution"}</h5>
                    {caseStudy.solution?.description ? (
                      <p>{caseStudy.solution.description}</p>
                    ) : null}
                  </div>
                )}

                {challenges.length > 0 && (
                  <div className="project-modal-case-block">
                    <h5>Challenges</h5>
                    <ul>
                      {challenges.map((item, index) => (
                        <li key={index}>
                          <strong>{item.title}</strong>
                          {item.description ? ` — ${item.description}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {metrics.length > 0 && (
                  <div className="project-modal-metrics">
                    {metrics.map((metric, index) => (
                      <div key={index} className="project-modal-metric">
                        <span className="project-modal-metric-label">
                          {metric.label}
                        </span>
                        <span className="project-modal-metric-value">
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {caseStudy.highlightCode?.codeSnippet && (
                  <div className="project-modal-code">
                    <div className="project-modal-code-head">
                      <span>
                        {caseStudy.highlightCode.fileName || "highlight"}
                      </span>
                      <span className="project-modal-code-lang">
                        {caseStudy.highlightCode.language || "code"}
                      </span>
                    </div>
                    <pre className="project-modal-code-pre">
                      <code>{caseStudy.highlightCode.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Kullanılan Teknolojiler */}
            <div className="project-modal-tags-section">
              <h4>Teknolojiler</h4>
              {techStack.length > 0 ? (
                <div className="project-modal-techstack">
                  {techStack.map((group, index) => (
                    <div key={index} className="project-modal-tech-group">
                      <div className="project-modal-tech-category">
                        {group.category}
                      </div>
                      <div className="project-modal-tags">
                        {(group.items || []).map((item, itemIndex) => (
                          <span key={itemIndex} className="project-modal-tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="project-modal-tags">
                  {tags.map((tag, index) => (
                    <span key={index} className="project-modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Link Butonları */}
            <div className="project-modal-links">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <ExternalLink size={18} />
                  <span>Siteyi Ziyaret Et</span>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <Github size={18} />
                  <span>GitHub Reposu</span>
                </a>
              )}
              {figmaUrl && (
                <a
                  href={figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link-btn"
                >
                  <ExternalLink size={18} />
                  <span>Figma</span>
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
