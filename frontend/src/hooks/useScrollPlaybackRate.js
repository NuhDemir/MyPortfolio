import { useState, useEffect, useRef } from "react";

/**
 * Kullanıcının scroll hızına bağlı olarak ses çalma oranını (playbackRate) hesaplayan bir React hook'u.
 * Müzik çalarken scroll yapıldığında müziği hızlandırır/yavaşlatır, scroll durduğunda normale döndürür.
 * @param {boolean} isPlaying - Sesin o anda çalıp çalmadığını belirten durum.
 * @returns {number} Hesaplanan playbackRate değeri (örneğin: 1.0, 1.5, 0.8).
 */
const useScrollPlaybackRate = (isPlaying) => {
  // --- Ayarlanabilir Değişkenler ---
  const MIN_RATE = 0.7; // Ulaşılabilen en yavaş hız
  const MAX_RATE = 2.5; // Ulaşılabilen en yüksek hız
  const SENSITIVITY = 8; // Scroll hızının playbackRate'e etkisini ayarlar (düşük değer = daha hassas)
  const SMOOTHING = 0.08; // Hız değişiminin yumuşaklığını ayarlar (düşük değer = daha yumuşak)
  const RESET_DELAY = 150; // Scroll durduktan kaç milisaniye sonra hızın normale döneceği

  // --- Dahili Durum ve Referanslar ---
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const lastScrollY = useRef(0);
  const lastTimestamp = useRef(performance.now());
  const animationFrameId = useRef(null);
  const resetTimeoutId = useRef(null);

  useEffect(() => {
    // Eğer müzik çalmıyorsa, listener'ları çalıştırma ve hızı 1.0'e ayarla.
    if (!isPlaying) {
      setPlaybackRate(1.0);
      return;
    }

    const handleScroll = () => {
      // Önceki "normale dön" zamanlayıcısını temizle
      if (resetTimeoutId.current) {
        clearTimeout(resetTimeoutId.current);
      }

      // Performans için önceki animasyon karesini iptal et
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // Hesaplamaları tarayıcının bir sonraki boyama işleminden önce yap
      animationFrameId.current = requestAnimationFrame(() => {
        const now = performance.now();
        const deltaTime = now - lastTimestamp.current;
        const deltaY = window.scrollY - lastScrollY.current;

        // Çok kısa aralıklardaki hatalı hesaplamaları atla
        if (deltaTime < 10) return;

        // Piksel/milisaniye cinsinden scroll hızını hesapla
        const speed = Math.abs(deltaY / deltaTime);

        // Hızı, 1.0 tabanına ekleyerek hedef çalma oranına dönüştür
        let targetRate = 1.0 + speed / SENSITIVITY;

        // Hesaplanan oranı, belirlenen min ve max sınırlar içinde tut (clamping)
        targetRate = Math.max(MIN_RATE, Math.min(MAX_RATE, targetRate));

        // Hız değişiminin ani olmaması için yumuşatma (linear interpolation) uygula
        setPlaybackRate(
          (prevRate) => prevRate + (targetRate - prevRate) * SMOOTHING
        );

        // Referansları bir sonraki hesaplama için güncelle
        lastScrollY.current = window.scrollY;
        lastTimestamp.current = now;
      });

      // Scroll durduğunda hızı yavaşça normale döndürmek için zamanlayıcı ayarla
      resetTimeoutId.current = setTimeout(() => {
        setPlaybackRate(2.0);
      }, RESET_DELAY);
    };

    // İlk değerleri ayarla ve scroll olay dinleyicisini ekle
    lastScrollY.current = window.scrollY;
    lastTimestamp.current = performance.now();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup fonksiyonu: Component kaldırıldığında veya isPlaying false olduğunda çalışır
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (resetTimeoutId.current) {
        clearTimeout(resetTimeoutId.current);
      }
    };
  }, [isPlaying]); // Bu effect sadece 'isPlaying' durumu değiştiğinde yeniden çalışır

  return playbackRate;
};

export default useScrollPlaybackRate;
