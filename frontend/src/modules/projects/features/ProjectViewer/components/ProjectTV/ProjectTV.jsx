import React from "react";
import ProjectTVScreen from "../ProjectTVScreen/ProjectTVScreen.jsx";
import "./ProjectTV.css";

const padChannel = (value) => String(Math.max(value, 0)).padStart(2, "0");

const TVAntenna = () => (
  <svg
    className="project-tv__antenna"
    viewBox="0 0 140 86"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M34 76 L62 18 M106 76 L78 18"
      fill="none"
      stroke="var(--color-border-strong)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle
      cx="62"
      cy="18"
      r="8"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="4"
    />
    <circle
      cx="78"
      cy="18"
      r="8"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="4"
    />
  </svg>
);

const TVDoodle = () => (
  <svg
    className="project-tv__doodle"
    viewBox="0 0 64 40"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 31 C12 20, 20 36, 27 21 C33 8, 44 32, 56 14"
      fill="none"
      stroke="var(--color-border-strong)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <circle
      cx="9"
      cy="10"
      r="5"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
  </svg>
);

const ProjectTV = ({ project, isOn, activeIndex, total, onPrev, onNext }) => {
  const currentChannel = total > 0 ? activeIndex + 1 : 0;

  return (
    <div className="project-tv-wrap scribble-card-wrap">
      <div className="project-tv__fill scribble-card-wrap__fill" aria-hidden="true" />
      <section className="project-tv naive-shadow" aria-label="Project TV ekrani">
        <TVAntenna />
        <TVDoodle />

        <header className="project-tv__top-bar">
          <p className="project-tv__brand">dmr VISION 84</p>
          <span className="project-tv__signal">UHF MODE</span>
        </header>

        <div className="project-tv__body">
          <div className="project-tv__screen-shell">
            <ProjectTVScreen project={project} isOn={isOn} />
          </div>

          <aside className="project-tv__side-panel" aria-label="Analog panel">
            <div className="project-tv__knob" role="presentation">
              <span className="project-tv__knob-core" />
            </div>
            <div className="project-tv__knob" role="presentation">
              <span className="project-tv__knob-core" />
            </div>
            <div className="project-tv__vents" role="presentation">
              <span className="project-tv__vent-line" />
              <span className="project-tv__vent-line" />
              <span className="project-tv__vent-line" />
              <span className="project-tv__vent-line" />
            </div>
          </aside>
        </div>

        <footer className="project-tv__controls" aria-label="TV kanal kontrolu">
          <button
            type="button"
            className="project-tv__control-button naive-control-button"
            onClick={onPrev}
            disabled={total <= 1}
            aria-label="Onceki kanal"
          >
            ◀
          </button>

          <p className="project-tv__channel-label" aria-live="polite">
            CH {padChannel(currentChannel)} / {padChannel(total)}
          </p>

          <button
            type="button"
            className="project-tv__control-button naive-control-button"
            onClick={onNext}
            disabled={total <= 1}
            aria-label="Sonraki kanal"
          >
            ▶
          </button>
        </footer>
      </section>
    </div>
  );
};

export default ProjectTV;
