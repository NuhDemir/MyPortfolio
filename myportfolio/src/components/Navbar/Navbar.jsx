import React, { useRef, useState, useEffect } from "react";
import "./style/Navbar.css";
import iconSvg from "../../assets/navitem/icon.svg";
import LineSvg from "../../assets/main/Line.svg";
import hamburgerIcon from "../../assets/icons/navbar/hamburger.svg";
import closeIcon from "../../assets/icons/navbar/close.svg";
import { NavbarContainer } from "./NavbarContainer";
import { NavItem } from "./NavItem";
import { IconContainer } from "./IconContainer";

export const Navbar = () => {
  const iconRef = useRef(null);
  const [showMenu, setShowMenu] = useState(true); // Navbar açık mı?
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 200; // örnek değer
      if (window.scrollY > scrollThreshold) {
        setShowMenu(false); // navbar'ı minimize et
      } else {
        setShowMenu(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleItemClick = (itemName) => {
    console.log(`${itemName} öğesine tıklandı`);
    setIsMobileMenuOpen(false); // menüyü kapat
  };

  return (
    <>
      {/* Sabit ikon (scroll sonrası sağ üstte görünür) */}
      {!showMenu && (
        <div
          className="navbar-icon-fixed"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <img
            src={isMobileMenuOpen ? closeIcon : hamburgerIcon}
            alt="Menu Toggle"
            width="24"
            height="24"
          />
        </div>
      )}

      {/* Ana navbar */}
      <div
        className={`navbar-background-container ${
          !showMenu ? "navbar-hidden" : ""
        }`}
      >
        <NavbarContainer>
          <IconContainer>
            <img
              ref={iconRef}
              src={iconSvg}
              alt="Icon"
              width="24px"
              height="24px"
            />
          </IconContainer>

          <div className="nav-items-container">
            <NavItem onClick={() => handleItemClick("About")}>About</NavItem>
            <NavItem onClick={() => handleItemClick("Portfolio")}>
              Portfolio
            </NavItem>
            <NavItem onClick={() => handleItemClick("Contact")}>
              Contact
            </NavItem>
          </div>

          <div className="decorative-dot" style={{ left: -3, top: -3 }} />
          <div className="decorative-dot" style={{ right: -3, top: -3 }} />
          <div className="decorative-dot" style={{ left: -3, bottom: -3 }} />
          <div className="decorative-dot" style={{ right: -3, bottom: -3 }} />
        </NavbarContainer>

        <div className="navbar-outline">
          <img src={LineSvg} alt="Line" width={"2000px"} />
        </div>
      </div>

      {/* Mobil Menü */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <NavItem onClick={() => handleItemClick("About")}>About</NavItem>
          <NavItem onClick={() => handleItemClick("Portfolio")}>
            Portfolio
          </NavItem>
          <NavItem onClick={() => handleItemClick("Contact")}>Contact</NavItem>
        </div>
      )}
    </>
  );
};
