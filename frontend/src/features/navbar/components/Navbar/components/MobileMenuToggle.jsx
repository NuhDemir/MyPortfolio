import React from "react";

export const MobileMenuToggle = ({
  isOpen,
  onToggle,
  onHoverSound,
  hamburgerIcon,
  closeIcon,
}) => {
  return (
    <button
      type="button"
      className="navbar-icon-fixed"
      onClick={onToggle}
      onMouseEnter={onHoverSound}
      aria-expanded={isOpen}
      aria-controls="mobile-menu-list"
      aria-label={isOpen ? "Menuyu kapat" : "Menuyu ac"}
    >
      <img
        src={isOpen ? closeIcon : hamburgerIcon}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
      />
    </button>
  );
};
