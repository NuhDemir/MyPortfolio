import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { Navbar } from "@modules/navbar/components/Navbar/Navbar.jsx";
import SocialLinks from "@modules/social/components/SocialLinks/SocialLinks.jsx";
import ScrollToTop from "@shared/ui/ScrollToTop.jsx";
import {
  FALLBACK_PROJECTS as fallbackProjects,
  fetchProjects,
} from "@modules/projects/services/projectService.js";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./ProjectDetailsPage.css";

const REQUEST_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
};

const isProjectFeatured = (project) =>
  project?.isFeatured === true || project?.featured === true;

const getProjectTitle = (project) =>
  project?.metadata?.title || project?.title || "";

const getProjectTagline = (project) =>
  project?.metadata?.tagline || project?.description || "";

const getProjectPlatform = (project) =>
  project?.metadata?.platform || project?.platform || "";

const getProjectRole = (project) =>
  project?.metadata?.role || project?.role || "";

const getProjectTeam = (project) =>
  project?.metadata?.team || project?.team || "";

const getProjectDuration = (project) =>
  project?.metadata?.duration || project?.duration || "";

const getProjectCreatedAt = (project) =>
  project?.metadata?.createdAt || project?.createdAt || "";

const getProjectLinks = (project) => ({
  liveDemo: project?.links?.liveDemo || project?.liveUrl || "",
  github: project?.links?.github || project?.githubUrl || "",
  figma: project?.links?.figma || project?.figmaUrl || "",
});

const getProjectHeroMedia = (project) => ({
  heroVideoUrl: project?.visuals?.heroVideoUrl || "",
  thumbnailUrl: project?.visuals?.thumbnailUrl || project?.imageUrl || "",
});

const hasCaseStudy = (project) => {
  const cs = project?.caseStudy;
  if (!cs || typeof cs !== "object") return false;
  return Boolean(
    cs?.problem?.description ||
    cs?.solution?.description ||
    (Array.isArray(cs?.challenges) && cs.challenges.length > 0) ||
    (Array.isArray(cs?.metrics) && cs.metrics.length > 0) ||
    cs?.highlightCode?.codeSnippet,
  );
};

const getPrimaryTechStack = (project) => {
  // Requirement: "ikon yığını" yerine ana teknolojileri metin olarak göster
  // V2: techStack: [{category, items: []}]
  // Legacy: technologies (array) veya tags
  const tokens = [];

  if (Array.isArray(project?.techStack)) {
    for (const group of project.techStack) {
      if (Array.isArray(group?.items)) {
        tokens.push(...group.items);
      }
    }
  }

  if (tokens.length === 0 && Array.isArray(project?.technologies)) {
    for (const item of project.technologies) {
      if (typeof item === "string") tokens.push(item);
      else if (item?.name) tokens.push(item.name);
    }
  }

  if (tokens.length === 0 && Array.isArray(project?.tags)) {
    tokens.push(...project.tags);
  }

  const normalized = tokens.map((t) => String(t).trim()).filter(Boolean);

  // Keep it short in sticky bar
  return normalized.slice(0, 6);
};

const matchesProjectParam = (project, slugOrId) => {
  let raw = slugOrId;
  try {
    raw = decodeURIComponent(String(slugOrId));
  } catch {
    raw = slugOrId;
  }

  const param = normalizeText(raw);
  if (!param) return false;

  const candidates = [
    project?.slug,
    project?.id,
    project?._id,
    project?.externalId,
  ].map(normalizeText);

  if (candidates.some((c) => c && c === param)) return true;

  const titleSlug = normalizeText(getProjectTitle(project))
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return titleSlug && titleSlug === param;
};

const Reveal = ({ as = "div", className = "", children }) => {
  const Component = as;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Component
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Component>
  );
};

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
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="lightbox-close" onClick={onClose}>
          Kapat
        </button>
        {/* Browser pinch-to-zoom on mobile is supported by default; allow scroll within */}
        <div className="lightbox-media" aria-label="Görsel önizleme">
          <img src={src} alt={alt || "Önizleme"} draggable={false} />
        </div>
      </div>
    </div>
  );
};

