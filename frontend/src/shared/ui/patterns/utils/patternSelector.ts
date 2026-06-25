import { PATTERN_VARIANTS } from "../patternPresets";
import type { PatternType, PatternConfig } from "../types";

const hashString = (input = "") => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const clampIndex = (value: number) => value % PATTERN_VARIANTS.length;

export const selectRandomPattern = (seed = ""): PatternType => {
  const safeSeed = seed || "default";
  const index = clampIndex(hashString(safeSeed));
  return PATTERN_VARIANTS[index] as PatternType;
};

export const selectPatternForRoute = (pathname = "/") => {
  return selectRandomPattern(pathname);
};

/**
 * Pattern Selector Utility (Shared)
 * Selects appropriate pattern based on content category
 */

const PATTERN_KEYWORDS: Record<PatternType, string[]> = {
  dots: ["tech", "data", "ai", "ml", "analytics", "digital"],
  lines: ["business", "strategy", "management", "leadership", "finance"],
  grid: ["engineering", "architecture", "system", "infrastructure", "backend"],
  waves: ["creative", "design", "ux", "ui", "frontend", "art"],
  circles: ["experience", "journey", "roadmap", "progress", "learning"],
  mesh: ["general", "other", "misc", "default"],
  naiveSketch: ["naive", "draw", "handmade", "music", "sketch"],
  "micro-dot": ["apple", "soft", "minimal", "clean", "product", "premium"],
  diagonal: ["motion", "dynamic", "speed", "fast", "agile"],
  "gradient-mesh": ["ambient", "atmosphere", "depth", "organic", "fluid"],
  "grid-fine": ["precision", "detail", "technical", "accurate", "blueprint"],
  noise: ["texture", "film", "grain", "vintage", "photography", "analog"],
  "dot-grid": ["macos", "sonoma", "wallpaper", "retina", "display", "screen"],
  "stripe-v": ["column", "vertical", "partition", "divide", "section"],
  chevron: ["herringbone", "zigzag", "woven", "fabric", "textile"],
  sine: ["waveform", "audio", "sound", "frequency", "signal", "rhythm"],
  concentric: ["target", "focus", "bullseye", "radar", "scope"],
  triangles: ["geometry", "polygon", "math", "crystal", "facet"],
  diamond: ["gem", "luxury", "premium", "crystal", "elite", "high-end"],
  dash: ["notebook", "journal", "rule", "writing", "note", "paper"],
  plus: ["medical", "health", "science", "cross", "add", "hospital"],
  orbit: ["space", "cosmic", "atom", "solar", "planetary", "universe"],
};

const PATTERN_CONFIGS: Record<PatternType, PatternConfig> = {
  dots: {
    type: "dots",
    density: 40,
    opacity: 0.15,
    animated: true,
  },
  lines: {
    type: "lines",
    density: 20,
    opacity: 0.12,
    animated: false,
  },
  grid: {
    type: "grid",
    density: 15,
    opacity: 0.1,
    animated: false,
  },
  waves: {
    type: "waves",
    density: 8,
    opacity: 0.18,
    animated: true,
  },
  circles: {
    type: "circles",
    density: 6,
    opacity: 0.15,
    animated: true,
  },
  mesh: {
    type: "mesh",
    density: 3,
    opacity: 0.25,
    animated: true,
  },
  naiveSketch: {
    type: "naiveSketch",
    density: 9,
    opacity: 0.2,
    animated: false,
  },
  "micro-dot": {
    type: "micro-dot",
    density: 20,
    opacity: 0.18,
    animated: false,
  },
  diagonal: {
    type: "diagonal",
    density: 12,
    opacity: 0.1,
    animated: false,
  },
  "gradient-mesh": {
    type: "gradient-mesh",
    density: 4,
    opacity: 0.22,
    animated: true,
  },
  "grid-fine": {
    type: "grid-fine",
    density: 10,
    opacity: 0.12,
    animated: false,
  },
  noise: {
    type: "noise",
    density: 5,
    opacity: 0.15,
    animated: false,
  },
  "dot-grid": {
    type: "dot-grid",
    density: 18,
    opacity: 0.14,
    animated: false,
  },
  "stripe-v": {
    type: "stripe-v",
    density: 8,
    opacity: 0.08,
    animated: false,
  },
  chevron: {
    type: "chevron",
    density: 12,
    opacity: 0.12,
    animated: false,
  },
  sine: {
    type: "sine",
    density: 6,
    opacity: 0.16,
    animated: true,
  },
  concentric: {
    type: "concentric",
    density: 5,
    opacity: 0.14,
    animated: true,
  },
  triangles: {
    type: "triangles",
    density: 10,
    opacity: 0.12,
    animated: false,
  },
  diamond: {
    type: "diamond",
    density: 14,
    opacity: 0.13,
    animated: false,
  },
  dash: {
    type: "dash",
    density: 8,
    opacity: 0.1,
    animated: false,
  },
  plus: {
    type: "plus",
    density: 16,
    opacity: 0.12,
    animated: false,
  },
  orbit: {
    type: "orbit",
    density: 4,
    opacity: 0.16,
    animated: true,
  },
};

export const selectPatternForTag = (
  label: string,
  category?: string,
): PatternType => {
  const searchText = `${label} ${category || ""}`.toLowerCase();

  for (const [patternType, keywords] of Object.entries(PATTERN_KEYWORDS)) {
    if (keywords.some((keyword) => searchText.includes(keyword))) {
      return patternType as PatternType;
    }
  }

  return "mesh";
};

export const getPatternConfig = (patternType: PatternType): PatternConfig => {
  return PATTERN_CONFIGS[patternType];
};

export const createPatternConfig = (
  patternType: PatternType,
  overrides?: Partial<PatternConfig>,
): PatternConfig => {
  return {
    ...PATTERN_CONFIGS[patternType],
    ...overrides,
  };
};
