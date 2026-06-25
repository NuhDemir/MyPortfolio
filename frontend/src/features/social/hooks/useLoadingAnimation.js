import { useEffect } from "react";
import gsap from "gsap";

/**
 * Bir elementin görünürlüğüne ('show' prop'una) bağlı olarak
 * giriş ve çıkış animasyonlarını yöneten bir React hook'u.
 * GSAP Context kullanarak React 18 Strict Mode ile uyumlu çalışır.
 *
 * @param {React.RefObject} targetRef - Animasyonun uygulanacağı elementin referansı.
 * @param {boolean} show - Elementin gösterilip gösterilmeyeceğini belirten durum.
 */
const useLoadingAnimation = (targetRef, show) => {
  useEffect(() => {
    // Güvenlik kontrolü: Animasyon hedefi DOM'a bağlanmamışsa hiçbir şey yapma.
    if (!targetRef.current) {
      return;
    }

    // GSAP Context oluştur. Bu, animasyonları temizlemek için en iyi yoldur.
    // Bu context içindeki tüm GSAP animasyonları, cleanup fonksiyonunda revert() ile temizlenir.
    const ctx = gsap.context(() => {
      if (show) {
        // GİRİŞ ANİMASYONU: Elementi görünür yap
        gsap.fromTo(
          targetRef.current,
          { opacity: 0, scale: 0.95, y: -10 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      } else {
        // ÇIKIŞ ANİMASYONU: Elementi gizle
        // Not: Bu animasyon sadece 'show' true'dan false'a geçtiğinde çalışır.
        // Bileşen DOM'dan kaldırılmadan hemen önce animasyonun bitmesi için
        // parent bileşenin state yönetiminin doğru olması gerekir.
        gsap.to(targetRef.current, {
          opacity: 0,
          scale: 0.95,
          y: -10,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }, [targetRef]); // Context'in kapsamını belirt

    // Cleanup fonksiyonu:
    // Bu effect yeniden çalıştığında veya bileşen unmount olduğunda,
    // context içindeki tüm animasyonları temizler.
    return () => ctx.revert();
  }, [show, targetRef]); // Sadece 'show' veya 'targetRef' değiştiğinde çalışır.
};

export default useLoadingAnimation;
