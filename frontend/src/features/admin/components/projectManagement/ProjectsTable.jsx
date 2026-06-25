import { Pencil, Trash2, ExternalLink, Star } from "lucide-react";
import { PatternBackground, LoadingSpinner } from "@shared";
import { getDisplayThumbnail, getDisplayTitle, resolveProjectId } from "../../utils/projectManagement";
import "./ProjectCard.css";

const resolveStatus = (p) => {
  const s = p?.metadata?.status ?? p?.status ?? "";
  if (!s) return null;
  if (/live|active|yayin/i.test(s)) return { label: "Live", tone: "active" };
  if (/dev/i.test(s)) return { label: "Dev", tone: "neutral" };
  if (/beta/i.test(s)) return { label: "Beta", tone: "neutral" };
  return { label: s, tone: "neutral" };
};

const resolveRole = (p) => p?.metadata?.role ?? p?.role ?? "";
const resolvePlatform = (p) => p?.metadata?.platform ?? p?.platform ?? "";
const resolveCategory = (p) => p?.category ?? "";
const resolveTags = (p) => {
  if (Array.isArray(p?.tags)) return p.tags;
  if (typeof p?.tags === "string") return p.tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

const ProjectsCardGrid = ({ projects, loading, error, onEdit, onDelete }) => {
  return (
    <div className="admin-list-container">
      <h2>Mevcut Projeler</h2>

      {loading && projects.length === 0 && (
        <LoadingSpinner message="Projeler yukleniyor..." />
      )}

      {!loading && !error && (
        <>
          {projects.length === 0 ? (
            <div className="admin-empty-state">Gosterilecek proje bulunamadi.</div>
          ) : (
            <div className="prj-cards">
              {projects.map((project, index) => {
                const projectId = resolveProjectId(project);
                const title = getDisplayTitle(project);
                const thumb = getDisplayThumbnail(project);
                const status = resolveStatus(project);
                const role = resolveRole(project);
                const platform = resolvePlatform(project);
                const category = resolveCategory(project);
                const tags = resolveTags(project).slice(0, 3);
                const isFeatured = project?.isFeatured === true || project?.featured === true;

                return (
                  <div key={projectId || `prj-${index}`} className="prj-card">
                    <div className="prj-card__cover">
                      {thumb ? (
                        <img src={thumb} alt={title} className="prj-card__img" loading="lazy" />
                      ) : (
                        <PatternBackground seed={projectId || title} opacity={0.2} />
                      )}
                      {isFeatured && (
                        <span className="prj-card__featured-badge">
                          <Star size={10} />
                        </span>
                      )}
                    </div>

                    <div className="prj-card__body">
                      <div className="prj-card__header">
                        <h3 className="prj-card__title">{title || "Isimsiz Proje"}</h3>
                        {status && (
                          <span className={`prj-card__status prj-card__status--${status.tone}`}>
                            <span className="admin-status-dot active" />
                            {status.label}
                          </span>
                        )}
                      </div>

                      {(role || platform || category) && (
                        <p className="prj-card__meta">
                          {[role, platform, category].filter(Boolean).join(" · ")}
                        </p>
                      )}

                      {tags.length > 0 && (
                        <div className="prj-card__tags">
                          {tags.map((tag) => (
                            <span key={tag} className="prj-card__tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="prj-card__actions">
                        <button
                          type="button"
                          className="admin-btn-icon"
                          title="Duzenle"
                          onClick={() => onEdit(project)}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className="admin-btn-icon admin-btn-icon--danger"
                          title="Sil"
                          onClick={() => onDelete(projectId)}
                        >
                          <Trash2 size={14} />
                        </button>
                        {project?.links?.liveDemo && (
                          <a
                            href={project.links.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="admin-btn-icon"
                            title="Canli goruntule"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsCardGrid;
