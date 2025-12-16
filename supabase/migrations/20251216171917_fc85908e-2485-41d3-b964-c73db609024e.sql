-- Create blog_posts table to store generated content
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  meta_description TEXT,
  linkedin_summary TEXT,
  internal_links JSONB DEFAULT '[]',
  topic_day INTEGER,
  week_number INTEGER,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read for published posts
CREATE POLICY "Public can read published posts"
ON public.blog_posts
FOR SELECT
USING (status = 'published');

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
ON public.blog_posts
FOR ALL
USING (false)
WITH CHECK (false);

-- Create index for faster queries
CREATE INDEX idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts(created_at DESC);