-- Create a table to store contact form submissions for reliability
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  service TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert (Edge Function uses service role)
-- This restrictive policy blocks direct client access
CREATE POLICY "Service role insert only" ON public.contact_submissions
  FOR INSERT
  WITH CHECK (false);

-- Policy: Only authenticated admins can view submissions
CREATE POLICY "Authenticated users can view submissions" ON public.contact_submissions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Add index for faster queries by date
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);