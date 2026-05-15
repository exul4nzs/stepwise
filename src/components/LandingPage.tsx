"use client";

import { C, glass, neonGreen } from "@/lib/tokens";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: C.bg, 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center",
      padding: 24,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Grid & Glows */}
      <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
      <div style={{ 
        position: "absolute", 
        width: 800, 
        height: 800, 
        background: `radial-gradient(${C.primary}08, transparent 70%)`,
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800 }}>
        {/* Brand Icon */}
        <div style={{ 
          width: 80, 
          height: 80, 
          borderRadius: "24%", 
          background: `linear-gradient(135deg, ${C.primaryDim}, ${C.primary})`,
          margin: "0 auto 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
          fontWeight: 900,
          color: "#000",
          boxShadow: `0 0 50px ${C.primaryGlow}`,
          transform: "rotate(-5deg)"
        }}>S</div>

        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "clamp(48px, 8vw, 72px)", 
          fontWeight: 900, 
          color: "#fff",
          lineHeight: 0.9,
          letterSpacing: "-0.02em",
          marginBottom: 24
        }}>
          STEP<span style={{ color: C.primary }}>WISE</span>
        </h1>
        
        <p style={{ 
          fontSize: "clamp(16px, 2vw, 20px)", 
          color: C.textMuted, 
          maxWidth: 600, 
          margin: "0 auto 48px",
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          The ultimate AI-driven retention platform for <span style={{ color: C.primary }}>Engineering Sophomores</span>. Master differential equations and circuits through intelligent curriculum scanning.
        </p>

        {/* Features Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
          gap: 20, 
          marginBottom: 60,
          textAlign: "left"
        }}>
          <FeatureCard 
            icon="🧠" 
            title="AI Tutors" 
            desc="Gemini-powered lessons tailored to the 8th Ed Nagle/Saff curriculum." 
          />
          <FeatureCard 
            icon="🔍" 
            title="PDF Scan" 
            desc="Upload your study guides and let AI extract a structured roadmap." 
          />
          <FeatureCard 
            icon="📐" 
            title="Math Engine" 
            desc="High-fidelity LaTeX rendering for complex engineering formulas." 
          />
        </div>

        <button 
          onClick={onStart}
          style={{
            padding: "20px 48px",
            background: C.primary,
            color: "#000",
            border: "none",
            borderRadius: 100,
            fontWeight: 900,
            fontSize: 18,
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.05em",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            ...neonGreen
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05) translateY(-5px)";
            e.currentTarget.style.boxShadow = `0 20px 40px ${C.primaryGlow}`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1) translateY(0)";
            e.currentTarget.style.boxShadow = neonGreen.boxShadow;
          }}
        >
          INITIALIZE PROTOCOL →
        </button>
      </div>

      {/* Bottom Footer */}
      <div style={{ 
        position: "absolute", 
        bottom: 32, 
        fontSize: 11, 
        color: C.textDim, 
        letterSpacing: "0.2em", 
        textTransform: "uppercase" 
      }}>
        Authorized Personnel Only // System v2.4.0
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div style={{ 
      ...glass, 
      padding: "24px", 
      borderRadius: 20, 
      border: `1px solid ${C.border}`,
      background: "rgba(255,255,255,0.02)"
    }}>
      <div style={{ fontSize: 24, marginBottom: 16 }}>{icon}</div>
      <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, marginBottom: 8, letterSpacing: "0.05em" }}>{title}</div>
      <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
