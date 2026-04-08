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
