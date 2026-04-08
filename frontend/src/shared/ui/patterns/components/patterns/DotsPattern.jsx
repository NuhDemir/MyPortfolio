import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const DotsPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.dots;

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

export const DotsPattern = memo(DotsPatternComponent);
