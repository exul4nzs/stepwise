# Stepwise — Adaptive Engineering Review Platform

Stepwise is a modern, AI-powered learning platform designed specifically for engineering students. It focuses on core subjects like **Differential Equations**, **Engineering Data Analysis**, and **Circuits**, providing an adaptive learning experience that grows with the student.

![Project Preview](https://via.placeholder.com/1200x600?text=Stepwise+Adaptive+Engineering+Platform)

## ✨ Features

- **🎯 Adaptive Onboarding**: Tailors content recommendations based on your familiarity with subjects and identified weak areas.
- **📊 Intelligence Dashboard**: Track your progress across different engineering domains with real-time analytics.
- **📖 AI-Generated Lessons**: Instantly generate comprehensive, engineering-grade lessons on any topic using Gemini 1.5 Flash.
- **⚡ Interactive Arena**: Test your knowledge in the Arena with dynamically generated quizzes tailored to your difficulty level.
- **◎ AI Companion**: A dedicated engineering tutor available 24/7 to answer complex conceptual questions.
- **⬣ Admin Control**: Seamlessly ingest lecture PDFs and generate curriculum-aligned content.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Styling**: Vanilla CSS with a custom **Dark Emerald** Design System
- **Language**: TypeScript

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/stepwise.git
cd stepwise
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🎨 Design Philosophy

Stepwise features a **Premium Dark Emerald** aesthetic, meticulously crafted for engineering students. The palette avoids yellow-green tones in favor of deep forest greens and vibrant emerald accents, creating a professional, high-focus environment.

---

Built for the **Sophomore Retention Exam** — Computer Engineering Department.
