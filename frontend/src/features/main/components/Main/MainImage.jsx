import React, { memo, useEffect, useRef, useState } from "react";
import { gsap } from "gsap"; // GSAP'ı toaster animasyonu için import et

const HERO_IMAGE_PATH = "/logo/logo-portfolio.png";

// Ayrı bir hook'a gerek yoksa, mantığı doğrudan bileşene entegre edebiliriz.
// Eğer hook'u başka yerde de kullanıyorsanız, onu GSAP kullanacak şekilde güncelleyebilirsiniz.



// Bileşeni forwardRef ile sarmalıyoruz ki App.jsx'ten gelen ref'i alabilsin.
const MainImage = React.forwardRef((props, ref) => {
  // Toaster (söz balonu) ve hover olayları için referanslar
  const containerRef = useRef(null);
  const toasterRef = useRef(null); // GSAP'ın anime edeceği toaster
  const quoteRef = useRef({ current: null, timer: null }); // Mevcut sözü ve zamanlayıcıyı saklamak için
  const [isImageReady, setIsImageReady] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const assignRefs = (node) => {
    containerRef.current = node;

    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  const showQuote = () => {
    if (quoteRef.current.timer) clearTimeout(quoteRef.current.timer);




    // Toaster'ın metnini güncelle ve animasyonu başlat
    if (toasterRef.current) {
      toasterRef.current.textContent = quoteRef.current.current;
      gsap.to(toasterRef.current, {
        opacity: 1,
        y: 15, // Aşağı doğru kayma mesafesi
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleImageReady = () => {
    setIsImageReady(true);
  };

  useEffect(() => {
  

    return () => {
     
    };
  }, []);

  const hideQuote = () => {
    // Fare ayrıldıktan sonra hafif bir gecikmeyle gizle
    quoteRef.current.timer = setTimeout(() => {
      if (toasterRef.current) {
        gsap.to(toasterRef.current, {
          opacity: 0,
          y: 0, // Orijinal pozisyonuna geri dön
          visibility: "hidden",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }, 150); // 150ms gecikme
  };

  return (
    // `ref`'i doğrudan ana konteynere atıyoruz. GSAP animasyonları bu ref'i kullanacak.
    <div
      ref={assignRefs}
      className="main-image"
      onMouseEnter={showQuote}
      onMouseLeave={hideQuote}
      onTouchStart={showQuote}
      onTouchEnd={hideQuote}
    >
      {!isImageReady ? (
        <div className="main-image-loader" aria-live="polite">
          <div className="main-image-loader-chip">YUKLENIYOR</div>
          <div className="main-image-loader-track" aria-hidden="true">
            <span className="main-image-loader-bar" />
          </div>
        </div>
      ) : null}

      {hasImageError && (
        <div className="main-image-error" aria-live="polite">
          <span>Hero yüklenmedi</span>
        </div>
      )}
      <img
        src={HERO_IMAGE_PATH}
        alt="Hero illustration"
        className="main-image-visual"
        onLoad={handleImageReady}
        onError={() => setHasImageError(true)}
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />

     
    </div>
  );
});

export default memo(MainImage);
