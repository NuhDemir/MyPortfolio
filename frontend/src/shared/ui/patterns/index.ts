/**
 * Shared Patterns Library
 * Reusable pattern components for all cards
 */

// Main component
export { PatternBackground } from "./components/PatternBackground";

// Pattern presets
export {
  PATTERN_VARIANTS,
  VINTAGE_NEUBRUTAL_PATTERN_VARIANTS,
  PATTERN_PRESETS,
} from "./patternPresets.js";

// Types
export type {
    PatternType,
    PatternIntensity,
    PatternBackgroundProps,
    ColorScheme,
    PatternConfig,
} from "./types";

// Hooks
export { usePatternColors } from "./hooks/usePatternColors";

// Utils
export {
    getColorSchemeForTag,
    createGradientColors,
    getContrastColor,
} from "./utils/colorMapper";

export {
    selectPatternForTag,
    getPatternConfig,
    createPatternConfig,
} from "./utils/patternSelector";
