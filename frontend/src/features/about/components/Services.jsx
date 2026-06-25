import React, { useState, useMemo } from "react";
import { getServicesData } from "../services/servicesDataService.js";
import ServiceModal from "./ServiceModal.jsx";
import { PatternBackground } from "@shared";

export const Services = () => {
  const [selected, setSelected] = useState(null);
  const services = useMemo(() => getServicesData(), []);

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
              <PatternBackground seed={s.id} opacity={0.28} />
              <span>{s.title[0]}</span>
            </div>
            
            <div className="service-body">
              <h3 className="service-title">{s.title}</h3>
              <p className="service-problem">{s.problem}</p>
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