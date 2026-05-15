"use client";

import { useState, useEffect } from "react";
import { C, glass } from "@/lib/tokens";
import {
  SUBJECTS,
  DIFF_COLOR,
  type UserProfile,
} from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

/* ─── Lesson Page ──────────────────────────────────────────────────────── */
interface Lesson {
  id: string;
  title: string;
  subject: string;
  markdown_content: string;
  difficulty: string;
}

interface LessonPageProps {
  user: UserProfile;
  isAdmin: boolean;
}

export default function LessonPage({ user, isAdmin }: LessonPageProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  async function fetchLessons() {
    setLoading(true);
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setLessons(data);
    }
    setLoading(false);
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation(); // Don't open the lesson
    if (!confirm("Are you sure you want to delete this module? This action is irreversible.")) return;

    const { error } = await supabase.from("lessons").delete().eq("id", id);
    if (error) alert("Delete failed: " + error.message);
    else fetchLessons();
  }

  if (activeLesson) {
    return (
      <div style={{ padding: "28px 36px", maxWidth: 1000, margin: "0 auto" }}>
        <button
          onClick={() => setActiveLesson(null)}
          style={{
            background: "transparent",
            border: "none",
            color: C.primary,
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          ← BACK TO LIBRARY
        </button>

        <div className="animate-fade-in" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }}>
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ 
                display: "inline-block", 
                padding: "4px 12px", 
                borderRadius: 6, 
                background: "rgba(52,211,102,0.1)",
                color: C.primary,
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 12
              }}>
                {activeLesson.subject} · {activeLesson.difficulty}
              </div>
              <h1 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: 32, 
                fontWeight: 900, 
                color: "#fff",
                lineHeight: 1.1
              }}>
                {activeLesson.title}
              </h1>
            </div>

            <div style={{ 
              ...glass, 
              padding: "40px", 
              borderRadius: 24,
              border: `1px solid ${C.border}`,
              background: "rgba(6,13,8,0.4)"
            }}>
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(activeLesson.markdown_content) }} 
              />
            </div>
          </div>

          {/* TOC Sidebar */}
          <div style={{ position: "sticky", top: 100, height: "fit-content" }}>
            <div style={{ fontSize: 11, color: C.primary, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Table of Contents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {activeLesson.markdown_content.split("\n")
                .filter(line => line.startsWith("## "))
                .map((line, idx) => {
                  const title = line.replace("## ", "").trim();
                  return (
                    <div key={idx} style={{ 
                      fontSize: 13, 
                      color: C.textMuted, 
                      paddingLeft: 12, 
                      borderLeft: `1px solid ${C.border}`,
                      transition: "all 0.2s"
                    }}>
                      {title}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Subject Sections */}
      {SUBJECTS.map((s) => {
        const items = lessons.filter((l) => l.subject === s);
        
        return (
          <div key={s} style={{ marginBottom: 48 }}>
            <div
              style={{
                fontSize: 14,
                color: C.primary,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 16
              }}
            >
              {s}
              <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.primary}33, transparent)` }} />
            </div>

            {items.length === 0 ? (
              <div style={{ 
                padding: "48px", 
                background: "rgba(255,255,255,0.01)",
                border: `1px dashed ${C.border}`, 
                borderRadius: 20, 
                textAlign: "center",
                color: C.textDim,
                fontSize: 14
              }}>
                <div style={{ fontSize: 24, marginBottom: 12, opacity: 0.5 }}>⬡</div>
                No modules generated yet. 
                <br/>
                <span style={{ fontSize: 12, color: C.textMuted }}>Use the Admin Panel to create your first lesson.</span>
              </div>
            ) : (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", 
                gap: 20 
              }}>
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveLesson(item)}
                    style={{
                      ...glass,
                      padding: "24px 28px",
                      borderRadius: 20,
                      border: `1px solid ${C.border}`,
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.primary;
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 15px 40px ${C.primary}15`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                      <div style={{ 
                        fontSize: 17, 
                        fontWeight: 800, 
                        color: "#fff", 
                        marginBottom: 6,
                        fontFamily: "var(--font-display)" 
                      }}>
                        {item.title}
                      </div>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: C.textMuted, display: "flex", alignItems: "center", gap: 6 }}>
                          ⏱ 15 min
                        </span>
                        <span style={{ 
                          fontSize: 11, 
                          color: DIFF_COLOR[item.difficulty] || C.primary,
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em"
                        }}>
                          {item.difficulty}
                        </span>
                        
                        {isAdmin && (
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            style={{
                              background: "rgba(239,68,68,0.1)",
                              border: "none",
                              color: "#ef4444",
                              fontSize: 10,
                              fontWeight: 800,
                              padding: "2px 8px",
                              borderRadius: 4,
                              cursor: "pointer",
                              marginLeft: "auto"
                            }}
                          >
                            ELIMINATE
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 24, 
                      color: C.primary, 
                      opacity: 0.3,
                      transition: "opacity 0.2s"
                    }} className="arrow">→</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
