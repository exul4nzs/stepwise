"use client";

import { C, glass, neonGreen } from "@/lib/tokens";
import {
  SUBJECTS,
  PROGRESS_DATA,
  type UserProfile,
  type PageId,
} from "@/lib/constants";

/* ─── Circle Progress ──────────────────────────────────────────────────── */
function CircleProgress({
  pct,
  color,
  size = 52,
}: {
  pct: number;
  color: string;
  size?: number;
}) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={C.bgHighest}
        strokeWidth={5}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={10}
        fontWeight="700"
        style={{
          transform: "rotate(90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

/* ─── Dashboard ────────────────────────────────────────────────────────── */
interface DashboardProps {
  user: UserProfile;
  setPage: (p: PageId) => void;
}

export default function Dashboard({ user, setPage }: DashboardProps) {
  const weak = user?.weakSubjects || [];
  const recommend =
    SUBJECTS.filter((s) => weak.includes(s))[0] || SUBJECTS[0];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Hero */}
      <div
        style={{
          ...glass,
          padding: "32px 36px",
          borderRadius: 20,
          marginBottom: 24,
          borderLeft: `4px solid ${C.primary}`,
          position: "relative",
          overflow: "hidden",
        }}
        className="animate-fade-in"
      >
        <div
          style={{
            position: "absolute",
            right: -60,
            bottom: -60,
            width: 300,
            height: 300,
            background: `radial-gradient(${C.primary}15, transparent 70%)`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: 11,
              color: C.primary,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 10,
              background: "rgba(52,211,102,0.1)",
              display: "inline-block",
              padding: "4px 10px",
              borderRadius: 6,
            }}
          >
            Critical Mission
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 32,
              color: "#fff",
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            {recommend}
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textMuted,
              marginBottom: 24,
              maxWidth: 520,
            }}
          >
            {weak.length
              ? "Flagged as a weak area. Adaptive system has prioritized this module for your session."
              : "Recommended based on your progression. Continue your momentum."}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setPage("lesson")}
              style={{
                padding: "12px 24px",
                background: C.primary,
                color: "#000",
                border: "none",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                ...neonGreen,
                letterSpacing: "0.04em",
              }}
            >
              ▶ START LESSON
            </button>
            <button
              onClick={() => setPage("arena")}
              style={{
                padding: "12px 24px",
                background: "transparent",
                color: C.primary,
                border: `1px solid ${C.primary}`,
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              ⚡ ENTER ARENA
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Progress */}
        <div style={{ ...glass, padding: "24px 28px", borderRadius: 16 }}>
          <div
            style={{
              fontSize: 11,
              color: C.primary,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            Core Progression
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            {PROGRESS_DATA.map((d) => (
              <div
                key={d.subject}
                style={{ display: "flex", alignItems: "center", gap: 16 }}
              >
                <CircleProgress pct={d.pct} color={d.color} />
                <div>
                  <div
                    style={{ fontWeight: 700, fontSize: 14, color: C.text }}
                  >
                    {d.subject}
                  </div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>
                    {d.topic}
                  </div>
                  {weak.includes(d.subject) && (
                    <div
                      style={{
                        fontSize: 11,
                        color: C.error,
                        marginTop: 2,
                      }}
                    >
                      ● Weak area flagged
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ ...glass, padding: "24px", borderRadius: 16 }}>
          <div
            style={{
              fontSize: 11,
              color: C.gold,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              marginBottom: 20,
            }}
          >
            Arena Standings
          </div>
          {[
            { rank: "01", name: "Pilot_X", xp: "12.4k", gold: true },
            { rank: "02", name: "Arch_9", xp: "11.1k", gold: false },
            { rank: "08", name: "YOU", xp: "8.2k", you: true },
          ].map((e) => (
            <div
              key={e.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                marginBottom: 8,
                background: e.you
                  ? "rgba(52,211,102,0.07)"
                  : e.gold
                  ? "rgba(251,191,36,0.07)"
                  : "transparent",
                borderLeft: e.you
                  ? `2px solid ${C.primary}`
                  : e.gold
                  ? `2px solid ${C.gold}`
                  : "2px solid transparent",
              }}
            >
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 13,
                  color: e.you ? C.primary : e.gold ? C.gold : C.textDim,
                  width: 24,
                }}
              >
                {e.rank}
              </span>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: C.bgHighest,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  color: C.textMuted,
                }}
              >
                {e.name[0]}
              </div>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontWeight: 700,
                  color: e.you ? C.primary : C.text,
                }}
              >
                {e.name}
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: e.you ? C.primary : C.textMuted,
                }}
              >
                {e.xp}
              </span>
            </div>
          ))}
          <button
            style={{
              width: "100%",
              marginTop: 8,
              padding: "8px",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              color: C.textDim,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            View Full Board
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {[
          {
            icon: "◈",
            label: "Lessons",
            desc: "Browse all modules",
            page: "lesson" as PageId,
            color: C.primary,
          },
          {
            icon: "⚡",
            label: "Arena",
            desc: "Quiz battles & problems",
            page: "arena" as PageId,
            color: C.gold,
          },
          {
            icon: "◎",
            label: "Companion",
            desc: "AI tutor chat",
            page: "companion" as PageId,
            color: "#60a5fa",
          },
        ].map((a) => (
          <button
            key={a.page}
            onClick={() => setPage(a.page)}
            style={{
              ...glass,
              padding: "20px",
              borderRadius: 14,
              cursor: "pointer",
              border: `1px solid ${C.border}`,
              textAlign: "left",
              fontFamily: "var(--font-sans)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = a.color;
              e.currentTarget.style.boxShadow = `0 0 20px ${a.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = C.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 8, color: a.color }}>
              {a.icon}
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
              {a.label}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              {a.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
