import { useEffect, useRef } from "react";
import gsap from "gsap";

// Hakkında sayfası ve modal animasyonları için hook
const useAboutModalGsapAnimation = () => {
  const statsContainerRef = useRef(null); // İstatistik kartları için ref
  const servicesContainerRef = useRef(null); // Servis kartları için ref

  // --- İstatistik Kartları Animasyonu ---
  useEffect(() => {
    const stats = statsContainerRef.current?.children;
    if (stats) {
      gsap.from(stats, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          // ScrollTrigger eklenebilir
          trigger: statsContainerRef.current,
          start: "top 85%", // Konteyner %85 göründüğünde başla
          // toggleActions: 'play none none none', // Sadece bir kere oynat
        },
      });
    }
  }, []);

  // --- Servis Kartları Animasyonu ---
  useEffect(() => {
    const services = servicesContainerRef.current?.children;
    if (services) {
      gsap.from(services, {
        duration: 0.7,
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          // ScrollTrigger eklenebilir
          trigger: servicesContainerRef.current,
          start: "top 80%",
        },
      });
    }
  }, []);

  // --- "Learn More" Hover Animasyonu ---
  const animateLearnMoreHover = (element, isHovering) => {
    if (element) {
      gsap.to(element, {
        duration: 0.3,
        // x: isHovering ? 5 : 0, // Hafif sağa kayma
        scale: isHovering ? 1.1 : 1, // Biraz büyüme
        // color: isHovering ? '#007bff' : '#333', // Renk değişimi (CSS ile de yapılabilir)
        ease: "power1.inOut",
      });
    }
  };

  // --- Modal Açılma Animasyonu ---
  const animateModalOpen = (overlay, modalContent) => {
    gsap
      .timeline()
      .to(overlay, {
        duration: 0.3,
        opacity: 1,
        visibility: "visible",
        ease: "power2.inOut",
      })
      .to(
        modalContent,
        {
          duration: 0.4,
          opacity: 1,
          scale: 1,
          y: 0,
          visibility: "visible",
          ease: "back.out(1.7)",
        },
        "-=0.1"
      ); // Overlay'dan sonra başla
  };

  // --- Modal Kapanma Animasyonu ---
  const animateModalClose = (overlay, modalContent, onComplete) => {
    gsap
      .timeline({ onComplete }) // Bittiğinde callback çağır
      .to(modalContent, {
        duration: 0.3,
        opacity: 0,
        scale: 0.9,
        y: 20,
        ease: "power2.in",
      })
      .to(
        overlay,
        {
          duration: 0.3,
          opacity: 0,
          ease: "power2.inOut",
        },
        "-=0.1"
      ) // Modal kaybolurken overlay de başlasın
      .set([overlay, modalContent], { visibility: "hidden" }); // Sonunda gizle
  };

  // Hook'tan döndürülen değerler
  return {
    statsContainerRef,
    servicesContainerRef,
    animateLearnMoreHover,
    animateModalOpen,
    animateModalClose,
  };
};

export default useAboutModalGsapAnimation;
