import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { PatternBackground } from "@shared/ui/patterns/components/PatternBackground.jsx";
import { VINTAGE_NEUBRUTAL_PATTERN_VARIANTS } from "@shared/ui/patterns/patternPresets.js";
import "./AppBackground.css";

const pickRandomVariant = (variants) => {
  const index = Math.floor(Math.random() * variants.length);
  return variants[index];
};

const AppBackground = () => {
  const { pathname } = useLocation();
  const primaryVariantRef = useRef(null);
  const softVariantRef = useRef(null);

  if (!primaryVariantRef.current) {
    primaryVariantRef.current = pickRandomVariant(
      VINTAGE_NEUBRUTAL_PATTERN_VARIANTS,
    );
  }

  if (!softVariantRef.current) {
    const alternatives = VINTAGE_NEUBRUTAL_PATTERN_VARIANTS.filter(
      (variant) => variant !== primaryVariantRef.current,
    );
    softVariantRef.current = pickRandomVariant(
      alternatives.length > 0
        ? alternatives
        : VINTAGE_NEUBRUTAL_PATTERN_VARIANTS,
    );
  }

  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return null;

  return (
    <div className="app-global-background" aria-hidden="true">
      <div className="app-global-gradient" />
      <PatternBackground
        className="app-global-pattern"
        variant={primaryVariantRef.current}
      />
      <PatternBackground
        className="app-global-pattern-soft"
        variant={softVariantRef.current}
        opacity={0.14}
      />
    </div>
  );
};

export default AppBackground;
