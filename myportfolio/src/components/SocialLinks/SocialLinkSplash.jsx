// frontend/src/components/SocialLinks/SocialLinkSplash.jsx
import React from "react";
// useLoadingAnimation hook'unun animasyon için gerekli olduğunu varsayıyoruz.
// Eğer bu hook GSAP veya benzeri bir kütüphane kullanıyorsa, o kütüphanenin de
// doğru şekilde import edildiğinden/kurulduğundan emin olun.
import useLoadingAnimation from "../../hooks/useLoadingAnimation";
import "./style/SocialLinks.css"; // Splash ekranının CSS'i burada olmalı

const SocialLinkSplash = ({ show, message = "Sayfa yükleniyor..." }) => {
  // useLoadingAnimation hook'u, 'show' durumuna göre splashRef elementine
  // bir giriş/çıkış animasyonu uyguluyor olmalı.
  const splashRef = useLoadingAnimation(show);

  // Eğer 'show' false ise, hiçbir şey render etme (null dön).
  if (!show) {
    return null;
  }

  // 'show' true ise, splash ekranını render et.
  return (
    <div className="splash-overlay" ref={splashRef}>
      <div className="splash-content">{message}</div>
    </div>
  );
};

export default SocialLinkSplash;
