"use client";

import { useState } from "react";
import { C, glass, neonGreen } from "@/lib/tokens";
import { SUBJECTS, type UserProfile } from "@/lib/constants";

interface OnboardingProps {
  onDone: (user: UserProfile) => void;
}

export default function Onboarding({ onDone }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [isFamiliar, setIsFamiliar] = useState<boolean | null>(null);
  const [weak, setWeak] = useState<string[]>([]);
  const [name, setName] = useState("");

  const toggleSubject = (s: string) =>
    setWeak((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  const finish = () => {
    onDone({ name: name || "Engineer", isFamiliar, weakSubjects: weak });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 540 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: 36,
              color: C.primary,
              letterSpacing: "-0.02em",
              textShadow: `0 0 30px ${C.primaryGlow}`,
            }}
          >
            STEPWISE
          </div>
          <div
            style={{
              fontSize: 14,
              color: C.textDim,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: 4,
            }}
          >
            Adaptive Engineering Review
          </div>
        </div>

        <div
          style={{ ...glass, padding: "36px 32px", borderRadius: 20 }}
          className="animate-fade-in"
        >
          {/* Step 1 — Name */}
          {step === 0 && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: C.primary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Step 1 of 3
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 24,
                }}
              >
                What&apos;s your callsign?
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  color: C.text,
                  fontSize: 15,
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = C.primary)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = C.border)
                }
              />
              <button
                onClick={() => setStep(1)}
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: "14px",
                  background: C.primary,
                  color: C.primaryDeep,
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  ...neonGreen,
                  fontFamily: "var(--font-sans)",
                }}
              >
                CONTINUE →
              </button>
            </div>
          )}

          {/* Step 2 — Familiarity */}
          {step === 1 && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: C.primary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Step 2 of 3
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                Are you currently taking these subjects?
              </div>
              <div
                style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}
              >
                Differential Equations · Data Analysis · Circuits
              </div>
              {[
                {
                  val: true,
                  label: "Yes, I'm already taking them",
                  desc: "I'll mark my hard spots",
                },
                {
                  val: false,
                  label: "No, some are new to me",
                  desc: "I'll start from fundamentals",
                },
              ].map((opt) => (
                <button
                  key={String(opt.val)}
                  onClick={() => {
                    setIsFamiliar(opt.val);
                    setStep(2);
                  }}
                  style={{
                    width: "100%",
                    marginBottom: 12,
                    padding: "18px 20px",
                    textAlign: "left",
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${C.border}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    color: C.text,
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.primary;
                    e.currentTarget.style.background =
                      "rgba(52,211,102,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background =
                      "rgba(255,255,255,0.03)";
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    {opt.label}
                  </div>
                  <div
                    style={{ fontSize: 12, color: C.textDim, marginTop: 4 }}
                  >
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 3 — Weak subjects */}
          {step === 2 && (
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: C.primary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Step 3 of 3
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 8,
                }}
              >
                {isFamiliar
                  ? "Which subjects give you trouble?"
                  : "Which subjects are new to you?"}
              </div>
              <div
                style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}
              >
                Select all that apply
              </div>
              {SUBJECTS.map((s) => {
                const sel = weak.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSubject(s)}
                    style={{
                      width: "100%",
                      marginBottom: 10,
                      padding: "16px 20px",
                      textAlign: "left",
                      background: sel
                        ? "rgba(52,211,102,0.08)"
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${sel ? C.primary : C.border}`,
                      borderRadius: 12,
                      cursor: "pointer",
                      color: sel ? C.primary : C.text,
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      boxShadow: sel ? neonGreen.boxShadow : "none",
                      transition: "all 0.2s",
                    }}
                  >
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        border: `2px solid ${sel ? C.primary : C.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {sel ? "✓" : ""}
                    </span>
                    {s}
                  </button>
                );
              })}
              <button
                onClick={finish}
                style={{
                  marginTop: 8,
                  width: "100%",
                  padding: "14px",
                  background: C.primary,
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  ...neonGreen,
                  fontFamily: "var(--font-sans)",
                }}
              >
                LAUNCH MISSION ⚡
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
