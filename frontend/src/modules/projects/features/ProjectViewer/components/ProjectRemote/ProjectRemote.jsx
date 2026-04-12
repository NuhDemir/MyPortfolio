import React, { useEffect, useState } from "react";
import "./ProjectRemote.css";

const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const hasLink = (value) => Boolean(value && String(value).trim());

/* ── Dekoratif SVG: Yamuk yıldız ─────────────────────────── */
const ScribbleStar = ({ className = "" }) => (
  <svg
    className={`scribble-star ${className}`}
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
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

/* ── Dekoratif SVG: Asimetrik nokta ─────────────────────── */
const ScribbleDot = ({ className = "" }) => (
  <svg
    className={`scribble-dot ${className}`}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <ellipse
      cx="8"
      cy="8"
      rx="6.5"
      ry="5.5"
      transform="rotate(-12 8 8)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      fill="var(--color-primary)"
      fillOpacity="0.65"
    />
  </svg>
);

/* ── Ana Bileşen ─────────────────────────────────────────── */
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
  const repoUrl = project?.links?.github || project?.githubUrl || "";
  const [jumpChannel, setJumpChannel] = useState("");

  useEffect(() => {
    if (total <= 0) {
      setJumpChannel("");
      return;
    }

    setJumpChannel(String(Math.min(activeIndex + 1, total)));
  }, [activeIndex, total]);

  const safeGoTo = (channel) => {
    if (total <= 0) return;
    const boundedChannel = Math.min(Math.max(channel, 1), total);
    onGoTo(boundedChannel - 1);
  };

  const jumpBy = (step) => {
    const nextChannel = activeIndex + 1 + step;
    safeGoTo(nextChannel);
  };

  const handleJumpSubmit = (event) => {
    event.preventDefault();
    const parsed = Number.parseInt(jumpChannel, 10);
    if (Number.isNaN(parsed)) return;
    safeGoTo(parsed);
  };

  const handleZero = () => {
    if (total <= 0) return;
    onGoTo(total >= 10 ? 9 : 0);
  };

  return (
    <aside
      className="project-remote-wrap scribble-card-wrap"
      aria-label="Project remote"
    >
      {/* Taşan arka plan gölgesi */}
      <div
        className="project-remote__fill scribble-card-wrap__fill"
        aria-hidden="true"
      />

      {/* Dekoratif SVG'ler */}
      <ScribbleStar className="project-remote__deco project-remote__deco--star-tl" />
      <ScribbleDot className="project-remote__deco project-remote__deco--dot-br" />
      <ScribbleStar className="project-remote__deco project-remote__deco--star-br" />

      <div className="project-remote naive-shadow">
        <div className="project-remote__all-row">
          <button
            type="button"
            className="project-remote__button project-remote__button--all messy-button"
            onClick={onOpenAllProjects}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">TUM PROJELERE GIT</span>
          </button>
        </div>

        {/* Durum çubuğu */}
        <div className="project-remote__status" aria-live="polite">
          <span className={`project-remote__led ${isOn ? "is-on" : ""}`} aria-hidden="true" />
          {isOn
            ? `● REMOTE ACTIVE • CH ${activeIndex + 1}/${total || 0}`
            : "○ REMOTE STANDBY"}
        </div>

        {/* Üst satır: Güç + Demo + Repo */}
        <div className="project-remote__top-row">
          <button
            type="button"
            className="project-remote__button project-remote__button--power messy-button"
            onClick={onToggle}
            aria-label={isOn ? "TV kapat" : "TV aç"}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">⏻</span>
          </button>

          <button
            type="button"
            className="project-remote__button project-remote__button--link messy-button"
            onClick={onOpenDemo}
            disabled={!hasLink(demoUrl)}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">🔗 demo</span>
          </button>

          <button
            type="button"
            className="project-remote__button project-remote__button--repo messy-button"
            onClick={onOpenRepo}
            disabled={!hasLink(repoUrl)}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">GH repo</span>
          </button>
        </div>

        {/* Numpad */}
        <div className="project-remote__numpad" aria-label="Kanal seçici">
          {numberButtons.map((number) => {
            const index = number - 1;
            return (
              <button
                key={number}
                type="button"
                className="project-remote__button project-remote__button--digit messy-button"
                onClick={() => onGoTo(index)}
                disabled={total <= index}
                aria-label={`Kanal ${number}`}
              >
                <span className="messy-button__fill" aria-hidden="true" />
                <span className="messy-button__label">{number}</span>
              </button>
            );
          })}

          <button
            type="button"
            className="project-remote__button project-remote__button--digit project-remote__button--zero messy-button"
            onClick={handleZero}
            disabled={total <= 0}
            aria-label="Kanal 0"
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">0</span>
          </button>
        </div>

        {/* Kanal ▲▼ */}
        <div className="project-remote__channel-row">
          <button
            type="button"
            className="project-remote__button project-remote__button--channel messy-button"
            onClick={onPrev}
            disabled={total <= 1}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">▲ kanal</span>
          </button>
          <button
            type="button"
            className="project-remote__button project-remote__button--channel messy-button"
            onClick={onNext}
            disabled={total <= 1}
          >
            <span className="messy-button__fill" aria-hidden="true" />
            <span className="messy-button__label">▼ kanal</span>
          </button>
        </div>

        {total > 10 ? (
          <div className="project-remote__extended" aria-label="Gelismis kanal kontrolu">
            <p className="project-remote__extended-label">10+ kanal modu</p>

            <div className="project-remote__jump-controls">
              <button
                type="button"
                className="project-remote__button project-remote__button--step messy-button"
                onClick={() => jumpBy(-10)}
              >
                <span className="messy-button__fill" aria-hidden="true" />
                <span className="messy-button__label">-10</span>
              </button>

              <button
                type="button"
                className="project-remote__button project-remote__button--step messy-button"
                onClick={() => jumpBy(10)}
              >
                <span className="messy-button__fill" aria-hidden="true" />
                <span className="messy-button__label">+10</span>
              </button>
            </div>

            <form className="project-remote__jump-form" onSubmit={handleJumpSubmit}>
              <input
                className="project-remote__jump-input"
                type="number"
                min={1}
                max={total}
                value={jumpChannel}
                onChange={(event) => setJumpChannel(event.target.value)}
                aria-label={`Kanal numarasi giriniz 1 ile ${total} arasi`}
                placeholder={`1-${total}`}
              />

              <button
                type="submit"
                className="project-remote__button project-remote__button--jump messy-button"
              >
                <span className="messy-button__fill" aria-hidden="true" />
                <span className="messy-button__label">GIT</span>
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default ProjectRemote;