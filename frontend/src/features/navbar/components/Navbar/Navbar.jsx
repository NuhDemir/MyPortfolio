import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./style/Navbar.css";
import { useTheme } from "@core";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { useSound } from "@shared";
import { NAVBAR_ITEMS } from "./config/navItems";
import { NavbarMenuList } from "./components/NavbarMenuList";
import { ThemeToggleButton } from "./components/ThemeToggleButton";
import { MobileMenuToggle } from "./components/MobileMenuToggle";
import { NavbarPattern } from "./components/NavbarPattern";

const ICON_SVG_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947779/portfolio/public/assets/icons/navitem/icon.svg";
const HAMBURGER_ICON_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947778/portfolio/public/assets/icons/navbar/hamburger.svg";
const CLOSE_ICON_PATH = "https://res.cloudinary.com/dahmmlu7u/image/upload/v1775947777/portfolio/public/assets/icons/navbar/close.svg";

export const Navbar = ({
  onScrollToAbout,
  onScrollToProjects,
  onScrollToContact,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const iconRef = useRef(null);
  const navbarContainerRef = useRef(null);
  const [showFullMenu, setShowFullMenu] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const themeTransitionTimeoutRef = useRef(null);

  const playHoverSound = useSound("/audio/hover-click.mp3", 0.2);
  const playClickSound = useSound("/audio/action-click.mp3", 0.4);

  useScrollAnimation(iconRef, navbarContainerRef);

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

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigateTo = (path) => {
    if (path === location.pathname) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(path);
  };

  const handleNavClick = (path) => {
    playClickSound();

    if (path === "/hakkimda" && onScrollToAbout) {
      onScrollToAbout();
      closeMobileMenu();
      return;
    }
    if (path === "/projeler" && onScrollToProjects) {
      onScrollToProjects();
      closeMobileMenu();
      return;
    }
    if (path === "/iletisim" && onScrollToContact) {
      onScrollToContact();
      closeMobileMenu();
      return;
    }

    navigateTo(path);
    closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    playClickSound();
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
    playClickSound();

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
    playClickSound();
    navigateTo("/");
    closeMobileMenu();
  };

  return (
    <>
      <ThemeToggleButton
        theme={theme}
        onToggle={handleThemeToggle}
        onHoverSound={playHoverSound}
      />

      {!showFullMenu && (
        <MobileMenuToggle
          isOpen={isMobileMenuOpen}
          onToggle={toggleMobileMenu}
          onHoverSound={playHoverSound}
          hamburgerIcon={HAMBURGER_ICON_PATH}
          closeIcon={CLOSE_ICON_PATH}
        />
      )}

      <div
        className={`navbar-background-container ${
          showFullMenu ? "" : "navbar-hidden"
        }`}
      >
        <div className="navbar-container" ref={navbarContainerRef}>
          <NavbarPattern />
          <div
            className="icon-container"
            onClick={handleIconClick}
            onMouseEnter={playHoverSound}
            style={{ cursor: "pointer" }}
          >
            <img
              ref={iconRef}
              src={ICON_SVG_PATH}
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
            activePath={location.pathname}
            onHoverSound={playHoverSound}
            onActivate={handleNavClick}
          />
        </div>
      </div>

      {isMobileMenuOpen && !showFullMenu && (
        <div className="mobile-menu" id="mobile-menu-list" role="menu">
          <NavbarMenuList
            items={NAVBAR_ITEMS}
            className="mobile-menu-list"
            itemClassName="nav-item"
            activePath={location.pathname}
            onHoverSound={playHoverSound}
            onActivate={handleNavClick}
          />
        </div>
      )}
    </>
  );
};
