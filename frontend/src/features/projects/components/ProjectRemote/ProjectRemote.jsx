import React, { useEffect, useState } from "react";
import "./ProjectRemote.css";

const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const hasLink = (value) => Boolean(value && String(value).trim());

/* ── Inline SVG defs — patterns & filters ────────────────────── */
const RemoteSvgDefs = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    width="0"
    height="0"
    style={{ position: "absolute", overflow: "hidden" }}
  >
    <defs>
      {/* Paper grain filter */}
      <filter id="remote-grain" x="0%" y="0%" width="100%" height="100%"
        colorInterpolationFilters="sRGB">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.82 0.78"
          numOctaves="4"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
        <feComposite in="grayNoise" in2="SourceAlpha" operator="in" result="masked" />
        <feBlend in="SourceGraphic" in2="masked" mode="soft-light" />
      </filter>

      {/* Diagonal cross-hatch pattern for disabled buttons */}
      <pattern
        id="remote-hatch"
        patternUnits="userSpaceOnUse"
        width="8"
        height="8"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="0" y2="8"
          stroke="currentColor" strokeWidth="1.4" strokeOpacity="0.28" />
      </pattern>

      {/* Dot fill pattern for section backgrounds */}
      <pattern
        id="remote-dots"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
      >
        <circle cx="5" cy="5" r="1.1"
          fill="currentColor" fillOpacity="0.12" />
      </pattern>
    </defs>
  </svg>
);

/* ── Decorative: sketchy star ────────────────────────────────── */
const ScribbleStar = ({ className = "" }) => (
  <svg
    className={`scribble-star ${className}`}
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M16 3 L18.5 12.5 L28 10 L21 17.5 L26 26 L16 21.5 L6 26 L11 17.5 L4 10 L13.5 12.5 Z"
      stroke="var(--color-border-strong)"
      strokeWidth="2.2"
      strokeLinejoin="round"
      fill="var(--color-accent)"
      fillOpacity="0.72"
    />
  </svg>
);

/* ── Decorative: asymmetric dot ──────────────────────────────── */
const ScribbleDot = ({ className = "" }) => (
  <svg
    className={`scribble-dot ${className}`}
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <ellipse
      cx="8" cy="8" rx="6.5" ry="5.5"
      transform="rotate(-12 8 8)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      fill="var(--color-primary)"
      fillOpacity="0.65"
    />
  </svg>
);

