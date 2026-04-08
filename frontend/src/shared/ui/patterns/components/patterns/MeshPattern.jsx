import { memo } from "react";
import { PATTERN_PRESETS } from "../../patternPresets.js";

const MeshPatternComponent = ({ className = "", opacity = 0.22 }) => {
  const preset = PATTERN_PRESETS.mesh;

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

export const MeshPattern = memo(MeshPatternComponent);
