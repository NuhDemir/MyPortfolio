import { memo, useMemo } from "react";
import { PATTERN_PRESETS } from "../patternPresets.js";
import { GridPattern } from "./patterns/GridPattern.jsx";
import { DotsPattern } from "./patterns/DotsPattern.jsx";
import { MeshPattern } from "./patterns/MeshPattern.jsx";
import { LinesPattern } from "./patterns/LinesPattern.jsx";
import { WavesPattern } from "./patterns/WavesPattern.jsx";
import { CirclesPattern } from "./patterns/CirclesPattern.jsx";
import "./PatternBackground.css";

const PATTERN_KEYS = Object.keys(PATTERN_PRESETS);
const PATTERN_COMPONENTS = {
  grid: GridPattern,
  dots: DotsPattern,
  mesh: MeshPattern,
  lines: LinesPattern,
  waves: WavesPattern,
  circles: CirclesPattern,
};

const hashString = (input = "") => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const PatternBackgroundComponent = ({
  variant = "random",
  opacity = 0.24,
  className = "",
  seed = "",
}) => {
  const resolvedVariant = useMemo(() => {
    if (variant !== "random") {
      return PATTERN_PRESETS[variant] ? variant : "grid";
    }

    const index =
      hashString(seed || window.location.pathname) % PATTERN_KEYS.length;
    return PATTERN_KEYS[index];
  }, [seed, variant]);

  const PatternComponent = PATTERN_COMPONENTS[resolvedVariant] ?? GridPattern;

  return (
    <PatternComponent
      className={`pattern-surface--${resolvedVariant} ${className}`.trim()}
      opacity={opacity}
    />
  );
};

export const PatternBackground = memo(PatternBackgroundComponent);

export default PatternBackground;
