import React from "react";

const DevToolsTechContent = () => {
  const workflowTools = [
    {
      title: "Version Control",
      description: "Git, GitHub ve GitLab ile ekip ici guvenli isbirligi.",
    },
    {
      title: "Package & Build",
      description: "npm, Yarn, Vite ve Webpack ile hizli gelistirme dongusu.",
    },
    {
      title: "API Testing",
      description: "Postman ve Insomnia ile sozlesme dogrulama ve smoke test.",
    },
    {
      title: "Planning",
      description: "Jira, Trello ve Asana ile gorunur sprint takip akisi.",
    },
  ];

  const platformTools = [
    {
      title: "Cloud & Hosting",
      description: "AWS, Google Cloud, Vercel ve Netlify ile production yayinlama.",
    },
    {
      title: "Containerization",
      description: "Docker ile ortama bagimsiz, tekrar edilebilir deploy sureci.",
    },
    {
      title: "Databases",
      description: "MongoDB, PostgreSQL ve MySQL ile kullanim senaryosuna gore secim.",
    },
  ];

  return (
    <div className="about-modal-content" data-about-modal="devtools">
      <section className="about-modal-content__panel scribble-card-wrap">
        <div
          className="about-modal-content__panel-fill scribble-card-wrap__fill"
          aria-hidden="true"
        />
        <div className="about-modal-content__panel-body naive-shadow--sm">
          <h3 className="about-modal-content__heading">Development Tools & Technologies</h3>
          <p className="about-modal-content__lead">
            Gelistirme surecini daha hizli, test edilebilir ve izlenebilir hale
            getiren araclara oncelik veriyorum.
          </p>
        </div>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Engineering Workflow</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {workflowTools.map((tool) => (
            <li key={tool.title} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{tool.title}</span>
              <span className="about-modal-content__item-body">{tool.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Platform & Infrastructure</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {platformTools.map((tool) => (
            <li key={tool.title} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{tool.title}</span>
              <span className="about-modal-content__item-body">{tool.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="about-modal-content__footnote">
        Arac seciminde hedefim sadece hiz degil, uzun vadede ekipte ortak kalite
        standardi olusturmak.
      </p>
    </div>
  );
};

export default DevToolsTechContent;
