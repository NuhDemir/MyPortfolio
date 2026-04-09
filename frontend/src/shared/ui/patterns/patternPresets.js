export const PATTERN_VARIANTS = [
  "grid",
  "dots",
  "mesh",
  "lines",
  "waves",
  "circles",
  "naiveSketch",
];

export const VINTAGE_NEUBRUTAL_PATTERN_VARIANTS = ["grid", "lines", "dots"];

export const PATTERN_PRESETS = {
  grid: {
    size: "28px 28px",
    image:
      "linear-gradient(90deg, var(--pattern-color) 1px, transparent 1px), linear-gradient(0deg, var(--pattern-color) 1px, transparent 1px)",
  },
  dots: {
    size: "22px 22px",
    image:
      "radial-gradient(circle, var(--pattern-color) 1.4px, transparent 1.4px)",
  },
  mesh: {
    size: "40px 40px",
    image:
      "linear-gradient(135deg, color-mix(in srgb, var(--pattern-color) 65%, transparent) 25%, transparent 25%), linear-gradient(225deg, color-mix(in srgb, var(--pattern-color) 45%, transparent) 25%, transparent 25%)",
  },
  lines: {
    size: "100% 14px",
    image:
      "repeating-linear-gradient(0deg, var(--pattern-color), var(--pattern-color) 1px, transparent 1px, transparent 14px)",
  },
  waves: {
    size: "64px 20px",
    image:
      "radial-gradient(circle at 50% 18px, transparent 12px, var(--pattern-color) 13px, transparent 14px)",
  },
  circles: {
    size: "68px 68px",
    image:
      "radial-gradient(circle at 34px 34px, transparent 17px, var(--pattern-color) 18px, transparent 19px)",
  },
  naiveSketch: {
    size: "120px 120px, 64px 64px, 88px 88px",
    image:
      "repeating-linear-gradient(12deg, transparent 0 16px, color-mix(in srgb, var(--pattern-color) 58%, transparent) 16px 18px, transparent 18px 30px), radial-gradient(circle at 12px 14px, color-mix(in srgb, var(--pattern-color) 55%, transparent) 1.8px, transparent 2px), radial-gradient(circle at 56px 58px, color-mix(in srgb, var(--pattern-color) 45%, transparent) 2.2px, transparent 2.5px)",
  },
};
