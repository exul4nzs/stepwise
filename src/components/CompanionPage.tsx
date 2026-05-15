"use client";

import { useState, useRef, useEffect } from "react";
import { C, glass, neonGreen } from "@/lib/tokens";
import { type UserProfile } from "@/lib/constants";
import { callAI } from "@/lib/ai";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface CompanionPageProps {
  user: UserProfile;
}

export default function CompanionPage({ user }: CompanionPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `Welcome back, ${
        user?.name || "Engineer"
      }. I'm your AI study companion for Differential Equations, Data Analysis, and Circuits. What would you like to work on today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setLoading(true);

    const sys = `You are an expert engineering tutor specializing in Differential Equations, Engineering Data Analysis, and Circuits. You help students understand complex concepts clearly and concisely. 
- Keep responses focused and helpful, around 100-200 words unless a detailed explanation is needed.
- Use simple notation for math.
- Be encouraging and adaptive based on the student's level.
- If asked about topics outside these subjects, redirect gently.`;

    const reply = await callAI(sys, userMsg);
    setMessages((m) => [...m, { role: "assistant", text: reply }]);
    setLoading(false);
  };

  const suggestions = [
    "Explain Laplace transforms simply",
    "What is KVL vs KCL?",
    "How do I do regression analysis?",
    "Quiz me on circuits",
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 60px)",
        padding: "20px 32px",
      }}
    >
      {/* Header */}
      <div
        style={{
          ...glass,
          padding: "16px 20px",
          borderRadius: 14,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.primaryDim}, ${C.primary})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
            boxShadow: `0 0 16px ${C.primaryGlow}`,
          }}
        >
          ◎
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>
            Sigma — AI Engineering Tutor
          </div>
          <div style={{ fontSize: 12, color: C.primary }}>
            ● Online · Powered by Gemini
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              style={{
                padding: "8px 14px",
                background: "rgba(52,211,102,0.07)",
                border: `1px solid ${C.borderBright}`,
                borderRadius: 20,
                color: C.primary,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingRight: 4,
          marginBottom: 16,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "75%",
                padding: "14px 18px",
                borderRadius: 16,
                background:
                  m.role === "user"
                    ? "rgba(52,211,102,0.12)"
                    : C.bgHigh,
                border: `1px solid ${
                  m.role === "user" ? C.borderBright : C.border
                }`,
                color: C.text,
                fontSize: 14,
                lineHeight: 1.65,
                borderBottomRightRadius:
                  m.role === "user" ? 4 : 16,
                borderBottomLeftRadius:
                  m.role === "assistant" ? 4 : 16,
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex" }}>
            <div
              style={{
                padding: "14px 18px",
                borderRadius: 16,
                background: C.bgHigh,
                border: `1px solid ${C.border}`,
                color: C.primary,
                fontSize: 14,
                animation: "pulse 1.5s infinite",
              }}
            >
              ⬡ Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything about DE, Data Analysis, or Circuits..."
          style={{
            flex: 1,
            padding: "14px 18px",
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            color: C.text,
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            outline: "none",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = C.primary)
          }
          onBlur={(e) =>
            (e.target.style.borderColor = C.border)
          }
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: "14px 20px",
            background: input.trim() ? C.primary : C.bgHighest,
            color: input.trim() ? C.primaryDeep : C.textDim,
            border: "none",
            borderRadius: 12,
            fontWeight: 800,
            cursor: input.trim() ? "pointer" : "not-allowed",
            fontSize: 16,
            ...(input.trim() ? neonGreen : {}),
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
