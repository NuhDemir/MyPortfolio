import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const PaperPatternComponent = ({ className = "", opacity = 0.18 }) => {
  const preset = PATTERN_PRESETS.paper;
  const linePreset = PATTERN_PRESETS.lines;
  const hatchPreset = PATTERN_PRESETS.mesh;
  const doodlePreset = PATTERN_PRESETS.naiveSketch;

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <div
        className="pattern-surface pattern-surface--paper-base"
        style={{
          "--pattern-image": preset.image,
          "--pattern-size": preset.size,
          "--pattern-opacity": opacity,
          transform: "rotate(-0.45deg) scale(1.03)",
          transformOrigin: "50% 50%",
          backgroundPosition: "-12px 8px",
        }}
      />

      <div
        className="pattern-surface pattern-surface--paper-sketch"
        style={{
          "--pattern-image": linePreset.image,
          "--pattern-size": "210px 22px",
          "--pattern-opacity": opacity * 0.42,
          transform: "rotate(0.35deg)",
          backgroundPosition: "16px 10px",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="pattern-surface pattern-surface--paper-hatch"
        style={{
          "--pattern-image": hatchPreset.image,
          "--pattern-size": "72px 72px",
          "--pattern-opacity": opacity * 0.3,
          backgroundPosition: "4px -8px",
          mixBlendMode: "multiply",
        }}
      />

      <div
        className="pattern-surface pattern-surface--paper-doodle"
        style={{
          "--pattern-image": doodlePreset.image,
          "--pattern-size": "170px 170px",
          "--pattern-opacity": opacity * 0.34,
          transform: "rotate(-0.2deg)",
          backgroundPosition: "-18px 22px",
        }}
      />
    </div>
  );
};

export const PaperPattern = memo(PaperPatternComponent);
