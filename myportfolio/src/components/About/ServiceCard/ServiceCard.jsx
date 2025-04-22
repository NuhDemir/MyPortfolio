import React, { useRef } from "react";
import useGsapAnimations from "../../../hooks/useAboutGsapAnimation";

const ServiceCard = ({ icon, iconBgColor, textColor, title, description }) => {
  const learnMoreRef = useRef(null);
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
      <div className="icon-wrapper" style={{ backgroundColor: iconBgColor }}>
        <img src={icon} alt={title} className="service-icon" />
      </div>
      <div className="service-title" style={{ color: textColor }}>
        {title}
      </div>
      <div className="service-desc">{description}</div>
      <button
        className="learn-more"
        ref={learnMoreRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        Learn more
      </button>
    </div>
  );
};

export default ServiceCard;
