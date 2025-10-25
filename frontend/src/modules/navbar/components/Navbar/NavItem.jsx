// src/components/Navbar/NavItem.jsx
import React from "react";
import useNavItemGsapAnimation from "../../hooks/useNavItemGsapAnimation"; // Hook'u import et
import "./style/Navbar.css";

export const NavItem = ({ children, onClick }) => {
  // Hook'u çağır ve gerekli değerleri al
  const { itemRef, handleMouseEnter, handleMouseLeave } =
    useNavItemGsapAnimation();

  return (
    // Ana div elemanına ref'i ve mouse event handler'larını bağla
    <div
      className="nav-item"
      ref={itemRef} // GSAP'in hedeflemesi için ref
      onClick={onClick}
      onMouseEnter={handleMouseEnter} // Mouse üzerine gelince
      onMouseLeave={handleMouseLeave} // Mouse üzerinden çekilince
    >
      {children}
    </div>
  );
};
