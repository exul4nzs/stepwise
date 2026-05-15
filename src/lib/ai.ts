// ─── GEMINI AI INTEGRATION ────────────────────────────────────────────────
// Client-side helper that calls our Next.js API route (which keeps the key safe)

export async function callAI(
  systemPrompt: string,
  userMessage: string,
  onChunk?: (text: string) => void
): Promise<string> {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ systemPrompt, userMessage }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("AI API error:", err);
      // Return a fallback response for demo purposes
      return generateFallback(userMessage);
    }

    const data = await res.json();
    const text = data.text || "";
    if (onChunk) onChunk(text);
    return text;
  } catch (error) {
    console.error("AI call failed:", error);
    return generateFallback(userMessage);
  }
}

// Fallback content when API is unavailable (demo mode)
function generateFallback(prompt: string): string {
  return `# AI-Generated Content

> **Note**: This is demo content. Configure your Gemini API key in \`.env.local\` for AI-powered generation.

## Topic: ${prompt.slice(0, 100)}

### Key Concepts
- This lesson covers fundamental engineering principles
- Understanding the theoretical foundations is critical
- Practice problems reinforce conceptual learning

### Summary
Configure your **GEMINI_API_KEY** environment variable to enable real AI-powered lesson and quiz generation. The system uses Google's Gemini API to create personalized, curriculum-aligned content.

### Formula Reference
- Core equations and relationships will be generated here
- Step-by-step worked examples included
- Key takeaways for exam preparation`;
}
