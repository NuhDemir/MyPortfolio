import React from "react";
import styled from "styled-components";
import iconSvg from "../../assets/navitem/icon.svg";
import LineSvg from "../../assets/main/Line.svg";
// Ana Navbar Konteyneri
const NavbarBackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;

  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// İçerik Konteyneri
const NavbarContainer = styled.div`
  position: relative;
  width: 340px;
  height: 40px;
  display: flex;
  align-items: center;
  background: #20262fff;
  justify-content: space-between;
  border: 1px solid #384456;
`;

// Logo Konteyneri
const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  background: #0b1420;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #384456;
`;

// Navigasyon Öğeleri Konteyneri
const NavItemsContainer = styled.div`
  display: flex;
  height: 100%;
`;

// Navigasyon Öğesi
const NavItem = styled.div`
  color: white;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #384456;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2a3747;
  }

  &:last-child {
    border-right: none;
  }
`;

// Dekoratif Nokta
const DecorativeDot = styled.div`
  width: 4px;
  height: 4px;
  background: white;
  position: absolute;
`;
const NavbarOutline = styled.div`
  margin-top: 60px;
  left: 0;
  position: fixed;
  top: 0;
  width: 1448px;
`;
export const Navbar = () => {
  return (
    <NavbarBackgroundContainer>
      <NavbarContainer>
        {/* Logo */}
        <IconContainer>
          <img src={iconSvg} alt="Icon" width="24px" height="24px" />
        </IconContainer>

        {/* Navigasyon Öğeleri */}
        <NavItemsContainer>
          <NavItem>Hakkımda</NavItem>
          <NavItem>Portfolio</NavItem>
          <NavItem>İletişim</NavItem>
        </NavItemsContainer>

        {/* Dekoratif Noktalar */}
        <DecorativeDot style={{ left: -2, top: -2 }} />
        <DecorativeDot style={{ right: -2, top: -2 }} />
        <DecorativeDot style={{ left: -2, bottom: -2 }} />
        <DecorativeDot style={{ right: -2, bottom: -2 }} />
      </NavbarContainer>

      <NavbarOutline>
        <img src={LineSvg} alt="Line" width="1448px" />
      </NavbarOutline>
    </NavbarBackgroundContainer>
  );
};
