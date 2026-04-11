export const PATTERN_VARIANTS = [
  "grid",
  "dots",
  "mesh",
  "lines",
  "waves",
  "circles",
  "paper",
  "naiveSketch",
];

export const VINTAGE_NEUBRUTAL_PATTERN_VARIANTS = ["grid", "lines", "dots"];

// Encodes an SVG string for safe use inside a CSS url() value.
// Collapses whitespace, converts double quotes to single quotes,
// and percent-encodes the three characters that break CSS parsing.
const svg2url = (s) =>
  `url("data:image/svg+xml,${s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/#/g, "%23")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/"/g, "'")}")`;

// Palette pulled from global.css :root
// #36b069  --color-primary
// #248a4f  --color-primary-darker
// #8fd4ad  --color-accent
// #1d2f26  --color-text-primary (shadow/smudge)

export const PATTERN_PRESETS = {
  // ─── GRID ────────────────────────────────────────────────────────────────
  // Two wobbly intersecting lines with a pencil-smudge at the crossing.
  // Corners of the tile are invisible so the grid reads as hand-ruled.
  grid: {
    size: "44px 44px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">
        <path d="M22 -1 C21.3 8 22.7 14 21.6 22 C20.8 30 23 36 22 45"
          stroke="#36b069" stroke-width="1.9" fill="none" stroke-linecap="round"/>
        <path d="M-1 22 C8 22.6 14 21.1 22 22.4 C30 22.9 36 21.3 45 22"
          stroke="#36b069" stroke-width="1.6" fill="none" stroke-linecap="round"/>
        <path d="M20 20 Q22 21.5 24 20.5" stroke="#1d2f26"
          stroke-width="0.9" fill="none" opacity="0.22"/>
        <circle cx="22" cy="22" r="1.6" fill="#1d2f26" opacity="0.18"/>
      </svg>
    `),
  },

  // ─── DOTS ────────────────────────────────────────────────────────────────
  // Slightly squashed, off-center crayon blobs — no dot is a perfect circle.
  // A waxy pressure-stroke overlays each one.
  dots: {
    size: "28px 28px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <ellipse cx="13.5" cy="13" rx="3.4" ry="2.7"
          fill="#36b069" opacity="0.84"/>
        <path d="M11.2 12.2 Q13.5 11 16.2 12.8 Q14.2 15.2 11.2 14"
          stroke="#248a4f" stroke-width="0.7" fill="none" opacity="0.46"/>
        <ellipse cx="14.2" cy="12.5" rx="1.3" ry="0.9"
          fill="#8fd4ad" opacity="0.38"/>
      </svg>
    `),
  },

  // ─── MESH ────────────────────────────────────────────────────────────────
  // Horizontal wobbly lines crossed by diagonal pencil strokes —
  // the same cross-hatching an artist uses to shade a shadow area.
  mesh: {
    size: "56px 56px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56">
        <path d="M0 7 Q14 5.2 28 8 Q42 6.8 56 5.4"
          stroke="#36b069" stroke-width="1.4" fill="none" opacity="0.66"/>
        <path d="M0 21 Q12 19.4 28 22.2 Q40 20.8 56 19.5"
          stroke="#36b069" stroke-width="1.7" fill="none" opacity="0.62"/>
        <path d="M0 35 Q16 33.5 30 36.4 Q44 34.8 56 33.2"
          stroke="#36b069" stroke-width="1.2" fill="none" opacity="0.57"/>
        <path d="M0 49 Q14 47.4 28 50.2 Q42 48.6 56 47"
          stroke="#36b069" stroke-width="1.5" fill="none" opacity="0.62"/>
        <path d="M0 56 Q13 41 28 28 Q43 14 56 0"
          stroke="#248a4f" stroke-width="1.1" fill="none" opacity="0.44"/>
        <path d="M28 56 Q40 43 50 30 Q54 22 56 16"
          stroke="#248a4f" stroke-width="0.85" fill="none" opacity="0.37"/>
        <path d="M0 30 Q7 17 16 8 Q22 2 28 0"
          stroke="#248a4f" stroke-width="0.75" fill="none" opacity="0.32"/>
      </svg>
    `),
  },

  // ─── LINES ───────────────────────────────────────────────────────────────
  // Ruled-paper feel: one wobbly line per row, with a ghost pressure mark.
  // Start and end Y values are equal so horizontal tiles join seamlessly.
  lines: {
    size: "200px 18px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="18">
        <path d="M0 9 Q25 7.6 50 10.3 Q75 8.9 100 10 Q125 8.4 150 10.4 Q175 8.8 200 9"
          stroke="#36b069" stroke-width="1.9" fill="none" stroke-linecap="round"/>
        <path d="M8 9.6 Q28 8.6 52 10.6 Q62 10 70 9.4"
          stroke="#248a4f" stroke-width="0.65" fill="none" opacity="0.36"/>
      </svg>
    `),
  },

  // ─── WAVES ───────────────────────────────────────────────────────────────
  // Hand-drawn sine wave. Stroke weight suggests the pen slowed at peaks.
  // A lighter ghost arc highlights the leading crest.
  waves: {
    size: "88px 32px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="88" height="32">
        <path d="M0 16 Q11 4.5 22 16 Q33 27.5 44 16 Q55 4.5 66 16 Q77 27.5 88 16"
          stroke="#36b069" stroke-width="2.4"
          fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2 17.5 Q13 7.5 24 17.5"
          stroke="#248a4f" stroke-width="0.85" fill="none" opacity="0.44"/>
        <path d="M46 14.5 Q57 5 68 14.5"
          stroke="#8fd4ad" stroke-width="0.6" fill="none" opacity="0.38"/>
      </svg>
    `),
  },

  // ─── CIRCLES ─────────────────────────────────────────────────────────────
  // Each circle is drawn as a single open path — the tiny gap at the top
  // shows the pen lifted before the stroke was finished.
  // An inner arc echoes the outer line like a quick sketch note.
  circles: {
    size: "70px 70px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70">
        <path d="M38 8 C56 6.8 64.5 20 64.5 35 C64.5 52 52 63.5 35 64.5 C18 65.5 6.8 53 6.8 35 C6.5 18 18 7 34 7.8"
          stroke="#36b069" stroke-width="2.3" fill="none" stroke-linecap="round"/>
        <path d="M35 14 C49 12.8 58 22.5 58 35"
          stroke="#248a4f" stroke-width="0.95"
          fill="none" opacity="0.4" stroke-linecap="round"/>
        <path d="M36 8 Q37 7.4 38.5 7.8"
          stroke="#36b069" stroke-width="0.8" fill="none" opacity="0.55"/>
      </svg>
    `),
  },

  // ─── PAPER ───────────────────────────────────────────────────────────────
  // Subtle paper grain with faint folded fibers.
  paper: {
    size: "220px 220px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">
        <rect width="220" height="220" fill="#ffffff" fill-opacity="0"/>
        <path d="M0 48 Q56 36 108 50 Q164 62 220 46"
          stroke="#248a4f" stroke-width="0.7" fill="none" opacity="0.18"/>
        <path d="M0 126 Q62 110 108 122 Q162 136 220 120"
          stroke="#248a4f" stroke-width="0.65" fill="none" opacity="0.14"/>
        <path d="M0 190 Q54 176 114 188 Q164 198 220 184"
          stroke="#8fd4ad" stroke-width="0.55" fill="none" opacity="0.16"/>
        <circle cx="32" cy="26" r="1" fill="#1d2f26" opacity="0.16"/>
        <circle cx="86" cy="64" r="0.95" fill="#1d2f26" opacity="0.13"/>
        <circle cx="152" cy="40" r="0.85" fill="#1d2f26" opacity="0.12"/>
        <circle cx="198" cy="78" r="1.1" fill="#1d2f26" opacity="0.14"/>
        <circle cx="50" cy="114" r="0.95" fill="#1d2f26" opacity="0.1"/>
        <circle cx="124" cy="146" r="1.05" fill="#1d2f26" opacity="0.12"/>
        <circle cx="178" cy="132" r="0.9" fill="#1d2f26" opacity="0.11"/>
        <circle cx="24" cy="180" r="1.1" fill="#1d2f26" opacity="0.1"/>
        <circle cx="102" cy="202" r="0.95" fill="#1d2f26" opacity="0.11"/>
        <circle cx="186" cy="196" r="0.9" fill="#1d2f26" opacity="0.13"/>
      </svg>
    `),
  },

  // ─── NAIVE SKETCH ────────────────────────────────────────────────────────
  // Floating doodle elements scattered across a large tile:
  //   • a wobbly five-pointed star (top-left quadrant)
  //   • a loose dot cluster (top-right)
  //   • a squiggly accent line (bottom-centre)
  //   • a hand-drawn plus mark (bottom-left)
  //   • a tiny secondary star (bottom-right)
  naiveSketch: {
    size: "120px 120px",
    image: svg2url(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
        <path d="M30 10 L32 21.5 L42.5 19.5 L35 27.5 L38.5 38.5 L30 32.5 L21.5 38.5 L25 27.5 L17.5 19.5 L28 21.5 Z"
          stroke="#36b069" stroke-width="1.85" fill="none" stroke-linejoin="round"/>
        <circle cx="82" cy="35" r="3.3" fill="#36b069" opacity="0.56"/>
        <circle cx="91" cy="29" r="2.0" fill="#8fd4ad" opacity="0.74"/>
        <circle cx="76" cy="44" r="2.2" fill="#36b069" opacity="0.46"/>
        <circle cx="88" cy="43" r="1.2" fill="#248a4f" opacity="0.35"/>
        <path d="M50 74 Q59 64.5 68 74 Q77 83.5 86 74 Q95 64.5 102 74"
          stroke="#36b069" stroke-width="2.0"
          fill="none" stroke-linecap="round"/>
        <line x1="16" y1="80" x2="16" y2="95"
          stroke="#248a4f" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="8.5" y1="87.5" x2="23.5" y2="87.5"
          stroke="#248a4f" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M96 90 L97.8 95.5 L103 94 L99 97.8 L101 103 L96 99.5 L91 103 L93 97.8 L89 94 L94.2 95.5 Z"
          stroke="#8fd4ad" stroke-width="1.4" fill="none" opacity="0.78"/>
      </svg>
    `),
  },
};
