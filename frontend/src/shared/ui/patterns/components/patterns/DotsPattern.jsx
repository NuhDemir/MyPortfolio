import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const DotsPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.dots;

  return (
    <div
      className={`ds-pattern ${className}`.trim()}
      aria-hidden="true"
      style={{
        maskImage: preset.mask,
        WebkitMaskImage: preset.mask,
        maskSize: preset.size,
        WebkitMaskSize: preset.size,
        maskRepeat: "repeat",
        WebkitMaskRepeat: "repeat",
        opacity,
      }}
    />
  );
};

export const DotsPattern = memo(DotsPatternComponent);