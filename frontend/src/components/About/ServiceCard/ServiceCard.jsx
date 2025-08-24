import React from "react";
import { gsap } from "gsap"; // GSAP'ı doğrudan import et

// Artık animasyon hook'una ihtiyacı yok
const ServiceCard = ({
  icon,
  iconBgColor,
  title,
  description,
  onLearnMoreClick,
}) => {
  // Hover animasyonunu yöneten fonksiyonlar doğrudan burada
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, { x: 5, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, duration: 0.3, ease: "power2.out" });
  };

  return (
    <div className="service-card">
      <div className="icon-wrapper" style={{ backgroundColor: iconBgColor }}>
        <img src={icon} alt={title} className="service-icon" />
      </div>
      <div className="service-title">{title}</div>
      <div className="service-desc">{description}</div>
      <button
        className="learn-more"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onLearnMoreClick}
      >
        Learn more
      </button>
    </div>
  );
};

export default ServiceCard;
