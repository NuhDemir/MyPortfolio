import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const NaiveSketchPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.naiveSketch;

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

export const NaiveSketchPattern = memo(NaiveSketchPatternComponent);
