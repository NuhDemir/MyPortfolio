import { useEffect } from "react";
import gsap from "gsap";

export const useGsapAnimation = (
  mainRef,
  titleRef,
  subtitleRef,
  buttonRef,
  audioControlRef,
  imageRef // MainImage için ref'i de ekleyelim
) => {
  useEffect(() => {
    // Tüm referansların geçerli olduğundan emin ol
    const refs = [
      mainRef,
      titleRef,
      subtitleRef,
      buttonRef,
      audioControlRef,
      imageRef,
    ];
    if (refs.some((ref) => !ref.current)) return;

    // --- 1. GİRİŞ ANİMASYONU (Timeline) ---
    // Bu kısım zaten iyiydi, koruyoruz.
    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
    });

    // Animate edilecek elementleri bir dizide toplayalım
    const animatedElements = [
      titleRef.current,
      subtitleRef.current,
      audioControlRef.current,
      buttonRef.current,
      imageRef.current, // Resmi de animasyona dahil edelim
    ];

    // Animasyon öncesi başlangıç durumlarını ayarla
    gsap.set(animatedElements, { opacity: 0, y: 30 });

    // Animasyon sekansını oluştur
    tl.to(animatedElements, {
      opacity: 1,
      y: 0,
      stagger: 0.2, // Elemanların art arda gelmesini sağlar
      delay: 0.3, // Animasyonun başlaması için hafif bir gecikme
    });

    // --- 2. PERFORMANSLI PARALLAX ANİMASYONU (Mouse Takibi) ---
    // Olay dinleyicisi fonksiyonu
    const handleMouseMove = (e) => {
      if (!mainRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Mouse pozisyonuna göre -20px ile +20px arasında bir hareket hesapla
      // Bu değerleri değiştirerek efekti artırıp azaltabilirsiniz.
      const parallaxAmount = 20;
      const offsetX = (clientX / innerWidth - 0.5) * -parallaxAmount;
      const offsetY = (clientY / innerHeight - 0.5) * -parallaxAmount;

      // GSAP ile section'ın CSS değişkenlerini yumuşak bir geçişle güncelle
      gsap.to(mainRef.current, {
        "--bg-x": `${offsetX}px`,
        "--bg-y": `${offsetY}px`,
        duration: 0.8, // Hareketin ne kadar sürede tamamlanacağı
        ease: "power2.out",
      });
    };

    // Olay dinleyicisini window'a ekle
    window.addEventListener("mousemove", handleMouseMove);

    // --- 3. TEMİZLEME (Cleanup) FONKSİYONU ---
    // Component unmount olduğunda (sayfadan ayrıldığında) çalışır
    return () => {
      // Tüm GSAP animasyonlarını ve zamanlanmış olayları öldür
      // Bu, hafıza sızıntılarını ve istenmeyen animasyonları önler
      tl.kill();
      gsap.killTweensOf(mainRef.current); // mainRef üzerindeki animasyonları da durdur

      // Eklediğimiz olay dinleyicisini kaldır
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mainRef, titleRef, subtitleRef, buttonRef, audioControlRef, imageRef]); // ref'leri bağımlılık dizisine ekle
};
