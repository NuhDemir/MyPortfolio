import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Navbar.css";
import { useTheme } from "@core/context/ThemeContext.jsx";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useSound } from "@shared/hooks/useSound.js"; // Ses hook'unu import et
import { NAVBAR_ITEMS } from "./config/navItems";
import { NavbarMenuList } from "./components/NavbarMenuList";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { MobileMenuToggle } from "./components/MobileMenuToggle";

// SVG dosyaları
import iconSvgUrl from "/assets/icons/navitem/icon.svg";
import hamburgerIcon from "/assets/icons/navbar/hamburger.svg";
import closeIcon from "/assets/icons/navbar/close.svg";

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
  const themeTransitionTimeoutRef = useRef(null);

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

  const handleSectionNavigation = (sectionId) => {
    if (sectionId === "about-section") {
      handleNavClick(onScrollToAbout, sectionId);
      return;
    }

    if (sectionId === "projects-section") {
      handleNavClick(onScrollToProjects, sectionId);
      return;
    }

    handleNavClick(onScrollToContact, sectionId);
  };

  const toggleMobileMenu = () => {
    playClickSound(); // Tıklama sesini çal
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getThemeTransitionDuration = (htmlElement) => {
    const durationValue = window
      .getComputedStyle(htmlElement)
      .getPropertyValue("--theme-transition-duration")
      .trim();
    const parsed = Number.parseFloat(durationValue);

    if (!Number.isFinite(parsed) || parsed <= 0) {
      return 1100;
    }

    return durationValue.endsWith("ms") ? parsed : parsed * 1000;
  };

  const handleThemeToggle = (event) => {
    playClickSound(); // Tıklama sesini çal

    const htmlElement = document.documentElement;
    const targetButton = event?.currentTarget;
    if (htmlElement && targetButton) {
      const rect = targetButton.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const nextTheme = theme === "light" ? "dark" : "light";

      htmlElement.style.setProperty("--theme-transition-x", `${centerX}px`);
      htmlElement.style.setProperty("--theme-transition-y", `${centerY}px`);
      htmlElement.style.setProperty(
        "--theme-transition-overlay",
        nextTheme === "dark"
          ? "rgba(9, 16, 23, 0.86)"
          : "rgba(246, 252, 249, 0.88)",
      );
      htmlElement.classList.remove("theme-transition-active");
      void htmlElement.offsetWidth;
      htmlElement.classList.add("theme-transition-active");

      if (themeTransitionTimeoutRef.current) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
      }

      const transitionDuration = getThemeTransitionDuration(htmlElement);

      themeTransitionTimeoutRef.current = window.setTimeout(() => {
        htmlElement.classList.remove("theme-transition-active");
      }, transitionDuration + 80);
    }

    toggleTheme();
  };

  useEffect(() => {
    return () => {
      if (themeTransitionTimeoutRef.current) {
        window.clearTimeout(themeTransitionTimeoutRef.current);
      }
    };
  }, []);

  const handleIconClick = () => {
    playClickSound(); // Tıklama sesini çal

    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }

    closeMobileMenu();
  };

  return (
    <>
      <ThemeToggleButton
        theme={theme}
        onToggle={handleThemeToggle}
        onHoverSound={playHoverSound}
      />

      {/* Mobil Menü İkonu (Hamburger/Kapatma) */}
      {!showFullMenu && (
        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          onToggle={toggleMobileMenu}
          onHoverSound={playHoverSound}
          hamburgerIcon={hamburgerIcon}
          closeIcon={closeIcon}
        />
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

          <NavbarMenuList
            items={NAVBAR_ITEMS}
            className="nav-items-container"
            itemClassName="nav-item"
            onHoverSound={playHoverSound}
            onActivate={handleSectionNavigation}
          />
        </div>
      </div>

      {/* Açılan Mobil Menü */}
      {isMobileMenuOpen && !showFullMenu && (
        <div className="mobile-menu" id="mobile-menu-list" role="menu">
          <NavbarMenuList
            items={NAVBAR_ITEMS}
            className="mobile-menu-list"
            itemClassName="nav-item"
            onHoverSound={playHoverSound}
            onActivate={handleSectionNavigation}
          />
        </div>
      )}
    </>
  );
};
