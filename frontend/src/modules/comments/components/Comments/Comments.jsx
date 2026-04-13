import React, { useState } from "react";
import "./style/Comments.scss";
import CommentsHeader from "./CommentsHeader";
import comments from "@modules/comments/data/comments.json";

/* ── Floating doodles ────────────────────────────────────────── */
const Doodles = () => (
  <div className="comments-doodles" aria-hidden="true">
    <svg className="c-doodle c-doodle--star-tr" viewBox="0 0 44 44">
      <path
        d="M22 4 L25.5 15.5 L38 15.5 L28 23 L32 35 L22 27.5 L12 35 L16 23 L6 15.5 L18.5 15.5 Z"
        fill="var(--color-accent)" fillOpacity="0.78"
        stroke="var(--color-border-strong)" strokeWidth="2.4" strokeLinejoin="round"
      />
    </svg>

    <svg className="c-doodle c-doodle--squig-l" viewBox="0 0 18 90">
      <path
        d="M9 2 C14 10, 4 18, 9 26 C14 34, 4 42, 9 50 C14 58, 4 66, 9 74 C14 82, 7 88, 9 88"
        fill="none" stroke="var(--color-border-strong)"
        strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.4"
      />
    </svg>

    <svg className="c-doodle c-doodle--dots-br" viewBox="0 0 52 32">
      <circle cx="8"  cy="10" r="5"   fill="var(--color-primary)"   fillOpacity="0.55" stroke="var(--color-border-strong)" strokeWidth="2"/>
      <circle cx="28" cy="22" r="3.8" fill="var(--color-accent)"    fillOpacity="0.65" stroke="var(--color-border-strong)" strokeWidth="2"/>
      <circle cx="46" cy="9"  r="4.5" fill="var(--color-secondary)" fillOpacity="0.6"  stroke="var(--color-border-strong)" strokeWidth="2"/>
    </svg>

    <svg className="c-doodle c-doodle--star-bl" viewBox="0 0 32 32">
      <path
        d="M16 3 L18.5 12.5 L28 10 L21 17.5 L26 26 L16 21.5 L6 26 L11 17.5 L4 10 L13.5 12.5 Z"
        fill="var(--color-secondary)" fillOpacity="0.7"
        stroke="var(--color-border-strong)" strokeWidth="2.2" strokeLinejoin="round"
      />
    </svg>

    <svg className="c-doodle c-doodle--circle-tl" viewBox="0 0 40 40">
      <ellipse cx="20" cy="20" rx="16" ry="14" transform="rotate(-12 20 20)"
        fill="none" stroke="var(--color-border-strong)"
        strokeWidth="2.2" strokeDasharray="4 3" strokeOpacity="0.35"
      />
    </svg>
  </div>
);

/* ── Squiggly divider ────────────────────────────────────────── */
const Squiggle = () => (
  <svg className="comment-card__squiggle" viewBox="0 0 120 10"
    preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 5 C10 1, 20 9, 30 5 C40 1, 50 9, 60 5 C70 1, 80 9, 90 5 C100 1, 110 9, 120 5"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
    />
  </svg>
);

/* ── Main component ──────────────────────────────────────────── */
const Comments = () => {
  const [activeComment, setActiveComment] = useState(null);
  const toggle = (i) => setActiveComment(i === activeComment ? null : i);

  return (
    <section className="comments-section">
      <Doodles />
      <CommentsHeader />

      <ul className="comments-list">
        {comments.map((comment, i) => (
          <li
            key={comment.id}
            className={`comment-card${activeComment === i ? " is-active" : ""}`}
            onClick={() => toggle(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggle(i)}
            aria-expanded={activeComment === i}
          >
            {/* shadow — z-index:0, rendered BEFORE inner card */}
            <div className="comment-card__shadow" aria-hidden="true" />

            {/* inner card — z-index:1, sits ON TOP of shadow */}
            <div className="comment-card__inner">
              <span className="comment-card__bigquote" aria-hidden="true">"</span>

              <div className="comment-card__body">
                <p className="comment-card__text">{comment.text}</p>

                <footer className="comment-card__footer">
                  <Squiggle />
                  <strong className="comment-card__name">{comment.username}</strong>
                  <span   className="comment-card__role">{comment.jobTitle}</span>
                </footer>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Comments;
