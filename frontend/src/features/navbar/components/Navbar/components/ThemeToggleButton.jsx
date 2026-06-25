import React from "react";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export const ThemeToggleButton = ({ theme, onToggle, onHoverSound }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onHoverSound}
      className="theme-toggle-button"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Brightness4Icon fontSize="inherit" />
      ) : (
        <Brightness7Icon fontSize="inherit" />
      )}
    </button>
  );
};
