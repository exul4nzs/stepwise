"use client";

import { useState } from "react";
import { C } from "@/lib/tokens";
import { type PageId, type UserProfile } from "@/lib/constants";

import Onboarding from "@/components/Onboarding";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Dashboard from "@/components/Dashboard";
import LessonPage from "@/components/LessonPage";
import ArenaPage from "@/components/ArenaPage";
import CompanionPage from "@/components/CompanionPage";
import AdminPage from "@/components/AdminPage";

const PAGE_SUBTITLES: Record<string, string> = {
  dashboard: "Your Mission Overview",
  lesson: "Module Library",
  arena: "Problem Arena",
  companion: "AI Tutor",
  admin: "Content Management",
};

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState<PageId>("dashboard");

  // ─── Onboarding ─────────────────────────────────────────────────
  if (!user) {
    return <Onboarding onDone={(u) => setUser(u)} />;
  }

  // ─── Main App ───────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar page={page} setPage={setPage} user={user} />
      <div
        className="grid-bg"
        style={{
          marginLeft: 256,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TopBar subtitle={PAGE_SUBTITLES[page]} />
        {page === "dashboard" && (
          <Dashboard user={user} setPage={setPage} />
        )}
        {page === "lesson" && <LessonPage user={user} />}
        {page === "arena" && <ArenaPage user={user} />}
        {page === "companion" && <CompanionPage user={user} />}
        {page === "admin" && <AdminPage />}
      </div>
    </div>
  );
}
