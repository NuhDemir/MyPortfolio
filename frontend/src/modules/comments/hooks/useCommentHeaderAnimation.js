// src/hooks/useCommentHeaderAnimation.js
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger kullanmak için

gsap.registerPlugin(ScrollTrigger); // ScrollTrigger'ı kaydet

const useCommentHeaderAnimation = () => {
  const headerRef = useRef(null); // Ana konteyner için ref

  useEffect(() => {
    const headerElement = headerRef.current;
    // Header içindeki resmi hedefle (daha spesifik olmak için bir sınıf veya id de verilebilir)
    const imageElement = headerElement?.querySelector("img");

    if (headerElement && imageElement) {
      // Animasyon başlangıç durumu (isteğe bağlı, CSS'de de ayarlanabilir)
      gsap.set(imageElement, { opacity: 0, y: 30, scale: 0.9 });

      // ScrollTrigger ile animasyonu tetikle
      ScrollTrigger.create({
        trigger: headerElement, // Konteyner tetikleyici olacak
        start: "top 85%", // Konteynerin üstü ekranın %85'ine geldiğinde başla
        // end: 'bottom 20%', // İsteğe bağlı bitiş noktası
        // markers: true, // Geliştirme sırasında yardımcı olur
        onEnter: () => {
          // Tetiklendiğinde animasyonu oynat
          gsap.to(imageElement, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            delay: 0.2, // Hafif bir gecikme
          });
        },
        once: true, // Animasyon sadece bir kere tetiklensin
      });
    }

    // Cleanup (ScrollTrigger'ları temizlemek iyi bir pratiktir)
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Sadece component mount olduğunda çalışır

  // Hook'tan ref'i döndür ki bileşene bağlanabilsin
  return { headerRef };
};

export default useCommentHeaderAnimation;
