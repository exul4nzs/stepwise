import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stepwise — Adaptive Engineering Review",
  description: "AI-powered adaptive learning platform for Differential Equations, Engineering Data Analysis, and Circuits. Built for engineering students preparing for retention exams.",
  keywords: ["engineering", "review", "adaptive learning", "differential equations", "circuits", "data analysis"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
