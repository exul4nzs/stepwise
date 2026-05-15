// ─── SHARED CONSTANTS ─────────────────────────────────────────────────────

export const SUBJECTS = [
  "Differential Equations",
  "Engineering Data Analysis",
  "Electrical Circuits",
  "Electronic Circuits",
] as const;

export type Subject = (typeof SUBJECTS)[number];

export const PAGES = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "lesson",    icon: "◈", label: "Lessons" },
  { id: "arena",     icon: "⚡", label: "Arena" },
  { id: "companion", icon: "◎", label: "Companion" },
  { id: "admin",     icon: "⬣", label: "Admin" },
] as const;

export type PageId = (typeof PAGES)[number]["id"];

export interface UserProfile {
  name: string;
  isFamiliar: boolean | null;
  weakSubjects: string[];
}

// ─── PROGRESS DATA ────────────────────────────────────────────────────────
import { C } from "./tokens";

export const PROGRESS_DATA = [
  { subject: "Differential Equations",    pct: 0, color: C.primary, topic: "No progress yet" },
  { subject: "Engineering Data Analysis", pct: 0, color: C.gold,    topic: "No progress yet" },
  { subject: "Electrical Circuits",       pct: 0, color: "#60a5fa", topic: "No progress yet" },
  { subject: "Electronic Circuits",       pct: 0, color: "#a855f7", topic: "No progress yet" },
];

// ─── LESSON TOPICS ────────────────────────────────────────────────────────
export const LESSON_TOPICS: Record<string, { title: string; difficulty: string; duration: string; done: boolean }[]> = {
  "Differential Equations": [],
  "Engineering Data Analysis": [],
  "Electrical Circuits": [],
  "Electronic Circuits": [],
};

export const DIFF_COLOR: Record<string, string> = {
  Beginner:     C.primary,
  Intermediate: C.gold,
  Advanced:     C.error,
};
