-- LearnAI Platform Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'creator', 'admin')),
  xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_visit DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COURSES
-- ============================================
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  class_level TEXT,
  subject TEXT,
  thumbnail_url TEXT,
  pdf_url TEXT,
  lesson_count INTEGER DEFAULT 0,
  duration TEXT,
  has_python BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- UNITS
-- ============================================
CREATE TABLE units (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  page_start INTEGER,
  page_end INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LESSONS
-- ============================================
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  unit_id TEXT REFERENCES units(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  objectives JSONB DEFAULT '[]',
  key_concepts JSONB DEFAULT '[]',
  estimated_minutes INTEGER DEFAULT 15,
  content_blocks JSONB DEFAULT '[]',
  code_examples JSONB DEFAULT '[]',
  quiz_questions JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PROGRESS
-- ============================================
CREATE TABLE user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
  completed_blocks INTEGER[] DEFAULT '{}',
  quiz_score INTEGER,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- ============================================
-- ENROLLMENTS
-- ============================================
CREATE TABLE enrollments (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Courses: Public courses readable by all
CREATE POLICY "Published courses are viewable by everyone" ON courses
  FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can manage own courses" ON courses
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all courses" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Units: Readable if course is published
CREATE POLICY "Units of published courses are viewable" ON units
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = units.course_id AND is_published = true)
  );

-- Lessons: Readable if course is published
CREATE POLICY "Lessons of published courses are viewable" ON lessons
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM courses WHERE id = lessons.course_id AND is_published = true)
  );

-- User Progress: Users can only see/update their own
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Enrollments: Users can manage their own
CREATE POLICY "Users can view own enrollments" ON enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_unit ON lessons(unit_id);
CREATE INDEX idx_progress_user ON user_progress(user_id);
CREATE INDEX idx_progress_lesson ON user_progress(lesson_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);

-- ============================================
-- SEED DATA: Class 12 AI Course
-- ============================================
INSERT INTO courses (id, slug, title, subtitle, description, class_level, subject, lesson_count, duration, has_python, is_published)
VALUES (
  'class-12-ai',
  'class-12-ai',
  'AI Class XII',
  'Artificial Intelligence - CBSE Subject Code 843',
  'Complete AI curriculum covering Python, NumPy, Pandas, Machine Learning, Neural Networks, and more.',
  '12',
  'AI',
  14,
  '8 hours',
  true,
  true
);

-- Add units
INSERT INTO units (id, course_id, unit_number, title, page_start, page_end) VALUES
  ('unit-1', 'class-12-ai', 1, 'Introduction to AI & Python', 1, 30),
  ('unit-2', 'class-12-ai', 2, 'Data Science Fundamentals', 31, 70),
  ('unit-3', 'class-12-ai', 3, 'Machine Learning Basics', 71, 110),
  ('unit-4', 'class-12-ai', 4, 'Neural Networks & Deep Learning', 111, 140),
  ('unit-5', 'class-12-ai', 5, 'Computer Vision & NLP', 141, 170);
