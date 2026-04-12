import React from "react";
import "./style/About.css";

const StatCard = ({ value, label }) => (
  <div className="stat-section stat-card scribble-card-wrap">
    <div className="stat-card__fill scribble-card-wrap__fill" aria-hidden="true" />

    <article className="stat-card__inner naive-shadow--sm" aria-label={label}>
      <svg
        className="stat-card__doodle"
        viewBox="0 0 28 28"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M14 3 L16.5 10.5 L25 11 L18 15.8 L20.5 24 L14 19.4 L7.5 24 L10 15.8 L3 11 L11.5 10.5 Z"
          fill="var(--color-accent)"
          stroke="var(--color-border-strong)"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </article>
  </div>
);

export default StatCard;
