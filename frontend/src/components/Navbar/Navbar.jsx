import React, { useRef, useState, useEffect } from "react";
import "./style/Navbar.css";
import { useTheme } from "../../context/ThemeContext";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useSound } from "../../hooks/useSound"; // Ses hook'unu import et

// SVG dosyaları
import iconSvgUrl from "/assets/icons/navitem/icon.svg";
import LineSvg from "/assets/icons/main/Line.svg";
import hamburgerIcon from "/assets/icons/navbar/hamburger.svg";
import closeIcon from "/assets/icons/navbar/close.svg";

// MUI Icons
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const Navbar = ({
  onScrollToAbout,
  onScrollToProjects,
  onScrollToContact,
}) => {
  const { theme, toggleTheme } = useTheme();
  const iconRef = useRef(null);
  const [showFullMenu, setShowFullMenu] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sesleri tanımla
  const playHoverSound = useSound("/audio/hover-click.mp3", 0.2);
  const playClickSound = useSound("/audio/action-click.mp3", 0.4);

  useScrollAnimation(iconRef);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 150;
      if (window.scrollY > scrollThreshold) {
        setShowFullMenu(false);
      } else {
        setShowFullMenu(true);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  // Tıklama olaylarını yöneten yardımcı fonksiyonlar
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (scrollFunction) => {
    playClickSound(); // Tıklama sesini çal
    if (scrollFunction) scrollFunction();
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    playClickSound(); // Tıklama sesini çal
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleThemeToggle = () => {
    playClickSound(); // Tıklama sesini çal
    toggleTheme();
  };

  const handleIconClick = () => {
    playClickSound(); // Tıklama sesini çal
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileMenu();
  };

  const navItemsData = [
    { label: "About", action: () => handleNavClick(onScrollToAbout) },
    { label: "Project", action: () => handleNavClick(onScrollToProjects) },
    { label: "Contact", action: () => handleNavClick(onScrollToContact) },
  ];

  return (
    <>
      {/* Tema Değiştirme Butonu */}
      <button
        onClick={handleThemeToggle}
        onMouseEnter={playHoverSound}
        className="theme-toggle-button"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <Brightness4Icon fontSize="inherit" />
        ) : (
          <Brightness7Icon fontSize="inherit" />
        )}
      </button>

      {/* Mobil Menü İkonu (Hamburger/Kapatma) */}
      {!showFullMenu && (
        <div
          className="navbar-icon-fixed"
          onClick={toggleMobileMenu}
          onMouseEnter={playHoverSound}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-list"
        >
          <img
            src={isMobileMenuOpen ? closeIcon : hamburgerIcon}
            alt="Menu Toggle"
          />
        </div>
      )}

      {/* Ana Navbar Konteyneri */}
      <div
        className={`navbar-background-container ${
          showFullMenu ? "" : "navbar-hidden"
        }`}
      >
        <div className="navbar-container">
          <div
            className="icon-container"
            onClick={handleIconClick}
            onMouseEnter={playHoverSound}
            style={{ cursor: "pointer" }}
          >
            <img
              ref={iconRef}
              src={iconSvgUrl}
              alt="Icon"
              width="24px"
              height="24px"
              style={{ display: "block" }}
            />
          </div>

          <div className="nav-items-container">
            {navItemsData.map((item) => (
              <div
                key={item.label}
                className="nav-item"
                onClick={item.action}
                onMouseEnter={playHoverSound}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === "Enter" && item.action()}
              >
                {item.label}
              </div>
            ))}
          </div>

          {/* Köşe Noktaları */}
          <div className="decorative-dot" style={{ left: -3, top: -3 }} />
          <div className="decorative-dot" style={{ right: -3, top: -3 }} />
          <div className="decorative-dot" style={{ left: -3, bottom: -3 }} />
          <div className="decorative-dot" style={{ right: -3, bottom: -3 }} />
        </div>

        {/* Alt Çizgi SVG'si */}
        {showFullMenu && (
          <div className="navbar-outline">
            <img src={LineSvg} alt="" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Açılan Mobil Menü */}
      {isMobileMenuOpen && !showFullMenu && (
        <div className="mobile-menu" id="mobile-menu-list" role="menu">
          {navItemsData.map((item) => (
            <div
              key={item.label}
              className="nav-item"
              onClick={item.action}
              onMouseEnter={playHoverSound}
              role="menuitem"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && item.action()}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
