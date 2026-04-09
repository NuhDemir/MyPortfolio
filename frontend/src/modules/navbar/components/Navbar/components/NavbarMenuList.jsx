import React from "react";

export const NavbarMenuList = ({
  items,
  onActivate,
  onHoverSound,
  className = "",
  itemClassName = "",
}) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <button
          key={item.sectionId}
          type="button"
          className={itemClassName}
          onClick={() => onActivate(item.sectionId)}
          onMouseEnter={onHoverSound}
          aria-label={`${item.label} bolumune git`}
        >
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
