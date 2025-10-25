// src/hooks/useScrollAnimation.js
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (targetRef) => {
  // Daha genel bir isim: targetRef
  useEffect(() => {
    const targetElement = targetRef.current;
    if (!targetElement) {
      console.warn("useScrollAnimation Hook: Target element not found.");
      return;
    }

    // --- 1. Başlangıç Görünüm Animasyonu (Scroll'dan Bağımsız) ---
    // Sayfa yüklendiğinde ikonun yumuşak bir şekilde belirmesi için.
    // Bu, scroll animasyonunun rotasyonunu etkilememeli.
    gsap.fromTo(
      targetElement,
      { scale: 0.5, autoAlpha: 0, rotation: 0 }, // Başlangıç durumu: küçük, görünmez, rotasyonsuz
      {
        scale: 1,
        autoAlpha: 1,
        rotation: 0, // Başlangıçta dönmesin, scroll ile dönecek
        duration: 0.8,
        ease: "back.out(1.4)", // Güzel bir belirme efekti
        delay: 0.3, // Belki splash screen sonrası için hafif bir gecikme
      }
    );

    // --- 2. Scroll ile Dönme Animasyonu ---
    // Bu animasyon, sayfa kaydırıldıkça targetElement'in rotasyonunu değiştirecek.
    const scrollTween = gsap.to(targetElement, {
      rotation: "+=1080", // Sayfa boyunca toplamda 3 tam tur daha DÖNSÜN (mevcut pozisyonuna ekleyerek)
      // Örn: Eğer sayfanın yarısına gelindiğinde 540 derece dönmüş olacak.
      ease: "none", // Scrub ile en iyi sonucu 'none' verir, kaydırmayla birebir senkronize olur.
      scrollTrigger: {
        trigger: document.body, // Animasyonun tetikleyicisi tüm sayfa
        start: "top top", // Animasyon, sayfanın en tepesi viewport'un en tepesine geldiğinde başlar
        end: "bottom bottom", // Animasyon, sayfanın en altı viewport'un en altına geldiğinde biter
        scrub: 1.5, // Kaydırmayı 1.5 saniyelik bir yumuşaklıkla takip eder.
        // `true` da kullanabilirsiniz, daha direkt bir takip için.
        // Değer ne kadar yüksekse, o kadar yumuşak/gecikmeli olur.
        // markers: true,        // Geliştirme sırasında tetik noktalarını görmek için açın
        // onUpdate: self => {   // İsteğe bağlı: İlerlemeyi ve rotasyonu loglamak için
        //   console.log("Scroll Progress:", self.progress.toFixed(3), "Rotation:", gsap.getProperty(targetElement, "rotation").toFixed(2));
        // }
      },
    });

    // --- 3. Hover Animasyonu (Ölçek Değişimi) ---
    const parentContainer = targetElement.parentElement;
    let hoverTween = null; // Aktif hover animasyonunu tutmak için

    const handleMouseEnter = () => {
      if (hoverTween) hoverTween.kill(); // Önceki hover animasyonunu durdur
      hoverTween = gsap.to(targetElement, {
        scale: 1.25, // Hover'da biraz daha büyüsün
        duration: 0.25,
        ease: "power1.out",
      });
    };

    const handleMouseLeave = () => {
      if (hoverTween) hoverTween.kill(); // Önceki hover animasyonunu durdur
      hoverTween = gsap.to(targetElement, {
        scale: 1, // Normal ölçeğine dönsün
        duration: 0.25,
        ease: "power1.in",
      });
    };

    if (parentContainer) {
      parentContainer.addEventListener("mouseenter", handleMouseEnter);
      parentContainer.addEventListener("mouseleave", handleMouseLeave);
    } else {
      console.warn(
        "useScrollAnimation Hook: Parent container for hover not found."
      );
    }

    // --- Temizlik Fonksiyonu (ÇOK ÖNEMLİ!) ---
    return () => {
      // Event listener'ları kaldır
      if (parentContainer) {
        parentContainer.removeEventListener("mouseenter", handleMouseEnter);
        parentContainer.removeEventListener("mouseleave", handleMouseLeave);
      }

      // ScrollTrigger'ı ve bağlantılı animasyonu temizle
      if (scrollTween && scrollTween.scrollTrigger) {
        scrollTween.scrollTrigger.kill(); // Sadece bu hook'un oluşturduğu ScrollTrigger'ı öldürür
      }
      if (hoverTween) {
        hoverTween.kill(); // Aktif hover tween'ini temizle
      }

      // targetElement üzerindeki tüm GSAP animasyonlarını durdur (başlangıç animasyonu dahil)
      gsap.killTweensOf(targetElement);
    };
  }, [targetRef]); // targetRef değişirse bu effect yeniden çalışır
};
