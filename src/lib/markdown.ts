import katex from "katex";
import "katex/dist/katex.min.css";

export function renderMarkdown(text: string): string {
  if (!text) return "";

  let html = text
    // 1. Process Block Math $$ ... $$
    .replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      try {
        return `<div style="margin: 1.5em 0; overflow-x: auto; display: flex; justify-content: center;">
          ${katex.renderToString(formula.trim(), { displayMode: true, throwOnError: false })}
        </div>`;
      } catch (e) {
        return match;
      }
    })
    // 2. Process Inline Math $ ... $
    .replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    })
    // 3. Headers
    .replace(/^# (.+)$/gm, '<h1 style="color:#adc6ff;font-size:24px;margin:24px 0 12px;font-family:var(--font-display);font-weight:900;letter-spacing:-0.02em;">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#34d366;font-size:18px;margin:20px 0 10px;font-family:var(--font-display);font-weight:700;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#34d366;font-size:15px;margin:16px 0 8px;font-family:var(--font-display);font-weight:700;">$1</h3>')
    // 4. Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2f0e6;">$1</strong>')
    // 5. Lists
    .replace(/^- (.+)$/gm, '<li style="color:#a8c4af;margin:6px 0;list-style-type:none;display:flex;gap:10px;"><span style="color:#34d366;">•</span><span>$1</span></li>')
    // 6. Inline Code
    .replace(/`(.+?)`/g, '<code style="background:rgba(52,211,102,0.1);color:#34d366;padding:2px 5px;border-radius:4px;font-size:12px;font-family:var(--font-mono);">$1</code>')
    // 7. Horizontal Rule
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:24px 0;"/>')
    // 8. Tables
    .replace(/\|(.+)\|/g, (match) => {
        if (match.includes('---')) return "";
        const cols = match.split('|').filter(c => c.trim() !== "").map(c => `<td style="padding:10px;border-bottom:1px solid rgba(255,255,255,0.05);">${c.trim()}</td>`).join("");
        return `<tr style="font-size:12px;">${cols}</tr>`;
    })
    // Wrap tables in table tag if tr exists
    .replace(/(<tr[\s\S]+?<\/tr>)/g, '<table style="width:100%;border-collapse:collapse;margin:16px 0;background:rgba(255,255,255,0.02);border-radius:8px;overflow:hidden;">$1</table>')
    // Cleanup duplicate tables (hacky but works for simple regex)
    .replace(/<\/table><table style="width:100%;border-collapse:collapse;margin:16px 0;background:rgba(255,255,255,0.02);border-radius:8px;overflow:hidden;">/g, "")
    // 9. Newlines
    .replace(/\n\n/g, "<br/><br/>");

  return html;
}
