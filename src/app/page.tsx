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
import dynamic from "next/dynamic";

const AdminPage = dynamic(() => import("@/components/AdminPage"), {
  ssr: false,
  loading: () => (
    <div style={{ padding: 40, color: C.primary, textAlign: "center" }}>
      ⬡ INITIALIZING COMMAND CENTER...
    </div>
  ),
});

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/Auth";

const PAGE_SUBTITLES: Record<string, string> = {
  dashboard: "Your Mission Overview",
  lesson: "Module Library",
  arena: "Problem Arena",
  companion: "AI Tutor",
  admin: "Content Management",
};

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [page, setPage] = useState<PageId>("dashboard");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  // 1. Auth Gate
  if (!session) {
    return <Auth onSession={setSession} />;
  }

  // 2. Profile Setup (Onboarding)
  if (!user) {
    return <Onboarding onDone={(u) => setUser(u)} />;
  }

  const isAdmin = session?.user?.email === "admin@stepwise.edu" || session?.user?.id === "YOUR_ADMIN_ID"; 
  // Tip: You can change the above email to yours or check a metadata field.

  // ─── Main App ───────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.bg }}>
      <Sidebar page={page} setPage={setPage} user={user} isAdmin={isAdmin} />
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
        {page === "lesson" && <LessonPage user={user} isAdmin={isAdmin} />}
        {page === "arena" && <ArenaPage user={user} updateUser={updateUser} />}
        {page === "companion" && <CompanionPage user={user} />}
        {page === "admin" && <AdminPage user={user} updateUser={updateUser} />}
      </div>
    </div>
  );
}
