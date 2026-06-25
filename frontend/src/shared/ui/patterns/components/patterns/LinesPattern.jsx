import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const LinesPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.lines;

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

export const LinesPattern = memo(LinesPatternComponent);