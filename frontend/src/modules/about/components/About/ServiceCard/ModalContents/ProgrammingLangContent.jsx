import React from "react";

const ProgrammingLangContent = () => {
  const languages = [
    {
      name: "JavaScript (ES6+)",
      description: "React ve Node.js tarafında uçtan uca ürün geliştirme.",
    },
    {
      name: "TypeScript",
      description:
        "Büyük kod tabanlarında güvenli refactor ve daha güçlü API sözleşmeleri.",
    },
    {
      name: "Python",
      description:
        "Otomasyon, veri işleme ve hızlı prototipleme odaklı backend görevleri.",
    },
    {
      name: "Dart",
      description:
        "Flutter ile erişilebilir ve performanslı çapraz platform mobil deneyimler.",
    },
  ];

  return (
    <div className="about-modal-content" data-about-modal="programming">
      <section className="about-modal-content__panel scribble-card-wrap">
        <div
          className="about-modal-content__panel-fill scribble-card-wrap__fill"
          aria-hidden="true"
        />
        <div className="about-modal-content__panel-body naive-shadow--sm">
          <h3 className="about-modal-content__heading">Programming Languages & Approach</h3>
          <p className="about-modal-content__lead">
            Her projede okunabilirlik, sürdürülebilirlik ve performans arasında
            dengeli bir mimari hedefliyorum.
          </p>
        </div>
      </section>

      <section className="about-modal-content__section">
        <h4 className="about-modal-content__section-title">Core Language Stack</h4>
        <ul className="about-modal-content__section-body about-modal-content__list">
          {languages.map((language) => (
            <li key={language.name} className="about-modal-content__item">
              <span className="about-modal-content__item-title">{language.name}</span>
              <span className="about-modal-content__item-body">{language.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="about-modal-content__footnote">
        Hedefim teknoloji seçimini trend ile degil, urun gereksinimi ve uzun
        vadeli bakim maliyeti ile birlikte degerlendirmek.
      </p>
    </div>
  );
};

export default ProgrammingLangContent;
