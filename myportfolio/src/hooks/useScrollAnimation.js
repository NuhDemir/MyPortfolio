// src/hooks/useScrollAnimation.js
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (iconRef) => {
  useEffect(() => {
    // Icon animasyonu
    const icon = iconRef.current;
    if (!icon) return;

    // Initial animation - hafif bir rotate ve scale
    gsap.to(icon, {
      rotation: 720,
      duration: 0.2,
      ease: "power1.inOut",
    });

    // Scroll animasyonu - scrub özelliği ile kaydırma miktarına bağlı animasyon
    gsap.to(icon, {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: true, // Geliştirme aşamasında true yapabilirsiniz
      },
      rotation: 720, // Üç tam döngü (3 * 360)
      scale: 1,
      duration: 0.5,
      ease: "none",
    });

    // Hover animasyonu için event listeners
    const handleMouseEnter = () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: "power1.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: "power1.in",
      });
    };

    const iconContainer = icon.parentElement;
    iconContainer.addEventListener("mouseenter", handleMouseEnter);
    iconContainer.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup
    return () => {
      if (iconContainer) {
        iconContainer.removeEventListener("mouseenter", handleMouseEnter);
        iconContainer.removeEventListener("mouseleave", handleMouseLeave);
      }

      // ScrollTrigger'ı temizle
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [iconRef]);
};
