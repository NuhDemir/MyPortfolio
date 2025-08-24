import React, { useState, useEffect, useRef } from "react";
import useLoadingAnimation from "../../hooks/useLoadingAnimation"; // Yeni hook'umuzu import ediyoruz
import "./style/SocialLinks.css"; // Stil dosyanızın yolu buysa...

const SocialLinkSplash = ({ show, message = "Yükleniyor..." }) => {
  // --- YENİ: Çıkış animasyonunun bitmesini beklemek için bir state ---
  // Bu state, bileşenin DOM'da kalıp kalmayacağını kontrol eder.
  const [shouldRender, setShouldRender] = useState(show);

  // --- GÜNCELLENDİ: Referansı burada, bileşenin kendisinde oluşturuyoruz ---
  const splashRef = useRef(null);

  // --- GÜNCELLENDİ: Hook'u yeni, doğru şekilde çağırıyoruz ---
  // Hook'a referansı ve 'show' durumunu parametre olarak veriyoruz.
  useLoadingAnimation(splashRef, show);

  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let typingInterval;

    if (show) {
      // 1. Gösterileceği zaman, render edilmesini sağla.
      setShouldRender(true);

      // Daktilo efektini başlat.
      setTypedMessage(""); // Her açıldığında mesajı sıfırla
      let i = 0;
      typingInterval = setInterval(() => {
        if (i < message.length) {
          setTypedMessage((prev) => prev + message.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50); // Daktilo hızı
    } else {
      // 2. Gizleneceği zaman, çıkış animasyonunun bitmesi için bir gecikme sonrası
      // bileşeni DOM'dan kaldıracak olan state'i güncelle.
      const unmountTimer = setTimeout(() => {
        setShouldRender(false);
      }, 400); // Bu süre, useLoadingAnimation'daki çıkış animasyon süresinden (0.3s) biraz uzun olmalı.

      return () => clearTimeout(unmountTimer);
    }

    // Cleanup: Bileşen kaldırıldığında veya 'show' değiştiğinde interval'i temizle.
    return () => clearInterval(typingInterval);
  }, [show, message]);

  // --- GÜNCELLENDİ: Artık 'show' yerine 'shouldRender' durumuna göre render ediyoruz ---
  if (!shouldRender) {
    return null;
  }

  return (
    // Referansı ilgili DOM elementine bağlıyoruz
    <div className="splash-overlay-v2" ref={splashRef}>
      <div className="splash-content-v2">
        <div className="splash-terminal-header">
          <span>COMMAND PROMPT</span>
          <div className="splash-terminal-buttons">
            <span /> <span /> <span />
          </div>
        </div>
        <div className="splash-terminal-body">
          <span className="splash-prompt">C:\&gt;</span>{" "}
          {/* Prompt'u daha gerçekçi yapalım */}
          <span className="splash-typed-message">{typedMessage}</span>
          <span className="splash-cursor">_</span>
        </div>
      </div>
    </div>
  );
};

export default SocialLinkSplash;
