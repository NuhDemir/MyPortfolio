// src/components/About/ServiceCard/ServiceCard.jsx
import React, { useRef } from "react";
import useGsapAnimations from "../../../hooks/useAboutGsapAnimation"; // Kendi hook'unuzu kullanın

// onLearnMoreClick prop'unu ekleyin
const ServiceCard = ({
  icon,
  iconBgColor,
  textColor,
  title,
  description,
  onLearnMoreClick,
}) => {
  const learnMoreRef = useRef(null);
  // Hook'tan sadece hover animasyonunu alın
  const { animateLearnMoreHover } = useGsapAnimations();

  const handleMouseEnter = () => {
    if (learnMoreRef.current) {
      animateLearnMoreHover(learnMoreRef.current, true);
    }
  };

  const handleMouseLeave = () => {
    if (learnMoreRef.current) {
      animateLearnMoreHover(learnMoreRef.current, false);
    }
  };

  return (
    <div className="service-card">
      {/* İkon */}
      <div className="icon-wrapper" style={{ backgroundColor: iconBgColor }}>
        <img src={icon} alt={title} className="service-icon" />
      </div>
      {/* Başlık */}
      <div className="service-title" style={{ color: textColor }}>
        {title}
      </div>
      {/* Açıklama */}
      <div className="service-desc">{description}</div>
      {/* "Learn More" Butonu */}
      <button
        className="learn-more"
        ref={learnMoreRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onLearnMoreClick} // Tıklama olayını üst bileşene ilet
      >
        Learn more
      </button>
    </div>
  );
};

export default ServiceCard;
