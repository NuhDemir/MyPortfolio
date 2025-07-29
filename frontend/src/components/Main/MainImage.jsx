import React, { forwardRef, useRef } from "react";
import MainSvg from "../../assets/icons/main/main.svg"; // Dosya yolunu kontrol edin
import useMainImageAnimation from "../../hooks/useMainImageAnimation"; // Mevcut animasyon hook'u
import useHoverQuotes from "../../hooks/useHoverQuotes"; // Hook'u ayrı dosyadan import et

// Gösterilecek geliştirici sözleri
const developerQuotes = [
  "It works on my machine!",
  "Debugging is like being the detective in a crime movie where you are also the murderer.",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "First, solve the problem. Then, write the code.",
  "Java is to JavaScript what car is to Carpet.",
  "Premature optimization is the root of all evil.",
  "One more compile...",
  "Sleep is for the weak. Debugging needs coffee.",
  "Have you tried turning it off and on again?",
  "git push --force",
];

const MainImage = forwardRef((props, ref) => {
  // --- Mevcut Ref Yönetimi ---
  const internalRef = useRef(null);
  const combinedRef = ref || internalRef; // Bu ref dış div'e (main-image) atanacak

  // --- Mevcut Animasyon Hook'u ---
  // Verdiğiniz CSS'te zaten transition olduğu için bu hook'un
  // aynı özellikleri (opacity, transform) kontrol etmemesine dikkat edin
  // veya bu hook'u GSAP gibi farklı bir animasyon için kullanıyorsanız sorun yok.
  useMainImageAnimation(combinedRef);

  // --- YENİ: Hover için Ref ve Hook Kullanımı ---
  const imageRef = useRef(null); // Hover olayları için img elemanına ref
  const { currentQuote, isQuoteVisible } = useHoverQuotes(
    imageRef, // Dinlenecek eleman: img
    developerQuotes,
    { hideDelay: 150, delay: 50 } // Fare ayrıldıktan sonra 150ms, göstermeden önce 50ms bekle
  );
  // --- YENİ SONU ---

  // --- Toaster için Inline Stiller ---
  const toasterBaseStyle = {
    position: "absolute", // .main-image'e göre konumlanacak
    left: "50%",
    transform: "translateX(-50%)", // Yatayda ortala
    zIndex: 2, // .main-image'in z-index'inden (1) daha yüksek olmalı
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    color: "#f0f0f0",
    padding: "8px 15px", // Biraz daha kompakt
    borderRadius: "6px",
    fontSize: "0.8rem", // Biraz daha küçük
    fontFamily: "Arial, sans-serif",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
    transition:
      "opacity 0.3s ease-out, bottom 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
    opacity: 0,
    visibility: "hidden",
    pointerEvents: "none",
    bottom: "0px", // Resmin alt kenarına yakın başlasın (görünmezken)
  };

  const toasterVisibleStyle = {
    opacity: 1,
    visibility: "visible",
    // pointerEvents: 'auto', // Genelde gerek yok
    bottom: "-25px", // Resmin altına doğru bu kadar insin
  };
  // --- Stil Sonu ---

  return (
    // Dış Div: className="main-image" ve CSS'deki stiller uygulanacak
    // Bu div zaten `position: absolute` olduğu için toaster'ın konumlanması için uygundur.
    <div
      ref={combinedRef}
      className="main-image" // Mevcut class'ınız
      // style prop'una dokunmuyoruz, CSS'ten gelsin
    >
      {/* Resim Elemanı: className="main-image img" CSS'i ile stillenecek */}
      <img
        ref={imageRef} // Hover hook'u bu ref'i kullanacak
        src={MainSvg}
        alt="Developer working with retro computers"
        // style veya className eklemeye gerek yok, CSS hedefliyor
      />

      {/* YENİ: Sözleri gösteren "toaster" elemanı (Inline Stillerle) */}
      <div
        style={{
          ...toasterBaseStyle,
          ...(isQuoteVisible ? toasterVisibleStyle : {}),
        }}
        aria-live="polite"
        role="status"
      >
        {currentQuote}
      </div>
      {/* YENİ SONU */}
    </div>
  );
});

export default MainImage;
