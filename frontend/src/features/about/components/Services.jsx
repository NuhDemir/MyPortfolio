import { useState } from "react";
import { useServices } from "../hooks/useServices.js";
import ServiceModal from "./ServiceModal.jsx";
import { PatternBackground, LoadingSpinner } from "@shared";

/** Sadece harici (http/https) URL'leri kabul eder, local asset path'lerini reddeder */
const getExternalImageUrl = (s) => {
  const url = s.image || s.iconUrl || "";
  return url.startsWith("http://") || url.startsWith("https://") ? url : null;
};

export const Services = () => {
  const { services, loading } = useServices();
  const [selected, setSelected] = useState(null);

  if (loading) {
    return (
      <section className="services-section">
        <h2 className="services-headline">Ne Yapıyorum</h2>
        <LoadingSpinner />
      </section>
    );
  }

  if (!services.length) return null;

  return (
    <section className="services-section">
      <h2 className="services-headline">Ne Yapıyorum</h2>

      <div className="services-grid">
        {services.map((s) => (
          <button
            key={s.id}
            type="button"
            className="service-card"
            onClick={() => setSelected(s)}
          >
            <div className="service-icon">
              {getExternalImageUrl(s) ? (
                <img
                  src={getExternalImageUrl(s)}
                  alt={s.title}
                  className="service-icon-img"
                  loading="lazy"
                />
              ) : (
                <>
                  <PatternBackground seed={s.id} opacity={0.28} />
                  <span>{s.title[0]}</span>
                </>
              )}
            </div>

            <div className="service-body">
              <h3 className="service-title">{s.title}</h3>
              <p className="service-problem">{s.problem || s.description}</p>
              <span className="service-cta">Nasıl çözüyorum →</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <ServiceModal service={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};
