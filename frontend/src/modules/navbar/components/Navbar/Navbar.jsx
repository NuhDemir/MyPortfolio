import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Navbar.css";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useSound } from "@shared/hooks/useSound.js"; // Ses hook'unu import et

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
  const navigate = useNavigate();
  const location = useLocation();
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

  const navigateToSection = (sectionId) => {
    if (location.pathname === "/") {
      const sectionNode = document.getElementById(sectionId);
      if (sectionNode) {
        sectionNode.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const handleNavClick = (scrollFunction, sectionId) => {
    playClickSound(); // Tıklama sesini çal

    if (scrollFunction) {
      scrollFunction();
    } else if (sectionId) {
      navigateToSection(sectionId);
    }

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

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }

    closeMobileMenu();
  };

  const navItemsData = [
    {
      label: "About",
      sectionId: "about-section",
      action: () => handleNavClick(onScrollToAbout, "about-section"),
    },
    {
      label: "Project",
      sectionId: "projects-section",
      action: () => handleNavClick(onScrollToProjects, "projects-section"),
    },
    {
      label: "Contact",
      sectionId: "contact-section",
      action: () => handleNavClick(onScrollToContact, "contact-section"),
    },
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
        <button
          type="button"
          className="navbar-icon-fixed"
          onClick={toggleMobileMenu}
          onMouseEnter={playHoverSound}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-list"
          aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          <img
            src={isMobileMenuOpen ? closeIcon : hamburgerIcon}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
          />
        </button>
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
