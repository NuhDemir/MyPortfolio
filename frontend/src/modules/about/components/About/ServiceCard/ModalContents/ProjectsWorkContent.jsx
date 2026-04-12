import React from "react";

const ProjectsWorkContent = () => {
  const projectHighlights = [
    {
      name: "JavaScript Ogreniyorum",
      summary:
        "Temelden ileri seviyeye JavaScript konularini adim adim anlatan egitim reposu.",
      href: "https://github.com/NuhDemir/javascript-ogreniyorum",
    },
    {
      name: "Flutter Sign Language Translator",
      summary:
        "Sesli ifadeleri metin ve isaret dili gostergelerine ceviren erisilebilirlik odakli mobil prototip.",
      href: "https://github.com/NuhDemir/flutter-sign-language",
    },
  ];

  const professionalFocus = [
    {
      area: "Full-stack Product Delivery",
      detail:
        "React ve Node.js tabanli urunlerde tasarimdan yayina kadar tum teslim zincirini yonetme.",
    },
    {
      area: "API & Backend Architecture",
      detail:
        "Node.js, Express ve MongoDB ile olceklenebilir, test edilebilir servis katmanlari kurma.",
    },
    {
      area: "User-centric Iteration",
      detail:
        "Kullanicidan gelen geri bildirimleri hizli iterasyonla urune yansitma ve etkisini olcme.",
    },
  ];

  return (
    <div className="about-modal-content" data-about-modal="projects">
      <section className="about-modal-content__panel scribble-card-wrap">
        <div
          className="about-modal-content__panel-fill scribble-card-wrap__fill"
          aria-hidden="true"
        />
        <div className="about-modal-content__panel-body naive-shadow--sm">
          <h3 className="about-modal-content__heading">Projects & Work Experience</h3>
          <p className="about-modal-content__lead">
            Urettigim projelerde teknik kaliteyi, kullanici deneyimini ve teslim
            hizini birlikte optimize etmeyi hedefliyorum.
          </p>
        </div>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Highlighted Repositories</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {projectHighlights.map((project) => (
            <li key={project.name} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{project.name}</span>
              <span className="about-modal-content__item-body">{project.summary}</span>
              <span className="about-modal-content__item-body">
                <a
                  className="about-modal-content__inline-link"
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Delivery Focus</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {professionalFocus.map((focus) => (
            <li key={focus.area} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{focus.area}</span>
              <span className="about-modal-content__item-body">{focus.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="about-modal-content__footnote">
        Tum acik kaynak calismalarimi{" "}
        <a
          className="about-modal-content__inline-link"
          href="https://github.com/NuhDemir"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub profilimde
        </a>{" "}
        paylasiyorum.
      </p>
    </div>
  );
};

export default ProjectsWorkContent;
