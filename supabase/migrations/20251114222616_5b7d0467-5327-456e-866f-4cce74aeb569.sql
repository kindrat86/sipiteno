-- Create table for rate limiting contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_rate_limit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  submission_count INTEGER NOT NULL DEFAULT 1,
  first_submission_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_submission_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_ip ON public.contact_rate_limit(ip_address);
CREATE INDEX IF NOT EXISTS idx_contact_rate_limit_last_submission ON public.contact_rate_limit(last_submission_at);

-- Enable RLS
ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;

-- No public access - only edge functions can access this table
CREATE POLICY "Service role only access" ON public.contact_rate_limit
  FOR ALL
  USING (false);

-- Clean up old entries (older than 24 hours) periodically
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limit
  WHERE last_submission_at < (now() - interval '24 hours');
END;
$$;