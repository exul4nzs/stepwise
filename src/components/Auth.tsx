"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { C, glass, neonGreen } from "@/lib/tokens";

interface AuthProps {
  onSession: (user: any) => void;
}

export default function Auth({ onSession }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert("✅ Initialized! Please check your email to confirm your account before logging in.");
    } else {
      alert("⚠️ Session not established. Try refreshing the page.");
    }
    setLoading(false);
  };

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
            width: 48, 
            height: 48, 
            borderRadius: "50%", 
            background: `linear-gradient(135deg, ${C.primaryDim}, ${C.primary})`,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
            color: "#000",
            boxShadow: `0 0 30px ${C.primaryGlow}`
          }}>S</div>
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, color: C.primary, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="engineer@stepwise.edu"
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
            type="button"
            onClick={handleAuth}
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
        </div>

        <div style={{ textAlign: "center", marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <button 
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

          {/* Dev Bypass */}
          <button 
            onClick={() => onSession({ user: { email: "dev@stepwise.edu" } })}
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "rgba(255,255,255,0.1)", 
              fontSize: 10, 
              cursor: "pointer" 
            }}
          >
            DEBUG: BYPASS AUTH
          </button>
        </div>
      </div>
    </div>
  );
}
