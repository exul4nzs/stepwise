"use client";

import { useState } from "react";
import { C, glass, neonGreen } from "@/lib/tokens";
import { SUBJECTS, DIFF_COLOR, type UserProfile } from "@/lib/constants";
import { callAI } from "@/lib/ai";

interface Quiz {
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  type?: string;
}

interface ArenaPageProps {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
}

export default function ArenaPage({ user, updateUser }: ArenaPageProps) {
  const [subject, setSubject] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [qCount, setQCount] = useState(0);

  const generateQuiz = async () => {
    if (!subject) return;
    setLoading(true);
    setQuiz(null);
    setSelected(null);
    setRevealed(false);

    const sys = `You are an engineering professor creating quiz questions. Generate exactly ONE quiz question as valid JSON with this exact structure:
{
  "question": "the question text",
  "choices": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "answer": "A) ...",
  "explanation": "brief explanation of why this is correct",
  "type": "multiple_choice"
}
Return ONLY the JSON, no other text, no markdown backticks.`;

    const text = await callAI(
      sys,
      `Subject: ${subject}\nDifficulty: ${difficulty}\nGenerate a challenging engineering quiz question.`
    );
    try {
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setQuiz(parsed);
      setQCount((c) => c + 1);
    } catch {
      setQuiz({
        question: "What is the fundamental theorem of calculus used for in engineering differential equations?",
        choices: [
          "A) Computing definite integrals via antiderivatives",
          "B) Finding eigenvalues of matrices",
          "C) Solving network equations",
          "D) Performing regression analysis",
        ],
        answer: "A) Computing definite integrals via antiderivatives",
        explanation:
          "The fundamental theorem of calculus connects differentiation and integration, enabling engineers to compute definite integrals by evaluating antiderivatives at interval boundaries. Configure your Gemini API key for AI-generated questions.",
        type: "multiple_choice",
      });
      setQCount((c) => c + 1);
    }
    setLoading(false);
  };

  const handleAnswer = (choice: string) => {
    if (revealed) return;
    setSelected(choice);
    setRevealed(true);
    if (choice === quiz?.answer) setScore((s) => s + 1);
  };

  const getChoiceStyle = (choice: string) => {
    if (!revealed)
      return {
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${C.border}`,
        color: C.text,
      };
    if (choice === quiz?.answer)
      return {
        background: "rgba(52,211,102,0.1)",
        border: `1px solid ${C.primary}`,
        color: C.primary,
        boxShadow: neonGreen.boxShadow,
      };
    if (choice === selected)
      return {
        background: "rgba(248,113,113,0.1)",
        border: `1px solid ${C.error}`,
        color: C.error,
      };
    return {
      background: "rgba(255,255,255,0.02)",
      border: `1px solid ${C.border}`,
      color: C.textDim,
    };
  };

  return (
    <div style={{ padding: "28px 36px", maxWidth: 800, margin: "0 auto" }}>
      {/* Score */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[
          {
            label: "Score",
            value: `${score}/${qCount}`,
            color: C.primary,
          },
          {
            label: "Accuracy",
            value: qCount
              ? `${Math.round((score / qCount) * 100)}%`
              : "—",
            color: "#60a5fa",
          },
          {
            label: "Subject",
            value: subject || "—",
            color: C.gold,
          },
        ].map((m) => (
          <div
            key={m.label}
            style={{ ...glass, padding: "16px 20px", borderRadius: 12, flex: 1 }}
          >
            <div
              style={{
                fontSize: 11,
                color: C.textDim,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: m.color,
                fontFamily: "var(--font-display)",
                marginTop: 4,
              }}
            >
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Setup */}
      {!quiz && !loading && (
        <div style={{ ...glass, padding: "32px", borderRadius: 20 }}>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              color: C.text,
              marginBottom: 20,
            }}
          >
            Configure Your Mission
          </div>

          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Select Subject
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSubject(s)}
                  style={{
                    padding: "12px 16px",
                    textAlign: "left",
                    border: `1px solid ${
                      subject === s ? C.primary : C.border
                    }`,
                    borderRadius: 10,
                    background:
                      subject === s
                        ? "rgba(52,211,102,0.08)"
                        : "transparent",
                    color: subject === s ? C.primary : C.text,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    boxShadow:
                      subject === s ? neonGreen.boxShadow : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              Difficulty
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["Beginner", "Intermediate", "Advanced"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: `1px solid ${
                      difficulty === d ? DIFF_COLOR[d] : C.border
                    }`,
                    borderRadius: 8,
                    background:
                      difficulty === d
                        ? `${DIFF_COLOR[d]}18`
                        : "transparent",
                    color: difficulty === d ? DIFF_COLOR[d] : C.textMuted,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateQuiz}
            disabled={!subject}
            style={{
              width: "100%",
              padding: "14px",
              background: subject ? C.primary : C.bgHighest,
              color: subject ? "#000" : C.textDim,
              border: "none",
              borderRadius: 10,
              fontWeight: 800,
              fontSize: 14,
              cursor: subject ? "pointer" : "not-allowed",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.04em",
              boxShadow: subject ? neonGreen.boxShadow : "none",
            }}
          >
            ⚡ GENERATE QUESTION
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            ...glass,
            padding: "48px",
            borderRadius: 20,
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
            ⬡ AI generating your question...
          </div>
        </div>
      )}

      {/* Quiz */}
      {quiz && !loading && (
        <div className="animate-fade-in">
          <div
            style={{
              ...glass,
              padding: "28px 32px",
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: C.primary,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: 12,
              }}
            >
              {subject} · {difficulty}
            </div>
            <div
              style={{
                fontSize: 18,
                color: C.text,
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              {quiz.question}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {(quiz.choices || []).map((choice, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(choice)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  textAlign: "left",
                  borderRadius: 12,
                  cursor: revealed ? "default" : "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.5,
                  transition: "all 0.2s",
                  ...getChoiceStyle(choice),
                }}
              >
                {choice}
              </button>
            ))}
          </div>

          {revealed && quiz.explanation && (
            <div
              style={{
                ...glass,
                padding: "20px 24px",
                borderRadius: 14,
                borderLeft: `3px solid ${
                  selected === quiz.answer ? C.primary : C.error
                }`,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color:
                    selected === quiz.answer ? C.primary : C.error,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {selected === quiz.answer ? "✓ Correct!" : "✗ Incorrect"}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                {quiz.explanation}
              </div>
            </div>
          )}

          {revealed && (
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={generateQuiz}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: C.primary,
                  color: "#000",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  ...neonGreen,
                }}
              >
                NEXT QUESTION →
              </button>
              <button
                onClick={() => {
                  setQuiz(null);
                  setSubject(null);
                }}
                style={{
                  padding: "12px 20px",
                  background: "transparent",
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
