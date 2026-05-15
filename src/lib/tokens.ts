// ─── DARK EMERALD DESIGN TOKENS ───────────────────────────────────────────
// Deep forest green palette — premium, dark, distinctly green
// No yellow-green / "vomit" tones — pure emerald & forest

export const C = {
  // Backgrounds (darkest → lightest)
  bg:        "#060d08",
  bgCard:    "rgba(10,22,14,0.82)",
  bgHigh:    "#0c1a10",
  bgHigher:  "#122516",
  bgHighest: "#1a3322",

  // Borders
  border:       "rgba(40,75,50,0.45)",
  borderBright: "rgba(52,211,102,0.28)",

  // Text
  text:      "#e2f0e6",
  textMuted: "#a8c4af",
  textDim:   "#5e8268",

  // Primary emerald
  primary:     "#34d366",
  primaryDim:  "#22a74f",
  primaryDeep: "#08301a",
  primaryGlow: "rgba(52,211,102,0.35)",

  // Secondary accents
  gold:     "#fbbf24",
  goldGlow: "rgba(251,191,36,0.30)",
  error:    "#f87171",
} as const;

// Shared style objects
export const glass = {
  background: C.bgCard,
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: `1px solid ${C.border}`,
  borderRadius: 16,
};

export const neonGreen = { boxShadow: `0 0 18px ${C.primaryGlow}` };
export const neonGold  = { boxShadow: `0 0 18px ${C.goldGlow}` };
