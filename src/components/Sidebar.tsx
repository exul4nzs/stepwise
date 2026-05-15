"use client";

import { C, glass } from "@/lib/tokens";
import { PAGES, type PageId, type UserProfile } from "@/lib/constants";

interface SidebarProps {
  page: PageId;
  setPage: (p: PageId) => void;
  user: UserProfile;
}

export default function Sidebar({ page, setPage, user }: SidebarProps) {
  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: 256,
        background: "rgba(6,13,8,0.96)",
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${C.border}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
      }}
    >
      {/* Brand */}
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.primaryDim}, ${C.primary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "#000",
              boxShadow: `0 0 20px ${C.primaryGlow}`,
            }}
          >
            S
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 15,
                color: C.primary,
                letterSpacing: "0.08em",
              }}
            >
              STEPWISE
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.textDim,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Engineering Review
            </div>
          </div>
        </div>
      </div>

      {/* User chip */}
      <div
        style={{
          margin: "0 16px 20px",
          padding: "12px 14px",
          ...glass,
          borderRadius: 12,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: C.textDim,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 4,
          }}
        >
          Commander
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>
          {user?.name || "Engineer"}
        </div>
        <div style={{ fontSize: 11, color: C.primary, marginTop: 2 }}>
          ● Protocol Active
        </div>
      </div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        {PAGES.map((p) => {
          const active = page === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setPage(p.id as PageId)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderRadius: 10,
                border: "none",
                background: active ? `rgba(52,211,102,0.10)` : "transparent",
                borderLeft: active
                  ? `3px solid ${C.primary}`
                  : "3px solid transparent",
                color: active ? C.primary : C.textMuted,
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                marginBottom: 2,
                transition: "all 0.15s",
                textAlign: "left",
                boxShadow: active
                  ? `inset 0 0 20px rgba(52,211,102,0.05)`
                  : "none",
              }}
            >
              <span style={{ fontSize: 18 }}>{p.icon}</span>
              {p.label}
            </button>
          );
        })}
      </nav>

    </aside>
  );
}
