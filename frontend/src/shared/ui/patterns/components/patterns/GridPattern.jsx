import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const GridPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.grid;

  return (
    <div
      className={`pattern-surface ${className}`.trim()}
      style={{
        "--pattern-image": preset.image,
        "--pattern-size": preset.size,
        "--pattern-opacity": opacity,
      }}
      aria-hidden="true"
    />
  );
};

export const GridPattern = memo(GridPatternComponent);
