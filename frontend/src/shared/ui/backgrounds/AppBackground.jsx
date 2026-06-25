import { useState } from "react";
import { useLocation } from "react-router-dom";
import { PatternBackground, PATTERN_VARIANTS } from "@shared";
import "./AppBackground.css";

const pickRandom = () => {
  const idx = Math.floor(Math.random() * PATTERN_VARIANTS.length);
  return PATTERN_VARIANTS[idx];
};

const AppBackground = () => {
  const { pathname } = useLocation();
  const [variant] = useState(pickRandom);

  if (pathname.startsWith("/admin")) return null;

  return (
    <div className="ds-app-bg" aria-hidden="true">
      <div className="ds-app-bg__pattern">
        <PatternBackground variant={variant} opacity={0.08} />
      </div>
    </div>
  );
};

export default AppBackground;