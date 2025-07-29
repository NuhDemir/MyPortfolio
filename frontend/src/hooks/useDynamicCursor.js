import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const useDynamicCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    // İmleç elemanını bir kere oluştur
    if (!cursorRef.current) {
      cursorRef.current = document.createElement("div");
      cursorRef.current.className = "dynamic-cursor";
      document.body.appendChild(cursorRef.current);
    }

    const cursor = cursorRef.current;

    // GSAP'nin 'quickTo' fonksiyonu ile pürüzsüz hareket
    // Dış halkanın daha yavaş, iç noktanın daha hızlı gelmesi hissini duration ile ayarlıyoruz.
    const cursorXQuickTo = gsap.quickTo(cursor, "x", {
      duration: 0.5,
      ease: "power3",
    });
    const cursorYQuickTo = gsap.quickTo(cursor, "y", {
      duration: 0.5,
      ease: "power3",
    });

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      // GSAP ile pozisyonu güncelle
      cursorXQuickTo(clientX);
      cursorYQuickTo(clientY);
    };

    // Tıklanabilir elemanların üzerine gelince imlece 'hover' sınıfı ekle/kaldır
    const handleMouseOver = (e) => {
      if (
        e.target.closest(
          'a, button, [role="button"], input, textarea, [data-cursor-hover]'
        )
      ) {
        cursor.classList.add("hover");
      }
    };

    const handleMouseOut = (e) => {
      if (
        e.target.closest(
          'a, button, [role="button"], input, textarea, [data-cursor-hover]'
        )
      ) {
        cursor.classList.remove("hover");
      }
    };

    // Fare basılı tutulduğunda imlece 'active' sınıfı ekle/kaldır
    const handleMouseDown = () => cursor.classList.add("active");
    const handleMouseUp = () => cursor.classList.remove("active");

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseover", handleMouseOver);
    document.body.addEventListener("mouseout", handleMouseOut);
    document.body.addEventListener("mousedown", handleMouseDown);
    document.body.addEventListener("mouseup", handleMouseUp);

    // Temizlik fonksiyonu
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseover", handleMouseOver);
      document.body.removeEventListener("mouseout", handleMouseOut);
      document.body.removeEventListener("mousedown", handleMouseDown);
      document.body.removeEventListener("mouseup", handleMouseUp);
      if (cursor && cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
    };
  }, []); // Sadece bir kere çalışsın
};
