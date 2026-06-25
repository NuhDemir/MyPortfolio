import React from "react";

export const NavbarMenuList = ({
  items,
  onActivate,
  onHoverSound,
  activePath,
  className = "",
  itemClassName = "",
}) => {
  const isPathActive = (itemPath, currentPath) => {
    if (itemPath === "/") return currentPath === "/";
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
  };

  return (
    <div className={className}>
      {items.map((item) => (
        <button
          key={item.path}
          type="button"
          className={`${itemClassName} ${isPathActive(item.path, activePath) ? "nav-item--active" : ""}`}
          onClick={() => onActivate(item.path)}
          onMouseEnter={onHoverSound}
          aria-label={`${item.label} sayfasina git`}
          aria-current={isPathActive(item.path, activePath) ? "page" : undefined}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
