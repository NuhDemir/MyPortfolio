import { memo, useMemo } from "react";
import { PATTERN_PRESETS } from "../patternPresets.js";
import "./PatternBackground.css";

const PATTERN_KEYS = Object.keys(PATTERN_PRESETS);

const hashString = (input = "") => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pickRandomPreset = () => {
  const idx = Math.floor(Math.random() * PATTERN_KEYS.length);
  return PATTERN_PRESETS[PATTERN_KEYS[idx]];
};

const PatternBackgroundComponent = ({ variant = "random", opacity = 0.15, className = "", seed = "" }) => {
  const preset = useMemo(() => {
    if (variant === "random") {
      return seed
        ? PATTERN_PRESETS[PATTERN_KEYS[hashString(seed) % PATTERN_KEYS.length]]
        : pickRandomPreset();
    }
    return PATTERN_PRESETS[variant] ?? PATTERN_PRESETS.grid;
  }, [seed, variant]);

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

export const PatternBackground = memo(PatternBackgroundComponent);
export default PatternBackground;