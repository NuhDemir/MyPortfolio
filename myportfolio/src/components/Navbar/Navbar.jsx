// frontend/src/components/Navbar/Navbar.jsx
import React, { useRef, useState, useEffect } from "react";
import "./style/Navbar.css";
import iconSvgUrl from "../../assets/navitem/icon.svg";
// import { ReactComponent as IconSVG } from "../../assets/navitem/icon.svg"; // Alternatif SVG kullanımı
import LineSvg from "../../assets/main/Line.svg";
import hamburgerIcon from "../../assets/icons/navbar/hamburger.svg";
import closeIcon from "../../assets/icons/navbar/close.svg";
import { NavbarContainer } from "./NavbarContainer";
import { NavItem } from "./NavItem";
import { IconContainer } from "./IconContainer";
import { useScrollAnimation } from "../../hooks/useScrollAnimation"; // Hook'u import ettik

export const Navbar = ({
  onScrollToAbout,
  onScrollToProjects,
  onScrollToContact,
}) => {
  const iconRef = useRef(null); // İkon animasyonu için ref
  const [showMenu, setShowMenu] = useState(true); // Ana menünün görünürlüğü
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobil menünün açık/kapalı durumu

  // Scroll animasyon hook'unu ikon referansıyla çağır
  useScrollAnimation(iconRef);

  // Ana menünün scroll'a göre gösterilip gizlenmesi için useEffect
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200; // Navbar'ın kaybolma eşiği
      if (window.scrollY > scrollThreshold) {
        setShowMenu(false);
      } else {
        setShowMenu(true);
        // Ana menü göründüğünde mobil menü de açıksa kapat (isteğe bağlı ama daha iyi UX)
        // setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Sadece mount ve unmount'ta çalışır

  // Mobil menüyü kapatma fonksiyonu
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Navigasyon linkine tıklandığında ilgili bölüme git ve mobil menüyü kapat
  const handleNavClick = (scrollFunction) => {
    if (scrollFunction) scrollFunction();
    closeMobileMenu();
  };

  // Mobil menüyü aç/kapat fonksiyonu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Sabit Hamburger/Kapatma İkonu */}
      {/* Bu ikon sadece ana menü gizliyken (showMenu === false) görünür */}
      {!showMenu && (
        <div
          className="navbar-icon-fixed"
          onClick={toggleMobileMenu} // Tıklandığında mobil menüyü aç/kapat
        >
          <img
            src={isMobileMenuOpen ? closeIcon : hamburgerIcon}
            alt="Menu Toggle"
            width="24"
            height="24"
          />
        </div>
      )}

      {/* Ana Navbar Kapsayıcısı */}
      <div
        className={`navbar-background-container ${
          showMenu ? "" : "navbar-hidden" // Ana menü görünürlüğüne göre class
        }`}
      >
        <NavbarContainer>
          <IconContainer>
            {" "}
            {/* Hover animasyonu için parent element */}
            <img
              ref={iconRef} // GSAP animasyonları için ref burada
              src={iconSvgUrl}
              alt="Icon"
              width="24px"
              height="24px"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                closeMobileMenu(); // Sayfa başına gidince mobil menüyü kapat
              }}
              style={{ cursor: "pointer", display: "block" }} // `display: block` img'nin layout'unu iyileştirebilir
            />
            {/* Alternatif SVG Component Kullanımı:
            <IconSVG
              ref={iconRef} // Eğer IconSVG forwardRef kullanıyorsa
              width="24px"
              height="24px"
              onClick={() => { ... }}
              style={{ cursor: 'pointer', display: 'block' }}
            /> */}
          </IconContainer>

          <div className="nav-items-container">
            <NavItem onClick={() => handleNavClick(onScrollToAbout)}>
              About
            </NavItem>
            <NavItem onClick={() => handleNavClick(onScrollToProjects)}>
              Project
            </NavItem>
            <NavItem onClick={() => handleNavClick(onScrollToContact)}>
              Contact
            </NavItem>
          </div>

          {/* Dekoratif Noktalar */}
          <div className="decorative-dot" style={{ left: -3, top: -3 }} />
          <div className="decorative-dot" style={{ right: -3, top: -3 }} />
          <div className="decorative-dot" style={{ left: -3, bottom: -3 }} />
          <div className="decorative-dot" style={{ right: -3, bottom: -3 }} />
        </NavbarContainer>

        {/* Navbar Altındaki Çizgi SVG */}
        {/* Bu çizgi, ana navbar görünürken onunla birlikte gösterilmeli */}
        {showMenu && (
          <div className="navbar-outline">
            <img
              src={LineSvg}
              alt="Line"
              style={{ width: "100vw", maxWidth: "2000px", display: "block" }} // display:block eklendi
            />
          </div>
        )}
      </div>

      {/* Mobil Menü */}
      {/* Mobil menü, isMobileMenuOpen true VE ana menü gizli (showMenu false) iken görünür */}
      {isMobileMenuOpen && !showMenu && (
        <div className="mobile-menu">
          <NavItem onClick={() => handleNavClick(onScrollToAbout)}>
            About
          </NavItem>
          <NavItem onClick={() => handleNavClick(onScrollToProjects)}>
            Project
          </NavItem>
          <NavItem onClick={() => handleNavClick(onScrollToContact)}>
            Contact
          </NavItem>
        </div>
      )}
    </>
  );
};
