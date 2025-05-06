// frontend/src/components/SocialLinks/SocialLinks.jsx
import React, { useState } from "react";
import "./style/SocialLinks.css";
import SocialLinkSplash from "./SocialLinkSplash";

// PDF dosyasını import et
import NuhDemirCV from "../../assets/cv/NuhDemirCV.pdf"; // PDF dosyasının doğru yolunu kontrol et

const SocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Sayfa yükleniyor..."); // Splash için mesaj

  const handleClick = (
    e,
    href,
    isExternal = true,
    message = "Sayfa yükleniyor..."
  ) => {
    e.preventDefault(); // Her zaman default davranışı engelle
    setLoadingMessage(message);
    setLoading(true);

    setTimeout(() => {
      if (isExternal) {
        // Dış linkler veya aynı sekmede açılacak iç linkler için
        window.location.href = href;
      } else {
        // Yeni sekmede açılacak PDF veya diğer assetler için
        window.open(href, "_blank");
      }
      // Yönlendirme/açma sonrası loading state'ini sıfırlamak isteyebiliriz
      // ama yeni sayfa açılacağı/yükleneceği için genellikle gerek kalmaz.
      // setLoading(false);
    }, 1000); // 1 saniyelik efekt
  };

  return (
    <>
      <div className="social-links">
        <a
          href="https://github.com/NuhDemir"
          className="social-link"
          onClick={(e) =>
            handleClick(
              e,
              "https://github.com/NuhDemir",
              true,
              "GitHub açılıyor..."
            )
          }
          target="_blank" // Dış linkleri yeni sekmede açmak genellikle daha iyi bir UX'tir
          rel="noopener noreferrer"
          aria-label="GitHub profilimi ziyaret et"
        >
          Github
        </a>
        <a
          href="https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi"
          className="social-link"
          onClick={(e) =>
            handleClick(
              e,
              "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi",
              true,
              "Youtube açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Youtube kanalımı ziyaret et"
        >
          Youtube
        </a>
        {/* CV Linki */}
        <a
          href={NuhDemirCV} // Import edilen PDF dosyasının URL'si
          className="social-link"
          onClick={(e) =>
            handleClick(e, NuhDemirCV, false, "CV görüntüleniyor...")
          } // isExternal: false (çünkü window.open kullanacağız)
          // target="_blank" ve rel="noopener noreferrer" zaten handleClick içinde window.open ile yönetilecek
          // ama direkt HTML'de de belirtmek iyi bir pratiktir.
          target="_blank"
          rel="noopener noreferrer" // PDF yeni sekmede açılacağı için
          aria-label="CV'mi görüntüle"
        >
          CV
        </a>
        <a
          href="https://www.linkedin.com/in/nuh-demir-69b737261/"
          className="social-link"
          onClick={(e) =>
            handleClick(
              e,
              "https://www.linkedin.com/in/nuh-demir-69b737261/",
              true,
              "LinkedIn açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profilimi ziyaret et"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/yazilimkiraathanesi/"
          className="social-link"
          onClick={(e) =>
            handleClick(
              e,
              "https://www.instagram.com/yazilimkiraathanesi/",
              true,
              "Instagram açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram profilimi ziyaret et"
        >
          Instagram
        </a>
      </div>
      <SocialLinkSplash show={loading} message={loadingMessage} />{" "}
      {/* Mesajı prop olarak geç */}
    </>
  );
};

export default SocialLinks;
