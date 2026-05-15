// ─── SHARED CONSTANTS ─────────────────────────────────────────────────────

export const SUBJECTS = [
  "Differential Equations",
  "Engineering Data Analysis",
  "Circuits",
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
  { subject: "Differential Equations",    pct: 40, color: C.primary, topic: "Linear ODEs & Laplace" },
  { subject: "Engineering Data Analysis", pct: 70, color: C.gold,    topic: "Probability & Statistics" },
  { subject: "Circuits",                  pct: 90, color: "#60a5fa", topic: "KVL, KCL & Networks" },
];

// ─── LESSON TOPICS ────────────────────────────────────────────────────────
export const LESSON_TOPICS: Record<string, { title: string; difficulty: string; duration: string; done: boolean }[]> = {
  "Differential Equations": [
    { title: "Introduction to ODEs",      difficulty: "Beginner",     duration: "15 min", done: true  },
    { title: "Separable Equations",       difficulty: "Beginner",     duration: "20 min", done: true  },
    { title: "Linear First-Order ODEs",   difficulty: "Intermediate", duration: "25 min", done: false },
    { title: "Laplace Transforms",        difficulty: "Intermediate", duration: "30 min", done: false },
    { title: "Systems of ODEs",           difficulty: "Advanced",     duration: "35 min", done: false },
  ],
  "Engineering Data Analysis": [
    { title: "Descriptive Statistics",     difficulty: "Beginner",     duration: "15 min", done: true  },
    { title: "Probability Distributions",  difficulty: "Beginner",     duration: "20 min", done: true  },
    { title: "Hypothesis Testing",         difficulty: "Intermediate", duration: "25 min", done: true  },
    { title: "Regression Analysis",        difficulty: "Intermediate", duration: "30 min", done: false },
    { title: "ANOVA & Statistical Models", difficulty: "Advanced",     duration: "35 min", done: false },
  ],
  "Circuits": [
    { title: "Kirchhoff's Laws (KVL/KCL)", difficulty: "Beginner",     duration: "15 min", done: true  },
    { title: "Mesh & Nodal Analysis",       difficulty: "Intermediate", duration: "25 min", done: true  },
    { title: "AC Circuit Analysis",         difficulty: "Intermediate", duration: "30 min", done: true  },
    { title: "Impedance & Phasors",         difficulty: "Advanced",     duration: "30 min", done: true  },
    { title: "Network Theorems",            difficulty: "Advanced",     duration: "35 min", done: false },
  ],
};

export const DIFF_COLOR: Record<string, string> = {
  Beginner:     C.primary,
  Intermediate: C.gold,
  Advanced:     C.error,
};
