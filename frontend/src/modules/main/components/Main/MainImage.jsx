import React, { useRef } from "react";
import { gsap } from "gsap"; // GSAP'ı toaster animasyonu için import et

// SVG'yi bir React Bileşeni olarak import ediyoruz
import MainSvgComponent from "/assets/icons/main/main.svg";

// Ayrı bir hook'a gerek yoksa, mantığı doğrudan bileşene entegre edebiliriz.
// Eğer hook'u başka yerde de kullanıyorsanız, onu GSAP kullanacak şekilde güncelleyebilirsiniz.

const developerQuotes = [
  "It works on my machine!",
  "Debugging is where you are the detective and the murderer.",
  "10 types of people: those who know binary, and those who don't.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "First, solve the problem. Then, write the code.",
  "Java is to JavaScript what car is to Carpet.",
  "Premature optimization is the root of all evil.",
  "git push --force",
];

// Bileşeni forwardRef ile sarmalıyoruz ki App.jsx'ten gelen ref'i alabilsin.
const MainImage = React.forwardRef((props, ref) => {
  // Toaster (söz balonu) ve hover olayları için referanslar
  const imageContainerRef = useRef(null); // Hover alanını belirlemek için
  const toasterRef = useRef(null); // GSAP'ın anime edeceği toaster
  const quoteRef = useRef({ current: null, timer: null }); // Mevcut sözü ve zamanlayıcıyı saklamak için

  const showQuote = () => {
    if (quoteRef.current.timer) clearTimeout(quoteRef.current.timer);

    // Rastgele bir söz seç (mevcut olanla aynı olmasın)
    let newQuote;
    do {
      newQuote =
        developerQuotes[Math.floor(Math.random() * developerQuotes.length)];
    } while (
      newQuote === quoteRef.current.current &&
      developerQuotes.length > 1
    );

    quoteRef.current.current = newQuote;

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
      ref={ref}
      className="main-image"
      onMouseEnter={showQuote}
      onMouseLeave={hideQuote}
    >
      {/* SVG Bileşenini render ediyoruz */}
      <img src={MainSvgComponent} />

      {/* Sözleri gösteren "toaster" elemanı */}
      <div ref={toasterRef} className="quote-toaster" aria-live="polite">
        {/* İçerik JS ile doldurulacak */}
      </div>
    </div>
  );
});

export default MainImage;