const BeforeAfterSlider = ({ beforeSrc, afterSrc, beforeAlt, afterAlt }) => {
  const [value, setValue] = useState(55);

  if (!beforeSrc || !afterSrc) return null;

  return (
    <div className="before-after" aria-label="Before / After karşılaştırma">
      <div className="before-after-frame">
        <img
          className="before-after-img"
          src={beforeSrc}
          alt={beforeAlt || "Before"}
          loading="lazy"
        />
        <div className="before-after-overlay" style={{ width: `${value}%` }}>
          <img
            className="before-after-img"
            src={afterSrc}
            alt={afterAlt || "After"}
            loading="lazy"
          />
        </div>
        <div className="before-after-handle" style={{ left: `${value}%` }} />
      </div>
      <input
        className="before-after-range"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Before/After kaydırıcı"
      />
    </div>
  );
};

const CodeSnippet = ({ language = "js", fileName = "highlight", code }) => {
  if (!code) return null;

  return (
    <div className="code-snippet" aria-label="Kod parçası">
      <div className="code-snippet-head">
        <span className="code-snippet-file">{fileName}</span>
        <span className="code-snippet-lang">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: "0.9rem",
          background: "transparent",
          fontSize: "0.92rem",
          lineHeight: 1.6,
        }}
        showLineNumbers
        wrapLongLines
      >
        {String(code)}
      </SyntaxHighlighter>
    </div>
  );
};

const ProjectDetailsPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { slugOrId } = useParams();

  const [projects, setProjects] = useState(fallbackProjects);
  const [dataSource, setDataSource] = useState("fallback");
  const [refreshing, setRefreshing] = useState(false);
  const [lightbox, setLightbox] = useState({ open: false, src: "", alt: "" });
  const [isContextExpanded, setIsContextExpanded] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const load = async () => {
      setRefreshing(true);
      try {
        const data = await fetchProjects({ signal: controller.signal });
        if (!isMounted) return;
        const nextProjects =
          Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        setProjects(nextProjects);
        setDataSource(
          Array.isArray(data) && data.length > 0 ? "live" : "fallback",
        );
      } catch {
        if (!isMounted) return;
        setProjects(fallbackProjects);
        setDataSource("fallback");
      } finally {
        if (isMounted) setRefreshing(false);
      }
    };

    load();
    const intervalId = window.setInterval(load, REQUEST_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  const sortedProjects = useMemo(() => {
    const list = Array.isArray(projects) ? [...projects] : [];
    list.sort((a, b) => {
      const af = isProjectFeatured(a) ? 1 : 0;
      const bf = isProjectFeatured(b) ? 1 : 0;
      if (af !== bf) return bf - af;

      const ad = getProjectCreatedAt(a);
      const bd = getProjectCreatedAt(b);
      if (ad && bd) return new Date(bd) - new Date(ad);
      return 0;
    });
    return list;
  }, [projects]);

  const project = useMemo(() => {
    const list = Array.isArray(sortedProjects) ? sortedProjects : [];
    return list.find((p) => matchesProjectParam(p, slugOrId)) || null;
  }, [sortedProjects, slugOrId]);

  const nextProject = useMemo(() => {
    if (!project) return null;
    const list = Array.isArray(sortedProjects) ? sortedProjects : [];
    const index = list.findIndex((p) => p === project);
    if (index < 0) return null;
    const next = list[(index + 1) % list.length];
    if (next === project) return null;
    return next;
  }, [project, sortedProjects]);

  const title = project ? getProjectTitle(project) : "";
  const tagline = project ? getProjectTagline(project) : "";
  const platform = project ? getProjectPlatform(project) : "";
  const role = project ? getProjectRole(project) : "";
  const team = project ? getProjectTeam(project) : "";
  const duration = project ? getProjectDuration(project) : "";
  const createdAt = project ? getProjectCreatedAt(project) : "";
  const links = project
    ? getProjectLinks(project)
    : { liveDemo: "", github: "", figma: "" };
  const heroMedia = project
    ? getProjectHeroMedia(project)
    : { heroVideoUrl: "", thumbnailUrl: "" };
  const primaryTech = project ? getPrimaryTechStack(project) : [];

  const gallery = useMemo(() => {
    // Optional future-proof fields: visuals.gallery or caseStudy.gallery
    const vGallery = Array.isArray(project?.visuals?.gallery)
      ? project.visuals.gallery
      : [];
    const csGallery = Array.isArray(project?.caseStudy?.gallery)
      ? project.caseStudy.gallery
      : [];
    const merged = [...vGallery, ...csGallery]
      .filter((item) => item && typeof item === "object" && item.url)
      .map((item) => ({
        url: item.url,
        alt: item.alt || item.caption || title,
        caption: item.caption || "",
      }));

    // de-dup by url
    const seen = new Set();
    return merged.filter((x) => {
      if (seen.has(x.url)) return false;
      seen.add(x.url);
      return true;
    });
  }, [project, title]);

  const beforeAfter = useMemo(() => {
    const v = project?.visuals || {};
    const cs = project?.caseStudy || {};

    const beforeSrc =
      v.beforeImageUrl ||
      cs?.process?.beforeImageUrl ||
      cs?.beforeImageUrl ||
      "";

    const afterSrc =
      v.afterImageUrl || cs?.process?.afterImageUrl || cs?.afterImageUrl || "";

    return { beforeSrc, afterSrc };
  }, [project]);

  const architectureDiagramUrl =
    project?.visuals?.architectureDiagramUrl ||
    project?.caseStudy?.architectureDiagramUrl ||
    "";

  const wireframeUrl =
    project?.visuals?.wireframeUrl || project?.caseStudy?.wireframeUrl || "";

  const metrics = Array.isArray(project?.caseStudy?.metrics)
    ? project.caseStudy.metrics
    : [];

  const challenges = Array.isArray(project?.caseStudy?.challenges)
    ? project.caseStudy.challenges
    : [];

  const statusChip = project?.metadata?.status || project?.status || "";
  const caseStudyChip = hasCaseStudy(project);

  const openLightbox = (item) => {
    setLightbox({ open: true, src: item.url, alt: item.alt });
  };

  if (!project) {
    return (
      <div className={`app-container show theme-${theme}`}>
        <Navbar />
        <SocialLinks />
        <ScrollToTop />
        <main className="project-details">
          <header className="project-details-header">
            <button
              type="button"
              className="project-details-back"
              onClick={() => navigate("/projects")}
            >
              ← Projelere dön
            </button>
            <h1>Proje bulunamadı</h1>
            <p>Bu proje kaldırılmış olabilir veya link hatalı olabilir.</p>
            <Link to="/projects" className="project-details-link">
              Tüm projeleri görüntüle
            </Link>
          </header>
        </main>
      </div>
    );
  }

  return (
    <div className={`app-container show theme-${theme}`}>
      <Navbar />
      <SocialLinks />
      <ScrollToTop />

      <main className="project-details">
        <header className="project-details-topbar">
          <button
            type="button"
            className="project-details-back"
            onClick={() => navigate("/projects")}
          >
            ← Projelere dön
          </button>

          <span className="project-details-source" data-state={dataSource}>
            {dataSource === "live" ? "Canlı veri" : "Yedek içerik"}
            {refreshing ? " • Güncelleniyor" : ""}
          </span>
        </header>

        {/* HERO (Fold üstü) */}
        <section className="project-hero" aria-label="Proje tanıtımı">
          <div className="project-hero-left">
            <div className="project-hero-kicker">
              {isProjectFeatured(project) ? (
                <span className="kicker" data-variant="featured">
                  FEATURED
                </span>
              ) : null}
              {caseStudyChip ? (
                <span className="kicker">CASE STUDY</span>
              ) : null}
              {statusChip ? <span className="kicker">{statusChip}</span> : null}
              {platform ? (
                <span className="kicker" data-variant="platform">
                  {platform}
                </span>
              ) : null}
            </div>

            <h1 className="project-hero-title">{title}</h1>
            <p className="project-hero-tagline">{tagline}</p>

            {/* CTA must be above the fold */}
            <div className="project-hero-cta" aria-label="Proje bağlantıları">
              {links.liveDemo ? (
                <a
                  className="cta primary"
                  href={links.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Projeyi İncele (Live Demo)
                </a>
              ) : (
                <button type="button" className="cta primary" disabled>
                  Live Demo (yok)
                </button>
              )}

              {links.github ? (
                <a
                  className="cta secondary"
                  href={links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kaynak Kod (GitHub)
                </a>
              ) : (
                <button type="button" className="cta secondary" disabled>
                  GitHub (yok)
                </button>
              )}

              {links.figma ? (
                <a
                  className="cta ghost"
                  href={links.figma}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Figma
                </a>
              ) : null}
            </div>
          </div>

          <div className="project-hero-right" aria-label="Hero medya">
            {heroMedia.heroVideoUrl ? (
              <HoverVideo
                src={heroMedia.heroVideoUrl}
                poster={heroMedia.thumbnailUrl}
              />
            ) : (
              <img
                className="project-hero-image"
                src={heroMedia.thumbnailUrl}
                alt={`${title} kapak görseli`}
                loading="eager"
                width={1200}
                height={720}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        </section>

        {/* STICKY CONTEXT BAR */}
        <section className="context-bar" aria-label="Proje künyesi">
          <div className="context-bar-head">
            <div className="context-bar-title">
              <span className="context-bar-title-text">Künye</span>
              <span className="context-bar-title-sub">
                {primaryTech.length > 0
                  ? primaryTech.join(" • ")
                  : "Tech stack yok"}
              </span>
            </div>

            <button
              type="button"
              className="context-bar-toggle"
              onClick={() => setIsContextExpanded((v) => !v)}
              aria-expanded={isContextExpanded}
              aria-controls="project-context-content"
            >
              <span className="context-bar-toggle-text">
                {isContextExpanded ? "Kapat" : "Aç"}
              </span>
              {isContextExpanded ? (
                <ChevronUp size={18} strokeWidth={3} />
              ) : (
                <ChevronDown size={18} strokeWidth={3} />
              )}
            </button>
          </div>

          <div
            id="project-context-content"
            className={`context-bar-content ${isContextExpanded ? "is-open" : ""}`}
          >
            <div className="context-item">
              <span className="context-label">Rol</span>
              <span className="context-value">{role || "—"}</span>
            </div>
            <div className="context-item">
              <span className="context-label">Süre</span>
              <span className="context-value">{duration || "—"}</span>
            </div>
            <div className="context-item">
              <span className="context-label">Takım</span>
              <span className="context-value">{team || "Solo Project"}</span>
            </div>
            <div className="context-item" data-wide>
              <span className="context-label">Tech Stack</span>
              <span className="context-value">
                {primaryTech.length > 0 ? primaryTech.join(" • ") : "—"}
              </span>
            </div>
            <div className="context-item">
              <span className="context-label">Tarih</span>
              <span className="context-value">
                {createdAt
                  ? new Date(createdAt).toLocaleDateString("tr-TR")
                  : "—"}
              </span>
            </div>
          </div>
        </section>

        {/* BENTO GRID */}
        <section className="bento" aria-label="Case study özeti">
          <Reveal className="bento-card" as="article">
            <h2>Problem</h2>
            <p>
              {project?.caseStudy?.problem?.description ||
                "Bu projeyi başlatan problem bağlamını burada anlatabilirsiniz (kısa, net, taranabilir)."}
            </p>
          </Reveal>

          <Reveal className="bento-card" as="article">
            <h2>Çözüm</h2>
            <p>
              {project?.caseStudy?.solution?.description ||
                "Çözümü 2-4 madde / kısa paragraf ile özetleyin. (Örn: mimari karar, kritik UX, performans)"}
            </p>
          </Reveal>

          <Reveal className="bento-card" as="article" data-variant="metrics">
            <h2>İstatistik</h2>
            {metrics.length > 0 ? (
              <div className="metrics">
                {metrics.slice(0, 6).map((m, idx) => (
                  <div key={idx} className="metric">
                    <div className="metric-label">{m.label}</div>
                    <div className="metric-value">{m.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p>
                Metrik ekleyin: örn. "-35% latency", "+18% completion", "1.2s
                load".
              </p>
            )}
          </Reveal>

          <Reveal className="bento-card" as="article" data-variant="highlights">
            <h2>Highlights</h2>
            <ul className="highlights">
              {(Array.isArray(project?.caseStudy?.highlights)
                ? project.caseStudy.highlights
                : []
              )
                .slice(0, 6)
                .map((h, idx) => (
                  <li key={idx}>{h}</li>
                ))}
              {(!Array.isArray(project?.caseStudy?.highlights) ||
                project.caseStudy.highlights.length === 0) && (
                <>
                  <li>Gerçek zamanlı akış / state yönetimi</li>
                  <li>Ölçeklenebilir API tasarımı</li>
                  <li>Performans ve UX optimizasyonları</li>
                </>
              )}
            </ul>
          </Reveal>
        </section>

        {/* PROCESS / PROOF */}
        <section className="process" aria-label="Süreç ve kanıt">
          <Reveal className="section-head" as="header">
            <h2>Process</h2>
            <p>
              Sadece sonuç değil, nasıl düşündüğünü göster: before/after, mimari
              diyagram, wireframe.
            </p>
          </Reveal>

          <div className="process-grid">
            <Reveal className="process-card" as="article">
              <h3>Before / After</h3>
              {beforeAfter.beforeSrc && beforeAfter.afterSrc ? (
                <BeforeAfterSlider
                  beforeSrc={beforeAfter.beforeSrc}
                  afterSrc={beforeAfter.afterSrc}
                />
              ) : (
                <p>
                  (Opsiyonel) `visuals.beforeImageUrl` ve
                  `visuals.afterImageUrl` ekleyerek slider açılır.
                </p>
              )}
            </Reveal>

            <Reveal className="process-card" as="article">
              <h3>Architecture Diagram</h3>
              {architectureDiagramUrl ? (
                <button
                  type="button"
                  className="media-card"
                  onClick={() =>
                    openLightbox({
                      url: architectureDiagramUrl,
                      alt: `${title} mimari diyagram`,
                    })
                  }
                >
                  <img
                    src={architectureDiagramUrl}
                    alt={`${title} mimari diyagram`}
                    loading="lazy"
                  />
                  <span>Full-screen incele</span>
                </button>
              ) : (
                <p>
                  (Opsiyonel) `visuals.architectureDiagramUrl` veya
                  `caseStudy.architectureDiagramUrl` ekleyin.
                </p>
              )}
            </Reveal>

            <Reveal className="process-card" as="article">
              <h3>User Flow / Wireframe</h3>
              {wireframeUrl ? (
                <button
                  type="button"
                  className="media-card"
                  onClick={() =>
                    openLightbox({
                      url: wireframeUrl,
                      alt: `${title} wireframe`,
                    })
                  }
                >
                  <img
                    src={wireframeUrl}
                    alt={`${title} wireframe`}
                    loading="lazy"
                  />
                  <span>Full-screen incele</span>
                </button>
              ) : (
                <p>
                  (Opsiyonel) `visuals.wireframeUrl` veya
                  `caseStudy.wireframeUrl` ekleyin.
                </p>
              )}
            </Reveal>
          </div>
        </section>

        {/* GALLERY + LIGHTBOX */}
        {gallery.length > 0 ? (
          <section className="gallery" aria-label="Ekran görüntüleri">
            <Reveal className="section-head" as="header">
              <h2>Screens</h2>
              <p>Görselleri tıklayıp full-screen inceleyin (lightbox).</p>
            </Reveal>

            <div className="gallery-grid">
              {gallery.slice(0, 12).map((item) => (
                <button
                  key={item.url}
                  type="button"
                  className="gallery-item"
                  onClick={() => openLightbox(item)}
                >
                  <img src={item.url} alt={item.alt} loading="lazy" />
                  {item.caption ? (
                    <span className="gallery-caption">{item.caption}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {/* TECH DEEP DIVE */}
        <section className="deep-dive" aria-label="Teknik detay">
          <Reveal className="section-head" as="header">
            <h2>Deep Dive</h2>
            <p>
              CTO için net kanıt: zor bir problemi çözen 10–15 satırlık temiz
              bir snippet.
            </p>
          </Reveal>

          <div className="deep-dive-grid">
            <Reveal className="deep-card" as="article">
              <h3>Challenge</h3>
              {challenges.length > 0 ? (
                <ul className="challenge-list">
                  {challenges.slice(0, 4).map((c, idx) => (
                    <li key={idx}>
                      <strong>{c.title}</strong>
                      {c.description ? <span> — {c.description}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>
                  (Opsiyonel) `caseStudy.challenges` ile 2-3 zorluğu ekleyin.
                </p>
              )}
            </Reveal>

            <Reveal className="deep-card" as="article" data-wide>
              <h3>Code Snippet</h3>
              <CodeSnippet
                language={project?.caseStudy?.highlightCode?.language || "js"}
                fileName={
                  project?.caseStudy?.highlightCode?.fileName || "highlight"
                }
                code={project?.caseStudy?.highlightCode?.codeSnippet || ""}
              />
              {!project?.caseStudy?.highlightCode?.codeSnippet ? (
                <p className="hint">
                  (Opsiyonel) `caseStudy.highlightCode` eklenince burada VS Code
                  temalı snippet görünür.
                </p>
              ) : null}
            </Reveal>
          </div>
        </section>

        {/* FOOTER: NEXT + CTA */}
        <footer className="project-footer" aria-label="Sonraki adım">
          <Reveal className="footer-cta" as="div">
            <h2>Bu projeyi beğendiniz mi?</h2>
            <p>Benzer bir şey için birlikte çalışalım.</p>
            <div className="footer-cta-actions">
              <Link to="/" className="cta secondary">
                Ana sayfa
              </Link>
              <a href="/#contact-section" className="cta primary">
                İletişime geç
              </a>
            </div>
          </Reveal>

          {nextProject ? (
            <Reveal className="next-project" as="div">
              <h3>Next Project</h3>
              <Link
                className="next-project-card"
                to={`/projects/${nextProject.slug || nextProject.id || nextProject._id}`}
              >
                <div className="next-project-title">
                  {getProjectTitle(nextProject)}
                </div>
                <div className="next-project-tagline">
                  {getProjectTagline(nextProject)}
                </div>
                <span className="next-project-cta">Devam et →</span>
              </Link>
            </Reveal>
          ) : null}

          <div className="footer-spacer" />
        </footer>
      </main>

      <Lightbox
        open={lightbox.open}
        onClose={() => setLightbox({ open: false, src: "", alt: "" })}
        src={lightbox.src}
        alt={lightbox.alt}
      />
    </div>
  );
};

const HoverVideo = ({ src, poster }) => {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Autoplay muted best-effort; if browser blocks, hover still works.
    const attempt = async () => {
      try {
        await node.play();
      } catch {
        // ignore
      }
    };

    attempt();
  }, []);

  return (
    <video
      ref={ref}
      className="project-hero-video"
      src={src}
      poster={poster || undefined}
      muted
      playsInline
      autoPlay
      loop
      preload="metadata"
      onMouseEnter={() => ref.current?.play?.()}
      onMouseLeave={() => ref.current?.pause?.()}
    />
  );
};

export default ProjectDetailsPage;
