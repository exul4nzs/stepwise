"use client";

import { useState, useEffect } from "react";
import { C, glass } from "@/lib/tokens";
import {
  SUBJECTS,
  LESSON_TOPICS,
  DIFF_COLOR,
  type UserProfile,
  type Subject,
} from "@/lib/constants";
import { callAI } from "@/lib/ai";
import { supabase } from "@/lib/supabase";

/* ─── Markdown renderer ────────────────────────────────────────────────── */
function renderMarkdown(text: string): string {
  return text
    .replace(
      /^### (.+)$/gm,
      '<h3 style="color:#34d366;font-size:16px;margin:16px 0 8px;font-family:Montserrat,sans-serif;">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="color:#22a74f;font-size:18px;margin:20px 0 10px;font-family:Montserrat,sans-serif;">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="color:#34d366;font-size:22px;margin:0 0 14px;font-family:Montserrat,sans-serif;font-weight:900;">$1</h1>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color:#e2f0e6;font-weight:700;">$1</strong>'
    )
    .replace(
      /`(.+?)`/g,
      '<code style="background:rgba(52,211,102,0.1);color:#34d366;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li style="color:#a8c4af;margin:4px 0;padding-left:4px;">$1</li>'
    )
    .replace(/\n\n/g, "<br/><br/>");
}

/* ─── Lesson Page ──────────────────────────────────────────────────────── */
interface LessonPageProps {
  user: UserProfile;
}

export default function LessonPage({ user }: LessonPageProps) {
  const [activeSubject, setActiveSubject] = useState<Subject>(SUBJECTS[0]);
  const [activeTopic, setActiveTopic] = useState<{
    title: string;
    difficulty: string;
    duration: string;
    done: boolean;
  } | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbTopics, setDbTopics] = useState<any[]>([]);

  const fetchDbTopics = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("subject", activeSubject);
    
    if (data && !error) {
      setDbTopics(data.map(d => ({
        title: d.title,
        difficulty: d.difficulty,
        duration: "AI Generated",
        done: false,
        id: d.id,
        isDb: true,
        content: d.markdown_content
      })));
    }
  };

  const allTopics = [...(LESSON_TOPICS[activeSubject] || []), ...dbTopics];

  useEffect(() => {
    fetchDbTopics();
  }, [activeSubject]);

  const loadLesson = async (topic: any) => {
    setActiveTopic(topic);
    setContent("");
    
    if (topic.isDb) {
      setContent(topic.content);
      return;
    }

    setLoading(true);
    const sys = `You are an expert engineering professor. Generate a concise, engaging lesson on the given topic formatted in clean markdown. Include:
1. A brief conceptual overview (2-3 sentences)
2. Key formula(s) in simple notation  
3. A worked example
4. 2 key takeaways
Keep it focused for engineering students. Use plain text, no HTML.`;
    const text = await callAI(
      sys,
      `Generate a lesson on: ${topic.title} (Subject: ${activeSubject}, Difficulty: ${topic.difficulty})`,
      () => {}
    );
    setContent(text);
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
      {/* Topic list */}
      <div
        style={{
          width: 280,
          borderRight: `1px solid ${C.border}`,
          overflowY: "auto",
          padding: "20px 0",
          flexShrink: 0,
        }}
      >
        {SUBJECTS.map((s) => (
          <div key={s}>
            <button
              onClick={() => setActiveSubject(s)}
              style={{
                width: "100%",
                padding: "10px 20px",
                textAlign: "left",
                border: "none",
                background:
                  activeSubject === s
                    ? "rgba(52,211,102,0.08)"
                    : "transparent",
                color: activeSubject === s ? C.primary : C.textMuted,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {s}
            </button>
            {activeSubject === s &&
              allTopics.map((t) => (
                <button
                  key={t.title}
                  onClick={() => loadLesson(t)}
                  style={{
                    width: "100%",
                    padding: "10px 20px 10px 28px",
                    textAlign: "left",
                    border: "none",
                    background:
                      activeTopic?.title === t.title
                        ? "rgba(52,211,102,0.06)"
                        : "transparent",
                    color:
                      activeTopic?.title === t.title ? C.primary : C.text,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderLeft:
                      activeTopic?.title === t.title
                        ? `2px solid ${C.primary}`
                        : "2px solid transparent",
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {t.done ? "✓" : "○"}
                  </span>
                  <span style={{ flex: 1 }}>{t.title}</span>
                  <span
                    style={{
                      fontSize: 10,
                      color: DIFF_COLOR[t.difficulty],
                      fontWeight: 700,
                    }}
                  >
                    {t.difficulty[0]}
                  </span>
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 36px" }}>
        {!activeTopic ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: C.textDim,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>◈</div>
            <div
              style={{
                fontSize: 18,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
              }}
            >
              Select a topic to begin
            </div>
            <div style={{ fontSize: 14, marginTop: 8 }}>
              AI will generate a tailored lesson for you
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: DIFF_COLOR[activeTopic.difficulty],
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                    background: `${DIFF_COLOR[activeTopic.difficulty]}18`,
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 6,
                  }}
                >
                  {activeTopic.difficulty} · {activeTopic.duration}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: 28,
                    color: C.text,
                  }}
                >
                  {activeTopic.title}
                </div>
                <div
                  style={{ fontSize: 14, color: C.textMuted, marginTop: 4 }}
                >
                  {activeSubject}
                </div>
              </div>
            </div>

            {loading && (
              <div
                style={{
                  ...glass,
                  padding: "32px",
                  borderRadius: 16,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: C.primary,
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  ⬡ Generating lesson with AI...
                </div>
                <div
                  style={{ fontSize: 12, color: C.textDim, marginTop: 8 }}
                >
                  Analyzing curriculum and crafting your personalized content
                </div>
              </div>
            )}

            {content && !loading && (
              <div
                style={{
                  ...glass,
                  padding: "32px",
                  borderRadius: 16,
                  lineHeight: 1.7,
                }}
              >
                <div
                  style={{ fontSize: 14, color: C.text, lineHeight: 1.8 }}
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(content),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
