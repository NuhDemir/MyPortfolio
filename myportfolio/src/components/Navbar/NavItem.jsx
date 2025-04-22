// src/components/Navbar/NavItem.jsx
import React from "react";
import "./style/Navbar.css";

export const NavItem = ({ children, onClick }) => {
  return (
    <div className="nav-item" onClick={onClick}>
      {children}
    </div>
  );
};
