// src/hooks/useMouseLightEffect.js
import { useEffect, useRef } from "react";
import gsap from "gsap";

export const useMouseLightEffect = (isEnabled = true) => {
  const overlayRef = useRef(null); // Overlay div'ine referans

  useEffect(() => {
    // Efekt etkin değilse veya overlay zaten varsa ve gizlenmesi gerekiyorsa
    if (!isEnabled) {
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            // Opaklık animasyonu bittikten sonra DOM'dan kaldır
            if (overlayRef.current && overlayRef.current.parentNode) {
              overlayRef.current.parentNode.removeChild(overlayRef.current);
              overlayRef.current = null;
            }
          },
        });
      }
      return; // Daha fazla işlem yapma
    }

    // Overlay elementini oluştur (eğer zaten yoksa)
    let overlay = overlayRef.current;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "mouse-light-overlay"; // CSS class'ı
      document.body.appendChild(overlay); // body'e ekle
      overlayRef.current = overlay;
      // Başlangıçta CSS değişkenlerini ortada olacak şekilde ayarla
      gsap.set(overlay, {
        "--mouse-x": window.innerWidth / 2,
        "--mouse-y": window.innerHeight / 2,
      });
    }

    // Overlay'i görünür yap (yumuşak bir geçişle)
    gsap.to(overlay, { opacity: 1, duration: 0.5, delay: 0.1 });

    const handleMouseMove = (event) => {
      if (!overlayRef.current) return; // Overlay yoksa bir şey yapma

      const { clientX, clientY } = event;

      // CSS değişkenlerini GSAP ile yumuşak bir şekilde güncelle
      gsap.to(overlayRef.current, {
        "--mouse-x": clientX, // Mouse'un X pozisyonu
        "--mouse-y": clientY, // Mouse'un Y pozisyonu
        duration: 0.2, // Işığın mouse'u takip etme hızı (düşük değer = hızlı)
        ease: "power1.out", // Yumuşak bir ease efekti
      });
    };

    // Mouse hareketlerini dinle
    window.addEventListener("mousemove", handleMouseMove);

    // Temizlik fonksiyonu: Component unmount olduğunda veya isEnabled false olduğunda çalışır
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Overlay'i DOM'dan kaldırmadan önce opaklığını düşürerek gizle
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            if (overlayRef.current && overlayRef.current.parentNode) {
              // Animasyon bittikten sonra DOM'dan kaldır
              overlayRef.current.parentNode.removeChild(overlayRef.current);
              overlayRef.current = null; // Referansı sıfırla
            }
          },
        });
      }
    };
  }, [isEnabled]); // Sadece isEnabled değiştiğinde effect'i yeniden çalıştır

  // Bu hook doğrudan bir JSX döndürmediği için bir şey return etmesi gerekmiyor,
  // ama debugging veya ileri düzey kullanım için ref'i döndürebiliriz.
  return overlayRef;
};
