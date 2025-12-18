-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Courses Table
create table public.courses (
    id text primary key,
    title text not null,
    description text,
    thumbnail_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Lessons Table
create table public.lessons (
    id text primary key, -- Keeping text id (e.g., 'lesson01') for now to match JSON, or can switch to UUID
    course_id text references public.courses(id) not null,
    lesson_number int not null,
    title text not null,
    unit_title text,
    video_id text,
    is_published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Content Blocks (Polymorphic content)
create table public.content_blocks (
    id uuid default uuid_generate_v4() primary key,
    lesson_id text references public.lessons(id) on delete cascade not null,
    order_index int not null,
    type text not null check (type in ('text', 'code', 'image', 'diagram', 'warning', 'tip')),
    content text, -- Markdown text or Code string
    meta_data jsonb default '{}'::jsonb, -- Store image_url, code_language, etc.
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Questions (Question Bank)
create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    lesson_id text references public.lessons(id), -- Optional, can be null for global bank
    text text not null,
    type text not null check (type in ('multiple_choice', 'short_answer')),
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    tags text[],
    options jsonb, -- Array of strings for MCQ options
    correct_answer text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Security)
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.content_blocks enable row level security;
alter table public.questions enable row level security;

-- Public Read Access
create policy "Allow public read access" on public.courses for select using (true);
create policy "Allow public read access" on public.lessons for select using (true);
create policy "Allow public read access" on public.content_blocks for select using (true);
create policy "Allow public read access" on public.questions for select using (true);

-- Admin Write Access (Update with specific admin email or role if using Supabase Auth)
-- For now, allowing all authenticated users to write checks logic in App, 
-- but in production this should be restricted to admin email.
create policy "Allow admin write access" on public.courses for all using (auth.jwt() ->> 'email' = 'aakash.mufc@gmail.com');
create policy "Allow admin write access" on public.lessons for all using (auth.jwt() ->> 'email' = 'aakash.mufc@gmail.com');
create policy "Allow admin write access" on public.content_blocks for all using (auth.jwt() ->> 'email' = 'aakash.mufc@gmail.com');
create policy "Allow admin write access" on public.questions for all using (auth.jwt() ->> 'email' = 'aakash.mufc@gmail.com');
