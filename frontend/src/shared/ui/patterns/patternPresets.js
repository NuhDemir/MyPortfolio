/* ═══════════════════════════════════════════════════════════════════════════
   PATTERN PRESETS v5 — 21 Apple-professional patterns
   Mask-image based (theme-agnostic). SVGs use solid black → alpha mask.
   Color from CSS background-color via --ds-fg.
   ═══════════════════════════════════════════════════════════════════════════ */

const svg2url = (s) =>
  `url("data:image/svg+xml,${s
    .trim()
    .replace(/\s+/g," ")
    .replace(/#/g,"%23")
    .replace(/</g,"%3C")
    .replace(/>/g,"%3E")
    .replace(/"/g,"'")}")`;

const B = "#000";

export const PATTERN_VARIANTS = [
  "grid",
  "dots",
  "lines",
  "cross",
  "hex",
  "circle",
  "micro-dot",
  "diagonal",
  "gradient-mesh",
  "grid-fine",
  "noise",
  "dot-grid",
  "stripe-v",
  "chevron",
  "sine",
  "concentric",
  "triangles",
  "diamond",
  "dash",
  "plus",
  "orbit",
];

export const VINTAGE_NEUBRUTAL_PATTERN_VARIANTS = ["grid","lines","dots","micro-dot","grid-fine"];

