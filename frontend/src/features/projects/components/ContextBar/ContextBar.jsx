import { MotionConfig } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getProjectRole, getProjectTeam, getProjectDuration, getProjectArchitecture, getProjectRepositoryAccess, getProjectDifficulty, getProjectCreatedAt, getPrimaryTechStack } from "../../utils/projectFormatters.js";
import "./ContextBar.css";

const ContextBar = ({ project, expanded, onToggle }) => {
  const role = getProjectRole(project);
  const team = getProjectTeam(project);
  const duration = getProjectDuration(project);
  const architecture = getProjectArchitecture(project);
  const repo = getProjectRepositoryAccess(project);
  const difficulty = getProjectDifficulty(project);
  const date = getProjectCreatedAt(project);
  const techs = getPrimaryTechStack(project);

  const teamDisplay = team
    ? (isNaN(Number(team)) ? team : `${team} kisi`)
    : "Solo Project";

  return (
    <section className="ctxbar" aria-label="Proje kunyesi">
      <div className="ctxbar__head">
        <div className="ctxbar__title">
          <span className="ctxbar__title-text">Kunye</span>
          <span className="ctxbar__title-sub">
            {techs.length > 0 ? techs.slice(0, 6).join("  ") : "Tech stack yok"}
          </span>
        </div>
        <button
          type="button"
          className="ctxbar__toggle"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <span className="ctxbar__toggle-text">{expanded ? "Kapat" : "Ac"}</span>
          {expanded ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
        </button>
      </div>

      <div className={`ctxbar__body ${expanded ? "ctxbar__body--open" : ""}`}>
        <div className="ctxbar__item"><span className="ctxbar__label">Rol</span><span className="ctxbar__value">{role || "—"}</span></div>
        <div className="ctxbar__item"><span className="ctxbar__label">Sure</span><span className="ctxbar__value">{duration || "—"}</span></div>
        <div className="ctxbar__item"><span className="ctxbar__label">Takim</span><span className="ctxbar__value">{teamDisplay}</span></div>
        {architecture && <div className="ctxbar__item"><span className="ctxbar__label">Mimari</span><span className="ctxbar__value">{architecture}</span></div>}
        {repo && <div className="ctxbar__item"><span className="ctxbar__label">Repo</span><span className="ctxbar__value">{repo}</span></div>}
        {difficulty && <div className="ctxbar__item"><span className="ctxbar__label">Seviye</span><span className="ctxbar__value">{difficulty}</span></div>}
        <div className="ctxbar__item ctxbar__item--wide">
          <span className="ctxbar__label">Tech Stack</span>
          <span className="ctxbar__value">{techs.length > 0 ? techs.join("  |  ") : "—"}</span>
        </div>
        <div className="ctxbar__item">
          <span className="ctxbar__label">Tarih</span>
          <span className="ctxbar__value">{date ? new Date(date).toLocaleDateString("tr-TR") : "—"}</span>
        </div>
      </div>
    </section>
  );
};

export default ContextBar;
