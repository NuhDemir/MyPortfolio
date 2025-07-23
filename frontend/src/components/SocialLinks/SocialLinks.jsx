// frontend/src/components/SocialLinks/SocialLinks.jsx
import React, { useState } from "react";
import "./style/SocialLinks.css";
import SocialLinkSplash from "./SocialLinkSplash";
import NuhDemirCV from "../../assets/cv/NuhDemirCV.pdf";

const SocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleLinkClick = (e, href, isExternal = true, message = "") => {
    e.preventDefault();
    setLoadingMessage(message);
    setLoading(true);

    setTimeout(() => {
      if (isExternal) {
        window.location.href = href;
      } else {
        window.open(href, "_blank");
        // Splash ekranını kapatmak için ek gecikme
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
    }, 1000); // Splash görünme süresi
  };

  return (
    <>
      <div className="social-links">
        <a
          href="https://github.com/NuhDemir"
          className="social-link"
          onClick={(e) =>
            handleLinkClick(
              e,
              "https://github.com/NuhDemir",
              true,
              "GitHub açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub profilini ziyaret et"
        >
          Github
        </a>
        <a
          href="https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi"
          className="social-link"
          onClick={(e) =>
            handleLinkClick(
              e,
              "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi",
              true,
              "YouTube açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube kanalını ziyaret et"
        >
          Youtube
        </a>
        <a
          href={NuhDemirCV}
          className="social-link"
          onClick={(e) =>
            handleLinkClick(e, NuhDemirCV, false, "CV görüntüleniyor...")
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="CV'yi görüntüle"
        >
          CV
        </a>
        <a
          href="https://www.linkedin.com/in/nuh-demir-69b737261/"
          className="social-link"
          onClick={(e) =>
            handleLinkClick(
              e,
              "https://www.linkedin.com/in/nuh-demir-69b737261/",
              true,
              "LinkedIn açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn profilini ziyaret et"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/yazilimkiraathanesi/"
          className="social-link"
          onClick={(e) =>
            handleLinkClick(
              e,
              "https://www.instagram.com/yazilimkiraathanesi/",
              true,
              "Instagram açılıyor..."
            )
          }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram profilini ziyaret et"
        >
          Instagram
        </a>
      </div>
      <SocialLinkSplash show={loading} message={loadingMessage} />
    </>
  );
};

export default SocialLinks;