/* ── Main component ──────────────────────────────────────────── */
const ProjectRemote = ({
  project,
  total,
  activeIndex,
  isOn,
  onToggle,
  onGoTo,
  onPrev,
  onNext,
  onOpenDemo,
  onOpenRepo,
  onOpenAllProjects,
}) => {
  const demoUrl = project?.links?.liveDemo || project?.liveUrl || "";
  const repoUrl = project?.links?.github   || project?.githubUrl || "";
  const [jumpChannel, setJumpChannel] = useState("");

  useEffect(() => {
    if (total <= 0) { setJumpChannel(""); return; }
    setJumpChannel(String(Math.min(activeIndex + 1, total)));
  }, [activeIndex, total]);

  const safeGoTo = (channel) => {
    if (total <= 0) return;
    onGoTo(Math.min(Math.max(channel, 1), total) - 1);
  };

  const jumpBy    = (step) => safeGoTo(activeIndex + 1 + step);

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const parsed = Number.parseInt(jumpChannel, 10);
    if (!Number.isNaN(parsed)) safeGoTo(parsed);
  };

  const handleZero = () => {
    if (total <= 0) return;
    onGoTo(total >= 10 ? 9 : 0);
  };

  return (
    <aside className="project-remote-wrap" aria-label="Project remote">
      <RemoteSvgDefs />

      {/* Taşan offset gölgesi */}
      <div className="project-remote__shadow" aria-hidden="true" />

      {/* Dekoratif elemanlar */}
      <ScribbleStar className="project-remote__deco project-remote__deco--star-tl" />
      <ScribbleDot  className="project-remote__deco project-remote__deco--dot-br"  />
      <ScribbleStar className="project-remote__deco project-remote__deco--star-br" />

      <div className="project-remote">

        {/* ── Tüm projelere git ─────────────────────────────────── */}
        <div className="project-remote__section">
          <button
            type="button"
            className="project-remote__btn project-remote__btn--all"
            onClick={onOpenAllProjects}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">TUM PROJELERE GIT</span>
          </button>
        </div>

        {/* ── LCD status bar ────────────────────────────────────── */}
        <div className="project-remote__lcd" aria-live="polite">
          <span
            className={`project-remote__led${isOn ? " project-remote__led--on" : ""}`}
            aria-hidden="true"
          />
          {isOn
            ? `● REMOTE ACTIVE • CH ${activeIndex + 1}/${total || 0}`
            : "○ REMOTE STANDBY"}
        </div>

        {/* ── Üst satır: güç · demo · repo ──────────────────────── */}
        <div className="project-remote__section project-remote__top-row">
          <button
            type="button"
            className="project-remote__btn project-remote__btn--power"
            onClick={onToggle}
            aria-label={isOn ? "TV kapat" : "TV aç"}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">⏻</span>
          </button>

          <button
            type="button"
            className="project-remote__btn project-remote__btn--demo"
            onClick={onOpenDemo}
            disabled={!hasLink(demoUrl)}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">🔗 demo</span>
          </button>

          <button
            type="button"
            className="project-remote__btn project-remote__btn--repo"
            onClick={onOpenRepo}
            disabled={!hasLink(repoUrl)}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">GH repo</span>
          </button>
        </div>

        {/* ── Numpad ────────────────────────────────────────────── */}
        <div
          className="project-remote__section project-remote__numpad"
          aria-label="Kanal seçici"
        >
          {numberButtons.map((n) => (
            <button
              key={n}
              type="button"
              className="project-remote__btn project-remote__btn--digit"
              onClick={() => onGoTo(n - 1)}
              disabled={total < n}
              aria-label={`Kanal ${n}`}
            >
              <span className="project-remote__btn-fill" aria-hidden="true" />
              <span className="project-remote__btn-label">{n}</span>
            </button>
          ))}

          <button
            type="button"
            className="project-remote__btn project-remote__btn--digit project-remote__btn--zero"
            onClick={handleZero}
            disabled={total <= 0}
            aria-label="Kanal 0"
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">0</span>
          </button>
        </div>

        {/* ── Kanal ▲ ▼ ─────────────────────────────────────────── */}
        <div className="project-remote__section project-remote__ch-row">
          <button
            type="button"
            className="project-remote__btn project-remote__btn--ch"
            onClick={onPrev}
            disabled={total <= 1}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">▲ kanal</span>
          </button>
          <button
            type="button"
            className="project-remote__btn project-remote__btn--ch"
            onClick={onNext}
            disabled={total <= 1}
          >
            <span className="project-remote__btn-fill" aria-hidden="true" />
            <span className="project-remote__btn-label">▼ kanal</span>
          </button>
        </div>

        {/* ── 10+ kanal genişletilmiş mod ───────────────────────── */}
        {total > 10 && (
          <div
            className="project-remote__section project-remote__extended"
            aria-label="Gelismis kanal kontrolu"
          >
            <p className="project-remote__extended-label">10+ kanal modu</p>

            <div className="project-remote__jump-controls">
              <button
                type="button"
                className="project-remote__btn project-remote__btn--step"
                onClick={() => jumpBy(-10)}
              >
                <span className="project-remote__btn-fill" aria-hidden="true" />
                <span className="project-remote__btn-label">-10</span>
              </button>
              <button
                type="button"
                className="project-remote__btn project-remote__btn--step"
                onClick={() => jumpBy(10)}
              >
                <span className="project-remote__btn-fill" aria-hidden="true" />
                <span className="project-remote__btn-label">+10</span>
              </button>
            </div>

            <form className="project-remote__jump-form" onSubmit={handleJumpSubmit}>
              <input
                className="project-remote__jump-input"
                type="number"
                min={1}
                max={total}
                value={jumpChannel}
                onChange={(e) => setJumpChannel(e.target.value)}
                aria-label={`Kanal numarasi 1-${total}`}
                placeholder={`1–${total}`}
              />
              <button
                type="submit"
                className="project-remote__btn project-remote__btn--jump"
              >
                <span className="project-remote__btn-fill" aria-hidden="true" />
                <span className="project-remote__btn-label">GIT</span>
              </button>
            </form>
          </div>
        )}

        {/* ── Marka ─────────────────────────────────────────────── */}
        <p className="project-remote__brand" aria-hidden="true">DMR-84</p>
      </div>
    </aside>
  );
};

export default ProjectRemote;
