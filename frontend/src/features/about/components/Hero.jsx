import React from "react";

export const Hero = ({ badge = "Hakkımda", title = "Nuh Demir", lead }) => (
  <section className="about3__hero">
    <p className="about3__eyebrow">{badge}</p>
    <h1 className="about3__title" data-hero-title>{title}</h1>
    {lead && <p className="about3__lead" data-hero-lead>{lead}</p>}
    <div className="about3__scroll-hint" aria-hidden="true">
      <span />
    </div>
  </section>
);
