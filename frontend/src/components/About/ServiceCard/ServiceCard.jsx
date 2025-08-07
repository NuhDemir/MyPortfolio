import React, { useRef } from "react";
import useGsapAnimations from "../../../hooks/useAboutGsapAnimation";

const ServiceCard = ({
  icon,
  iconBgColor,
  title,
  description,
  onLearnMoreClick,
}) => {
  const learnMoreRef = useRef(null);
  const { animateLearnMoreHover } = useGsapAnimations();

  // Not: Bu JS animasyonu, CSS'teki hover media query'sinden bağımsız çalışır.
  // Gerekirse bu animasyonu da sadece büyük ekranlarda tetiklemek için bir kontrol eklenebilir.
  // Ancak mevcut haliyle de bir sorun teşkil etmeyecektir.
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
      <div className="icon-wrapper" style={{ backgroundColor: iconBgColor }}>
        <img src={icon} alt={title} className="service-icon" />
      </div>
      <div className="service-title">{title}</div>
      <div className="service-desc">{description}</div>
      <button
        className="learn-more"
        ref={learnMoreRef}
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
