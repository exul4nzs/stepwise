"use client";

import { useState } from "react";
import { C, glass, neonGreen } from "@/lib/tokens";
import { SUBJECTS } from "@/lib/constants";
import { callAI } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import * as pdfjs from "pdfjs-dist";

// Set worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/* ─── Markdown renderer ────────────────────────────────────────────────── */
function renderMarkdown(text: string): string {
  return text
    .replace(
      /^### (.+)$/gm,
      '<h3 style="color:#34d366;font-size:15px;margin:14px 0 6px;font-family:Montserrat,sans-serif;">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="color:#22a74f;font-size:17px;margin:18px 0 8px;font-family:Montserrat,sans-serif;">$1</h2>'
    )
    .replace(
      /^# (.+)$/gm,
      '<h1 style="color:#34d366;font-size:20px;margin:0 0 12px;font-family:Montserrat,sans-serif;font-weight:900;">$1</h1>'
    )
    .replace(
      /\*\*(.+?)\*\*/g,
      '<strong style="color:#e2f0e6;">$1</strong>'
    )
    .replace(
      /`(.+?)`/g,
      '<code style="background:rgba(52,211,102,0.1);color:#34d366;padding:2px 5px;border-radius:4px;font-size:12px;">$1</code>'
    )
    .replace(
      /^- (.+)$/gm,
      '<li style="color:#a8c4af;margin:3px 0;">$1</li>'
    )
    .replace(/\n\n/g, "<br/><br/>");
}

