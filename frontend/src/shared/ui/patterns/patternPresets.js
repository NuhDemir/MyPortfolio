/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN PRESETS v2 — Soft monochromatic geometric backgrounds
   Colors derive from --ds-fg (#111111) at ultra-low opacity
   ═══════════════════════════════════════════════════════════════════════════ */

const svg2url = (s) =>
  `url("data:image/svg+xml,${s
    .trim()
    .replace(/\s+/g," ")
    .replace(/#/g,"%23")
    .replace(/</g,"%3C")
    .replace(/>/g,"%3E")
    .replace(/"/g,"'")}")`;

const FG = "#111111";
const FG_14 = "rgba(17,17,17,0.14)";
const FG_10 = "rgba(17,17,17,0.10)";
const FG_08 = "rgba(17,17,17,0.08)";
const FG_06 = "rgba(17,17,17,0.06)";
const FG_04 = "rgba(17,17,17,0.04)";

export const PATTERN_VARIANTS = ["grid","dots","lines","cross","hex","circle"];

export const VINTAGE_NEUBRUTAL_PATTERN_VARIANTS = ["grid","lines","dots"];

export const PATTERN_PRESETS = {

  /* ── Subtle Dotted Grid (Figma canvas feel) ─────────────────────────── */
  grid: {
    size: "32px 32px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="0.9" fill="${FG}" opacity="0.32"/></svg>`)
  },

  /* ── Sparse Scattered Dots ──────────────────────────────────────────── */
  dots: {
    size: "64px 64px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="16" cy="18" r="1.0" fill="${FG}" opacity="0.10"/><circle cx="48" cy="36" r="0.85" fill="${FG}" opacity="0.08"/><circle cx="32" cy="58" r="0.95" fill="${FG}" opacity="0.09"/></svg>`)
  },

  /* ── Fine Horizontal Lines ──────────────────────────────────────────── */
  lines: {
    size: "200px 20px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><line x1="0" y1="10" x2="200" y2="10" stroke="${FG}" stroke-width="0.5" opacity="0.07"/></svg>`)
  },

  /* ── Diagonal Cross Hatch ───────────────────────────────────────────── */
  cross: {
    size: "48px 48px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><line x1="0" y1="0" x2="48" y2="48" stroke="${FG}" stroke-width="0.4" opacity="0.07"/><line x1="48" y1="0" x2="0" y2="48" stroke="${FG}" stroke-width="0.4" opacity="0.07"/></svg>`)
  },

  /* ── Hexagonal Mesh ─────────────────────────────────────────────────── */
  hex: {
    size: "60px 52px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="52"><polygon points="15,13 30,5 45,13 45,29 30,37 15,29" fill="none" stroke="${FG}" stroke-width="0.55" opacity="0.09"/><polygon points="0,29 15,21 30,29 30,45 15,53 0,45" fill="none" stroke="${FG}" stroke-width="0.55" opacity="0.09"/><polygon points="60,29 45,21 30,29 30,45 45,53 60,45" fill="none" stroke="${FG}" stroke-width="0.55" opacity="0.09"/></svg>`)
  },

  /* ── Concentric Circles ─────────────────────────────────────────────── */
  circle: {
    size: "80px 80px",
    image: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="18" fill="none" stroke="${FG}" stroke-width="0.45" opacity="0.08"/><circle cx="40" cy="40" r="34" fill="none" stroke="${FG}" stroke-width="0.35" opacity="0.06"/></svg>`)
  },
};
