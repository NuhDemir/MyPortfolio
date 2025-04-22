import React from "react";
import useLoadingAnimation from "../../hooks/useLoadingAnimation";
import "./style/SocialLinks.css"; // animasyon stili için

const SocialLinkSplash = ({ show }) => {
  const splashRef = useLoadingAnimation(show);

  return show ? (
    <div className="splash-overlay" ref={splashRef}>
      <div className="splash-content">Sayfa yükleniyor...</div>
    </div>
  ) : null;
};

export default SocialLinkSplash;
