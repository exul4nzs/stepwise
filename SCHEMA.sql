-- Stepwise Database Schema

-- 1. Create the Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  markdown_content TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate',
  generated_from_pdf BOOLEAN DEFAULT false
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow anyone to read lessons
-- This ensures the LessonPage.tsx can fetch data
CREATE POLICY "Allow public read access" ON lessons
  FOR SELECT USING (true);

-- 4. Create a policy to allow anyone to insert lessons
-- This ensures the AdminPage.tsx can save data
CREATE POLICY "Allow public insert access" ON lessons
  FOR INSERT WITH CHECK (true);

-- Note: In a production environment, you would restrict INSERT 
-- access to authenticated admin users only.
