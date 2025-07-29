import React, { useState, useRef, useEffect } from "react";
import { Github, Youtube, Linkedin, Instagram, FileText } from "lucide-react";
import { useSound } from "../../hooks/useSound";
import SocialLinkSplash from "./SocialLinkSplash";
import "./style/SocialLinks.css";
import NuhDemirCV from "../../cv/NuhDemirCV.pdf";

// Merkezi Konfigürasyon: Linkleri, ikonları ve mesajları tek bir yerden yönet
const socialLinksConfig = [
  {
    name: "Github",
    href: "https://github.com/NuhDemir",
    Icon: Github,
    message: "GitHub reposu yükleniyor...",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@Yaz%C4%B1l%C4%B1mK%C4%B1raathanesi",
    Icon: Youtube,
    message: "YouTube kanalı açılıyor...",
  },
  {
    name: "CV",
    href: NuhDemirCV,
    Icon: FileText,
    isExternal: false,
    message: "CV belgesi hazırlanıyor...",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nuh-demir-69b737261/",
    Icon: Linkedin,
    message: "LinkedIn profili getiriliyor...",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/yazilimkiraathanesi/",
    Icon: Instagram,
    message: "Instagram sayfasına bağlanılıyor...",
  },
];

const SocialLinks = () => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const timeoutRef = useRef(null);

  // Sesleri hook ile tanımla
  const playHoverSound = useSound("/audio/hover-click.mp3", 0.2);
  const playClickSound = useSound("/audio/action-click.mp3", 0.4);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    playClickSound(); // Tıklama sesini çal

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoadingMessage(link.message);
    setLoading(true);

    timeoutRef.current = setTimeout(() => {
      if (link.isExternal !== false) {
        window.location.href = link.href;
      } else {
        window.open(link.href, "_blank");
        timeoutRef.current = setTimeout(() => setLoading(false), 1200);
      }
    }, 800);
  };

  return (
    <>
      <div className="social-links-container">
        <div className="social-links-grid">
          {socialLinksConfig.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="social-button"
              onMouseEnter={playHoverSound}
              onClick={(e) => handleLinkClick(e, link)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.name} profilini ziyaret et`}
            >
              <link.Icon className="social-icon" size={20} strokeWidth={2} />
              <span className="social-text">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
      <SocialLinkSplash show={loading} message={loadingMessage} />
    </>
  );
};

export default SocialLinks;
