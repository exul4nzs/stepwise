"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { C, glass, neonGreen } from "@/lib/tokens";

interface AuthProps {
  onSession: (session: any) => void;
}

export default function Auth({ onSession }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    const { data, error } = mode === "login" 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    console.log("Auth Response:", { data, error });

    if (error) {
      alert("⚠️ Auth Error: " + error.message);
    } else if (data.session) {
      onSession(data.session);
    } else if (data.user && mode === "signup") {
      setShowSuccess(true);
    } else {
      alert("⚠️ Session not established. Try refreshing the page.");
    }
    setLoading(false);
  };

  if (showSuccess) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ ...glass, maxWidth: 400, padding: 40, borderRadius: 24, textAlign: "center", border: `1px solid ${C.primary}33` }}>
          <div style={{ fontSize: 40, marginBottom: 20 }}>✉️</div>
          <h2 style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, marginBottom: 12 }}>MISSION PENDING</h2>
          <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            Verification email sent to <strong style={{ color: C.primary }}>{email}</strong>. 
            Please check your inbox to activate your profile.
          </p>
          <div style={{ padding: 16, background: "rgba(52,211,102,0.05)", borderRadius: 12, border: `1px solid ${C.primary}22`, textAlign: "left", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 800, marginBottom: 4 }}>DEVELOPER TIP:</div>
            <div style={{ fontSize: 11, color: C.textDim }}>
              To bypass this during development, go to <strong>Supabase &gt; Auth &gt; Providers &gt; Email</strong> and disable "Confirm email".
            </div>
          </div>
          <button 
            onClick={() => setShowSuccess(false)}
            style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.textDim, padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 13 }}
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: C.bg, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Glow */}
      <div style={{ 
        position: "absolute", 
        width: 600, 
        height: 600, 
        background: `radial-gradient(${C.primary}10, transparent 70%)`,
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none"
      }} />

      <div style={{ 
        ...glass, 
        width: "100%", 
        maxWidth: 400, 
        padding: "40px", 
        borderRadius: 24, 
        border: `1px solid ${C.border}`,
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ 
            position: "relative",
            width: 48,
            height: 48,
            margin: "0 auto 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            userSelect: "none"
          }}>
            <div style={{ 
              position: "absolute",
              fontSize: 52,
              fontWeight: 900,
              fontStyle: "italic",
              color: "transparent",
              WebkitTextStroke: `2px ${C.primary}33`,
              fontFamily: "var(--font-display)",
              zIndex: 1
            }}>S</div>
            <div style={{ 
              position: "absolute",
              fontSize: 48,
              fontWeight: 900,
              fontStyle: "italic",
              color: "transparent",
              WebkitTextStroke: `1.5px ${C.primary}`,
              fontFamily: "var(--font-display)",
              filter: `drop-shadow(0 0 8px ${C.primaryGlow})`,
              zIndex: 2
            }}>S</div>
          </div>
          <h1 style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: 24, 
            fontWeight: 900, 
            color: "#fff",
            letterSpacing: "0.05em"
          }}>STEPWISE</h1>
          <p style={{ fontSize: 13, color: C.textDim, marginTop: 4 }}>
            {mode === "login" ? "Welcome back, Commander." : "Initialize your cadet profile."}
          </p>
        </div>

        <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: C.primary, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="engineer@stepwise.edu"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                color: C.text,
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: C.primary, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                color: C.text,
                fontSize: 14,
                fontFamily: "var(--font-sans)",
                outline: "none"
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: C.primary,
              color: "#000",
              border: "none",
              borderRadius: 12,
              fontWeight: 800,
              fontSize: 14,
              cursor: "pointer",
              marginTop: 8,
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.05em",
              ...neonGreen
            }}
          >
            {loading ? "⬡ AUTHORIZING..." : mode === "login" ? "ACCESS PLATFORM" : "INITIALIZE PROFILE"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <button 
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: C.textDim, 
              fontSize: 12, 
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Login"}
          </button>

        </div>
      </div>
    </div>
  );
}
