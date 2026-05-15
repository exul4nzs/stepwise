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
        {/* Double-Shell Hollow Italic Logo */}
        <div style={{ 
          position: "relative",
          width: 80,
          height: 80,
          margin: "0 auto 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none"
        }}>
          {/* Outer Shell */}
          <div style={{ 
            position: "absolute",
            fontSize: 84,
            fontWeight: 900,
            fontStyle: "italic",
            color: "transparent",
            WebkitTextStroke: `3px ${C.primary}33`,
            fontFamily: "var(--font-display)",
            zIndex: 1
          }}>S</div>
          {/* Inner Shell */}
          <div style={{ 
            position: "absolute",
            fontSize: 80,
            fontWeight: 900,
            fontStyle: "italic",
            color: "transparent",
            WebkitTextStroke: `1.5px ${C.primary}`,
            fontFamily: "var(--font-display)",
            filter: `drop-shadow(0 0 10px ${C.primaryGlow})`,
            zIndex: 2
          }}>S</div>
        </div>

        <h1 style={{ 
          fontFamily: "var(--font-display)", 
          fontSize: "clamp(40px, 7vw, 64px)", 
          fontWeight: 900, 
          color: "#fff",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          marginBottom: 24
        }}>
          Anxious about the <span style={{ color: C.primary }}>Retention Exam?</span>
        </h1>
        
        <p style={{ 
          fontSize: "clamp(16px, 1.5vw, 18px)", 
          color: C.textMuted, 
          maxWidth: 600, 
          margin: "0 auto 48px",
          lineHeight: 1.6,
          fontWeight: 500
        }}>
          Stop stressing. Stepwise is a <span style={{ color: C.primary }}>free, focused tool</span> built for you by engineering students. No junk—just the exact concepts you need to pass the exam.
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
            icon="🆓" 
            title="100% Free" 
            desc="No credits, no energy limits. Just open it up and start reviewing whenever you need to." 
          />
          <FeatureCard 
            icon="🎯" 
            title="Hyper-Focused" 
            desc="Upload your specific syllabus and get a study guide that actually matches your exam." 
          />
          <FeatureCard 
            icon="✨" 
            title="Built for You" 
            desc="Clean math, simple navigation, and zero distractions. Designed for how you study." 
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
            fontSize: 16,
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
          STOP PANICKING & START →
        </button>
        <div style={{ height: 80 }} /> {/* Spacer to prevent footer overlap */}
      </div>

      {/* Bottom Footer */}
      <div style={{ 
        position: "absolute", 
        bottom: 24, 
        width: "100%",
        textAlign: "center",
        fontSize: 10, 
        color: C.textDim, 
        letterSpacing: "0.2em", 
        textTransform: "uppercase",
        opacity: 0.5
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
