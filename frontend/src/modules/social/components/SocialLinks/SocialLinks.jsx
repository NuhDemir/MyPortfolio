import React, { useState, useRef, useEffect } from "react";
import { Github, Youtube, Linkedin, Instagram, FileText } from "lucide-react";
import { useSound } from "@shared/hooks/useSound.js";
import SocialLinkSplash from "./SocialLinkSplash";
import "./style/SocialLinks.css";

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
    // href'i artık doğrudan vermiyoruz. Tıklandığında yüklenecek.
    // PDF'in paylaşılan varlıklar altında olduğunu varsayıyoruz.
    filePath: "@shared/assets/docs/NuhDemirCV.pdf",
    Icon: FileText,
    isDynamic: true, // Dinamik olarak yükleneceğini belirtmek için bir flag
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

  const playHoverSound = useSound("/audio/hover-click.mp3", 0.2);
  const playClickSound = useSound("/audio/action-click.mp3", 0.4);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleLinkClick = async (e, link) => {
    // Fonksiyonu async yapıyoruz
    e.preventDefault();
    playClickSound();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setLoadingMessage(link.message);
    setLoading(true);

    // --- YENİ DİNAMİK YÜKLEME MANTIĞI ---
    if (link.isDynamic) {
      try {
        // Dinamik import: Sadece şimdi PDF modülünü yükle
        const pdfModule = await import(/* @vite-ignore */ link.filePath);
        const pdfUrl = pdfModule.default; // Vite'in döndürdüğü gerçek URL'yi al

        timeoutRef.current = setTimeout(() => {
          window.open(pdfUrl, "_blank"); // URL'yi yeni sekmede aç
          setLoading(false); // Yükleme ekranını hemen kapatabiliriz
        }, 800);
      } catch (error) {
        console.error("PDF yüklenirken hata oluştu:", error);
        setLoadingMessage("CV yüklenemedi. Lütfen tekrar deneyin.");
        timeoutRef.current = setTimeout(() => setLoading(false), 2000);
      }
    } else {
      // Normal linkler için eski mantık devam ediyor
      timeoutRef.current = setTimeout(() => {
        window.location.href = link.href;
      }, 800);
    }
  };

  return (
    <>
      <div className="social-links-container">
        <div className="social-links-grid">
          {socialLinksConfig.map((link) => (
            <a
              key={link.name}
              href={link.href || "#"} // href boş olmasın, dinamik linkler için # koyabiliriz
              className="social-button"
              onMouseEnter={playHoverSound}
              onClick={(e) => handleLinkClick(e, link)}
              // Dinamik olmayan linkler için target="_blank"
              target={!link.isDynamic ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={`${link.name} ${
                link.isDynamic ? "belgesini aç" : "profilini ziyaret et"
              }`}
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
