import React from "react";
import { PatternBackground } from "@shared/ui/patterns";
import "./ProjectListHeader.css";

/* ── Inline SVG doodles ─────────────────────────────────────────────────────
 * Colors reference CSS custom properties — adapts to light / dark theme.
 * stroke / fill attributes accept var() in modern browsers for inline SVGs.
 * All doodles are aria-hidden — purely decorative.
 * ─────────────────────────────────────────────────────────────────────────── */

/** Wonky 5-pointed star — top-left corner, bleeds off the card edge */
const StarDoodle = () => (
  <svg
    className="project-list-hero__doodle project-list-hero__doodle--star-tl"
    viewBox="0 0 44 44"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M22 5 L26 17 L39 17 L29 24 L33 37 L22 30 L11 37 L15 24 L5 17 L18 17 Z"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Three off-size dots — top-right corner, casual scatter */
const DotsDoodle = () => (
  <svg
    className="project-list-hero__doodle project-list-hero__doodle--dots-tr"
    viewBox="0 0 60 36"
    aria-hidden="true"
    focusable="false"
  >
    <circle
      cx="8"
      cy="9"
      r="5.5"
      fill="var(--color-primary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="30"
      cy="26"
      r="4"
      fill="var(--color-accent)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
    <circle
      cx="52"
      cy="11"
      r="6.5"
      fill="var(--color-secondary)"
      stroke="var(--color-border-strong)"
      strokeWidth="2"
    />
  </svg>
);

/** Small asterisk — bottom-right accent, rotated further in CSS */
const AsteriskDoodle = () => (
  <svg
    className="project-list-hero__doodle project-list-hero__doodle--asterisk-br"
    viewBox="0 0 30 30"
    aria-hidden="true"
    focusable="false"
  >
    <line
      x1="15"
      y1="3"
      x2="15"
      y2="27"
      stroke="var(--color-border-strong)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="3"
      y1="15"
      x2="27"
      y2="15"
      stroke="var(--color-border-strong)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="6"
      y1="6"
      x2="24"
      y2="24"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="24"
      y1="6"
      x2="6"
      y2="24"
      stroke="var(--color-accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Component ────────────────────────────────────────────────────────────── */

/**
 * ProjectListHeader — naive-art hero for the projects section.
 *
 * Structure:
 *   .project-list-hero-wrap          — owns width + margin; relative context
 *     .project-list-hero__fill       — offset accent block (messy fill effect)
 *     header.project-list-hero       — the actual card (z-index: 1)
 *       PatternBackground × 2        — paper + doodle textures
 *       SVG doodles × 3              — decorative, aria-hidden
 *       .project-list-hero__content  — tag · title · divider · subtitle
 *
 * Purely presentational — no state, no side effects.
 */
const ProjectListHeader = () => (
  <div className="project-list-hero-wrap">
    {/* Offset fill block — shifts right+down and rotates to create
        the stacked-paper / naive crayon-fill depth effect */}
    <div className="project-list-hero__fill" aria-hidden="true" />

    <header className="project-list-hero" aria-label="Projects header">
      {/* Texture layers */}
      <PatternBackground
        variant="paper"
        opacity={0.36}
        className="project-list-hero__paper-pattern"
      />
      <PatternBackground
        variant="naiveSketch"
        opacity={0.12}
        className="project-list-hero__doodle-pattern"
      />

      {/* Decorative SVG doodles */}
      <StarDoodle />
      <DotsDoodle />
      <AsteriskDoodle />

      {/* Main content */}
      <div className="project-list-hero__content">
        {/*
         * .naive-tag (naive-utils.css): blob border-radius, primary bg,
         *   ::before accent overflow fill, flat shadow, base -1.6deg tilt.
         * .project-list-hero__tag: overrides font-size, padding, extra tilt.
         */}
        <span
          className="naive-tag project-list-hero__tag"
          aria-hidden="true"
        >
          ✦ portfolio
        </span>

        <p className="project-list-hero__title">PROJELERIM</p>

        <div className="project-list-hero__divider" aria-hidden="true">
          <span className="project-list-hero__divider-line" />
          <span className="project-list-hero__divider-dot" />
          <span className="project-list-hero__divider-line" />
        </div>

        <p className="project-list-hero__subtitle">
          YAPTIĞIM ÇALIŞMALAR VE DENEYİMLERİM
        </p>
      </div>
    </header>
  </div>
);

export default ProjectListHeader;