export const PATTERN_PRESETS = {

  /* ── Subtle Dotted Grid (Figma canvas feel) ─────────────────────────── */
  grid: {
    size: "32px 32px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="0.9" fill="${B}"/></svg>`)
  },

  /* ── Sparse Scattered Dots ──────────────────────────────────────────── */
  dots: {
    size: "64px 64px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="16" cy="18" r="1.0" fill="${B}"/><circle cx="48" cy="36" r="0.85" fill="${B}"/><circle cx="32" cy="58" r="0.95" fill="${B}"/></svg>`)
  },

  /* ── Fine Horizontal Lines ──────────────────────────────────────────── */
  lines: {
    size: "200px 20px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><line x1="0" y1="10" x2="200" y2="10" stroke="${B}" stroke-width="0.5"/></svg>`)
  },

  /* ── Diagonal Cross Hatch ───────────────────────────────────────────── */
  cross: {
    size: "48px 48px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><line x1="0" y1="0" x2="48" y2="48" stroke="${B}" stroke-width="0.4"/><line x1="48" y1="0" x2="0" y2="48" stroke="${B}" stroke-width="0.4"/></svg>`)
  },

  /* ── Hexagonal Mesh ─────────────────────────────────────────────────── */
  hex: {
    size: "60px 52px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="60" height="52"><polygon points="15,13 30,5 45,13 45,29 30,37 15,29" fill="none" stroke="${B}" stroke-width="0.55"/><polygon points="0,29 15,21 30,29 30,45 15,53 0,45" fill="none" stroke="${B}" stroke-width="0.55"/><polygon points="60,29 45,21 30,29 30,45 45,53 60,45" fill="none" stroke="${B}" stroke-width="0.55"/></svg>`)
  },

  /* ── Concentric Circles ─────────────────────────────────────────────── */
  circle: {
    size: "80px 80px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><circle cx="40" cy="40" r="18" fill="none" stroke="${B}" stroke-width="0.45"/><circle cx="40" cy="40" r="34" fill="none" stroke="${B}" stroke-width="0.35"/></svg>`)
  },

  /* ── Micro Dot (Apple product page texture) ─────────────────────────── */
  "micro-dot": {
    size: "8px 8px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><circle cx="4" cy="4" r="0.3" fill="${B}"/></svg>`)
  },

  /* ── Diagonal (iOS Settings / Apple.com sections) ───────────────────── */
  diagonal: {
    size: "24px 24px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><line x1="0" y1="24" x2="24" y2="0" stroke="${B}" stroke-width="0.4"/></svg>`)
  },

  /* ── Gradient Mesh (overlapping soft ambient dots) ──────────────────── */
  "gradient-mesh": {
    size: "120px 120px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="30" cy="30" r="22" fill="${B}"/><circle cx="90" cy="90" r="22" fill="${B}"/><circle cx="60" cy="60" r="14" fill="${B}"/></svg>`)
  },

  /* ── Fine Grid (engineering / structured feel) ──────────────────────── */
  "grid-fine": {
    size: "16px 16px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect x="0" y="0" width="1" height="1" fill="${B}"/></svg>`)
  },

  /* ── Noise / Grain (film-like organic texture) ──────────────────────── */
  noise: {
    size: "64px 64px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="1" height="1" x="3" y="7" fill="${B}"/><rect width="1" height="1" x="12" y="3" fill="${B}"/><rect width="1" height="1" x="19" y="15" fill="${B}"/><rect width="1" height="1" x="27" y="8" fill="${B}"/><rect width="1" height="1" x="35" y="22" fill="${B}"/><rect width="1" height="1" x="44" y="5" fill="${B}"/><rect width="1" height="1" x="51" y="18" fill="${B}"/><rect width="1" height="1" x="8" y="28" fill="${B}"/><rect width="1" height="1" x="16" y="35" fill="${B}"/><rect width="1" height="1" x="25" y="42" fill="${B}"/><rect width="1" height="1" x="38" y="30" fill="${B}"/><rect width="1" height="1" x="47" y="39" fill="${B}"/><rect width="1" height="1" x="55" y="27" fill="${B}"/><rect width="1" height="1" x="6" y="48" fill="${B}"/><rect width="1" height="1" x="14" y="55" fill="${B}"/><rect width="1" height="1" x="30" y="50" fill="${B}"/><rect width="1" height="1" x="41" y="58" fill="${B}"/><rect width="1" height="1" x="58" y="48" fill="${B}"/><rect width="1" height="1" x="11" y="11" fill="${B}"/><rect width="1" height="1" x="33" y="33" fill="${B}"/><rect width="1" height="1" x="53" y="53" fill="${B}"/></svg>`)
  },

  /* ═══════════════════════════════════════════════════════════════════════
     10 NEW — Apple-professional patterns
     ═══════════════════════════════════════════════════════════════════════ */

  /* ── Dot Grid (macOS Sonoma wallpaper texture) ───────────────────────── */
  "dot-grid": {
    size: "20px 20px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="0.6" fill="${B}"/><circle cx="0" cy="0" r="0.6" fill="${B}"/><circle cx="20" cy="0" r="0.6" fill="${B}"/><circle cx="0" cy="20" r="0.6" fill="${B}"/><circle cx="20" cy="20" r="0.6" fill="${B}"/></svg>`)
  },

  /* ── Vertical Stripes (minimal partition lines) ─────────────────────── */
  "stripe-v": {
    size: "48px 100px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="100"><rect x="0" y="0" width="0.5" height="100" fill="${B}"/><rect x="24" y="0" width="0.5" height="100" fill="${B}"/></svg>`)
  },

  /* ── Chevron / Herringbone ──────────────────────────────────────────── */
  chevron: {
    size: "40px 32px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32"><polyline points="0,16 20,4 40,16" fill="none" stroke="${B}" stroke-width="0.5"/><polyline points="0,28 20,16 40,28" fill="none" stroke="${B}" stroke-width="0.35"/></svg>`)
  },

  /* ── Sine Wave ──────────────────────────────────────────────────────── */
  sine: {
    size: "80px 32px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="32"><path d="M0 16 Q20 4 40 16 Q60 28 80 16" fill="none" stroke="${B}" stroke-width="0.45"/></svg>`)
  },

  /* ── Concentric Rings ───────────────────────────────────────────────── */
  concentric: {
    size: "72px 72px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72"><circle cx="36" cy="36" r="8" fill="none" stroke="${B}" stroke-width="0.4"/><circle cx="36" cy="36" r="18" fill="none" stroke="${B}" stroke-width="0.3"/><circle cx="36" cy="36" r="28" fill="none" stroke="${B}" stroke-width="0.25"/></svg>`)
  },

  /* ── Triangular Tessellation ────────────────────────────────────────── */
  triangles: {
    size: "48px 42px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="42"><polygon points="12,4 24,21 0,21" fill="none" stroke="${B}" stroke-width="0.4"/><polygon points="36,4 48,21 24,21" fill="none" stroke="${B}" stroke-width="0.4"/><polygon points="24,38 36,21 12,21" fill="none" stroke="${B}" stroke-width="0.4"/></svg>`)
  },

  /* ── Diamond Grid ───────────────────────────────────────────────────── */
  diamond: {
    size: "36px 36px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36"><polygon points="18,2 34,18 18,34 2,18" fill="none" stroke="${B}" stroke-width="0.4"/></svg>`)
  },

  /* ── Dashed Rules (notebook / journal lines) ────────────────────────── */
  dash: {
    size: "200px 28px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="28"><line x1="0" y1="14" x2="60" y2="14" stroke="${B}" stroke-width="0.5"/><line x1="80" y1="14" x2="140" y2="14" stroke="${B}" stroke-width="0.5"/><line x1="160" y1="14" x2="200" y2="14" stroke="${B}" stroke-width="0.5"/></svg>`)
  },

  /* ── Plus Marks (medical / scientific precision) ────────────────────── */
  plus: {
    size: "28px 28px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><line x1="14" y1="6" x2="14" y2="22" stroke="${B}" stroke-width="0.5"/><line x1="6" y1="14" x2="22" y2="14" stroke="${B}" stroke-width="0.5"/></svg>`)
  },

  /* ── Orbital Rings ──────────────────────────────────────────────────── */
  orbit: {
    size: "90px 90px",
    mask: svg2url(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90"><ellipse cx="45" cy="45" rx="36" ry="14" fill="none" stroke="${B}" stroke-width="0.35" transform="rotate(-30 45 45)"/><ellipse cx="45" cy="45" rx="36" ry="14" fill="none" stroke="${B}" stroke-width="0.35" transform="rotate(30 45 45)"/><ellipse cx="45" cy="45" rx="36" ry="14" fill="none" stroke="${B}" stroke-width="0.35" transform="rotate(90 45 45)"/><circle cx="45" cy="45" r="4" fill="${B}" opacity="0.6"/></svg>`)
  },
};
