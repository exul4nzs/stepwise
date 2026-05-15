"use client";

import { C } from "@/lib/tokens";

interface TopBarProps {
  subtitle?: string;
}

export default function TopBar({ subtitle }: TopBarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(6,13,8,0.88)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 50,
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            fontSize: 22,
            color: C.primary,
            letterSpacing: "-0.02em",
            textShadow: `0 0 20px rgba(52,211,102,0.4)`,
          }}
        >
          MISSION CONTROL
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["🔔", "⚙"].map((ic) => (
          <button
            key={ic}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              width: 36,
              height: 36,
              color: C.textMuted,
              cursor: "pointer",
              fontSize: 15,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {ic}
          </button>
        ))}
      </div>
    </header>
  );
}