/* ─── Admin Page ───────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<"lesson" | "quiz">("lesson");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [uploads, setUploads] = useState<any[]>([]);

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const typedarray = new Uint8Array(reader.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = "";
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => (item as any).str).join(" ");
            fullText += pageText + "\n";
          }
          
          setExtractedText(fullText);
          setUploads([{ name: file.name, date: new Date().toLocaleDateString(), status: "Extracted" }]);
          setExtracting(false);
          alert("PDF text extracted successfully! You can now generate content from it.");
        } catch (innerErr: any) {
          console.error("PDF Parse error:", innerErr);
          alert("Error parsing PDF: " + innerErr.message);
          setExtracting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err: any) {
      console.error("FileReader error:", err);
      alert("Failed to read file: " + err.message);
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim() && !extractedText) {
        alert("Please enter a topic or upload a PDF first.");
        return;
    }
    setGenerating(true);
    setResult("");

    let sys =
      type === "lesson"
        ? `You are an engineering curriculum designer. Generate a structured lesson outline in markdown format based on the provided context. Include learning objectives, key concepts, formulas, examples, and summary. Be educational and clear.`
        : `You are an engineering exam writer. Generate 5 quiz questions (mix of multiple choice and short answer) based on the provided context. For each: Question, choices (if MC), correct answer, brief explanation. Format cleanly.`;

    if (subject === "Differential Equations") {
      sys += `\n\nIMPORTANT: For Differential Equations, focus EXCLUSIVELY on these retention-exam topics:
1. Classifications of DE (Order, Degree, Linearity)
2. First Order DE methods (Separable, Exact, Linear, Bernoulli)
3. Applications of DE (Population growth/decay, Newton's law of cooling, RL/RC Circuits)
4. Linear Order N DEs (Homogeneous and Non-homogeneous methods, including constant coefficients)
5. Laplace Transforms (Forward and Inverse transforms only)

Ignore advanced topics like PDEs, Series Solutions, or complex Boundary Value Problems if they appear in the context.`;
    }

    const context = extractedText ? `CONTEXT FROM PDF:\n${extractedText.substring(0, 6000)}\n\n` : "";
    const prompt = `${context}Subject: ${subject}\nTopic: ${topic || 'Extracted from context'}\nDifficulty: Intermediate\nGenerate ${
        type === "lesson" ? "a lesson" : "quiz questions"
      } on this engineering topic.`;

    const text = await callAI(sys, prompt);
    setResult(text);
    setGenerating(false);
  };

  const handleSave = async () => {
    if (!result) return;
    
    try {
      if (type === "lesson") {
        const { error } = await supabase.from("lessons").insert([
          {
            title: topic,
            subject,
            topic,
            markdown_content: result,
            difficulty: "Intermediate",
            generated_from_pdf: false,
          },
        ]);
        if (error) throw error;
      } else {
        // For simplicity, we'll just save the raw text for now or try to parse if it's JSON
        // The ArenaPage expects JSON for quizzes, but Admin generates 5 questions.
        // We'll save it as a lesson with type 'quiz_set' for now, or implement a proper quiz table insertion.
        const { error } = await supabase.from("lessons").insert([
          {
            title: `${topic} Quiz Set`,
            subject,
            topic,
            markdown_content: result,
            difficulty: "Intermediate",
            generated_from_pdf: false,
          },
        ]);
        if (error) throw error;
      }
      alert("Saved successfully to Supabase!");
    } catch (err: any) {
      console.error("Error saving to DB:", err);
      alert("Error saving: " + err.message);
    }
  };

  return (
    <div style={{ padding: "28px 36px", maxWidth: 1000, margin: "0 auto" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: 24,
          color: C.text,
          marginBottom: 4,
        }}
      >
        Admin Panel
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 28 }}>
        Manage content, upload PDFs, and generate AI lessons &amp; quizzes
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 20,
        }}
      >
        {/* Left: Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* PDF Upload Simulation */}
          <div style={{ ...glass, padding: "22px", borderRadius: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: C.primary,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              Upload PDF
            </div>
            <div
              style={{
                border: `2px dashed ${C.border}`,
                borderRadius: 12,
                padding: "28px 20px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.primary;
                e.currentTarget.style.background =
                  "rgba(52,211,102,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>⬡</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Drop PDF here or click to upload
              </div>
              <div
                style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}
              >
                Lecture notes, modules, reviewers
              </div>
            </div>
          </div>

          {/* Generator */}
          <div style={{ ...glass, padding: "22px", borderRadius: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: C.primary,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 16,
              }}
            >
              AI Generator
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}
              >
                Subject
              </div>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: C.bgHigh,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                }}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div
                style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}
              >
                Topic
              </div>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Laplace Transforms, Regression..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  background: C.bgHigh,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 13,
                  fontFamily: "var(--font-sans)",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = C.primary)
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = C.border)
                }
              />
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={onFileUpload}
                  id="pdf-upload"
                  style={{ display: "none" }}
                />
                <label
                  htmlFor="pdf-upload"
                  style={{
                    flex: 1,
                    padding: "10px",
                    background: "rgba(52,211,102,0.05)",
                    border: `1px dashed ${C.border}`,
                    borderRadius: 8,
                    textAlign: "center",
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.text,
                    fontWeight: 600,
                  }}
                >
                  {extracting ? "⌛ EXTRACTING..." : "📂 UPLOAD PDF"}
                </label>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}
              >
                Generate
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {(["lesson", "quiz"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1,
                      padding: "9px",
                      border: `1px solid ${
                        type === t ? C.primary : C.border
                      }`,
                      borderRadius: 8,
                      background:
                        type === t
                          ? "rgba(52,211,102,0.08)"
                          : "transparent",
                      color: type === t ? C.primary : C.textMuted,
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "var(--font-sans)",
                      textTransform: "capitalize",
                    }}
                  >
                    {type === t ? "✓ " : ""}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || extracting || (!topic.trim() && !extractedText)}
              style={{
                width: "100%",
                padding: "12px",
                background: (topic.trim() || extractedText) ? C.primary : C.bgHighest,
                color: (topic.trim() || extractedText) ? "#000" : C.textDim,
                border: "none",
                borderRadius: 10,
                fontWeight: 800,
                fontSize: 13,
                cursor: topic.trim() ? "pointer" : "not-allowed",
                fontFamily: "var(--font-sans)",
                boxShadow: topic.trim() ? neonGreen.boxShadow : "none",
              }}
            >
              {generating ? "⬡ Generating..." : extracting ? "⌛ Extracting..." : "⚡ GENERATE CONTENT"}
            </button>
          </div>

          {/* Uploaded docs */}
          <div style={{ ...glass, padding: "22px", borderRadius: 16 }}>
            <div
              style={{
                fontSize: 12,
                color: C.gold,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 14,
              }}
            >
              Uploaded Documents
            </div>
            {uploads.length === 0 && (
              <div style={{ fontSize: 11, color: C.textDim, textAlign: "center", padding: "10px" }}>
                No documents uploaded yet
              </div>
            )}
            {uploads.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: "12px",
                  background: C.bgHigh,
                  borderRadius: 10,
                  marginBottom: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{ fontWeight: 600, fontSize: 13, color: C.text }}
                >
                  {f.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.textMuted,
                    marginTop: 3,
                  }}
                >
                  {f.date} · {f.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Output */}
        <div
          style={{
            ...glass,
            padding: "24px 28px",
            borderRadius: 16,
            overflowY: "auto",
            minHeight: 500,
          }}
        >
          {!result && !generating && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: C.textDim,
                textAlign: "center",
                minHeight: 300,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 14 }}>⬣</div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                }}
              >
                Ready to generate
              </div>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                Configure subject &amp; topic, then click Generate
              </div>
            </div>
          )}
          {generating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 200,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 14,
                    color: C.primary,
                    animation: "pulse 1.5s infinite",
                  }}
                >
                  ⬡ AI is writing your content...
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: C.textDim,
                    marginTop: 6,
                  }}
                >
                  Crafting curriculum-aligned material
                </div>
              </div>
            </div>
          )}
          {result && !generating && (
            <div className="animate-fade-in">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.primary,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Generated {type}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      color: C.text,
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      marginTop: 2,
                    }}
                  >
                    {topic} — {subject}
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  style={{
                    padding: "8px 14px",
                    background: C.primary,
                    color: C.primaryDeep,
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  ✓ Save to DB
                </button>
              </div>
              <div
                style={{
                  lineHeight: 1.7,
                  fontSize: 13,
                  color: C.text,
                }}
                dangerouslySetInnerHTML={{
                  __html: renderMarkdown(result),
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
