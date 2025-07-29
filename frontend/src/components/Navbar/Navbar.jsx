// frontend/src/components/Navbar/Navbar.jsx
import React, { useRef, useState, useEffect } from "react";
import "./style/Navbar.css"; // Kendi CSS'inizi kullanıyoruz
import { useTheme } from "../../context/ThemeContext";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

// Kendi SVG'leriniz
import iconSvgUrl from "../../assets/icons/navitem/icon.svg";
import LineSvg from "../../assets/icons/main/Line.svg";
import hamburgerIcon from "../../assets/icons/navbar/hamburger.svg";
import closeIcon from "../../assets/icons/navbar/close.svg";

// MUI Icons (Sadece tema butonu için)
import Brightness4Icon from "@mui/icons-material/Brightness4"; // Dark Mode Icon
import Brightness7Icon from "@mui/icons-material/Brightness7"; // Light Mode Icon

// Eski NavbarContainer, NavItem, IconContainer bileşenleri artık doğrudan bu dosyada
// veya hala ayrı dosyalardaysa ve bu CSS'e uyumluysa kullanılabilir.
// Şimdilik doğrudan div ve class'larla ilerliyorum.

export const Navbar = ({
  onScrollToAbout,
  onScrollToProjects,
  onScrollToContact,
}) => {
  const { theme, toggleTheme } = useTheme();
  const iconRef = useRef(null); // Ana logo/ikon için ref (useScrollAnimation için)
  const [showFullMenu, setShowFullMenu] = useState(true); // Ortadaki menünün görünürlüğü
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobil menü açık mı?

  useScrollAnimation(iconRef); // Bu hook ana ikona animasyon ekliyor

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 150; // Bu eşik değerini ayarlayabilirsiniz
      if (window.scrollY > scrollThreshold) {
        setShowFullMenu(false);
      } else {
        setShowFullMenu(true);
        // Eğer tam menü görünür hale gelirse ve mobil menü açıksa, mobil menüyü kapat
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]); // isMobileMenuOpen bağımlılığını ekledik

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavClick = (scrollFunction) => {
    if (scrollFunction) scrollFunction();
    closeMobileMenu();
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItemsData = [
    { label: "About", action: () => handleNavClick(onScrollToAbout) },
    { label: "Project", action: () => handleNavClick(onScrollToProjects) },
    { label: "Contact", action: () => handleNavClick(onScrollToContact) },
  ];

  return (
    <>
      {/* Tema Değiştirici Buton */}
      <button
        onClick={toggleTheme}
        className="theme-toggle-button"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {/* MUI İkonları Kullanımı */}
        {theme === "light" ? (
          <Brightness4Icon fontSize="inherit" />
        ) : (
          <Brightness7Icon fontSize="inherit" />
        )}
      </button>

      {/* Sabit Hamburger/Kapatma İkonu (Tam menü gizliyken görünür) */}
      {!showFullMenu && (
        <div
          className="navbar-icon-fixed"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu-list"
        >
          <img
            src={isMobileMenuOpen ? closeIcon : hamburgerIcon}
            alt="Menu Toggle"
            // width ve height CSS'den geliyor
          />
        </div>
      )}

      {/* Ana Navbar Kapsayıcısı */}
      <div
        className={`navbar-background-container ${
          showFullMenu ? "" : "navbar-hidden"
        }`}
      >
        <div className="navbar-container">
          {" "}
          {/* Ortadaki kutu */}
          <div className="icon-container">
            {" "}
            {/* Sol ikon */}
            <img
              ref={iconRef} // useScrollAnimation için
              src={iconSvgUrl}
              alt="Icon"
              width="24px" // CSS'den de ayarlanabilir
              height="24px"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                closeMobileMenu(); // Sayfa başına gidince mobil menüyü de kapat
              }}
              style={{ cursor: "pointer", display: "block" }}
            />
          </div>
          <div className="nav-items-container">
            {" "}
            {/* Menü öğeleri */}
            {navItemsData.map((item) => (
              <div
                key={item.label}
                className="nav-item" // NavItem.jsx yerine doğrudan class
                onClick={item.action}
                role="button" // Erişilebilirlik için
                tabIndex={0} // Klavye ile focus alabilmesi için
                onKeyPress={(e) => e.key === "Enter" && item.action()} // Enter ile tetikleme
              >
                {item.label}
              </div>
            ))}
          </div>
          {/* Dekoratif Noktalar */}
          <div className="decorative-dot" style={{ left: -3, top: -3 }} />
          <div className="decorative-dot" style={{ right: -3, top: -3 }} />
          <div className="decorative-dot" style={{ left: -3, bottom: -3 }} />
          <div className="decorative-dot" style={{ right: -3, bottom: -3 }} />
        </div>

        {/* Navbar Altındaki Çizgi SVG (Tam menü görünürken) */}
        {showFullMenu && (
          <div className="navbar-outline">
            <img
              src={LineSvg}
              alt="" // Dekoratif olduğu için alt boş bırakılabilir veya gizlenebilir
              aria-hidden="true"
              // style CSS'den geliyor
            />
          </div>
        )}
      </div>

      {/* Mobil Menü (Açık ve tam menü gizliyken görünür) */}
      {isMobileMenuOpen && !showFullMenu && (
        <div className="mobile-menu" id="mobile-menu-list" role="menu">
          {navItemsData.map((item) => (
            <div
              key={item.label}
              className="nav-item" // Mobil menüdeki öğeler için de aynı class
              onClick={item.action}
              role="menuitem" // Erişilebilirlik
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
