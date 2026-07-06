-- Soap Opera Sequence subscriber table (Brunson DotCom Secrets Ch 7)
-- Tracks lead progression through the 5-email follow-up sequence

CREATE TABLE IF NOT EXISTS public.soap_opera_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT DEFAULT 'playbook',
  current_step INTEGER NOT NULL DEFAULT 0,
  next_email_due_at TIMESTAMPTZ,
  last_email_sent_at TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.soap_opera_subscribers ENABLE ROW LEVEL SECURITY;

-- Only the service role (edge functions) can read/write
CREATE POLICY "Service role full access" ON public.soap_opera_subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Index for the cron query (find due subscribers)
CREATE INDEX idx_soap_opa_due ON public.soap_opera_subscribers (next_email_due_at)
  WHERE next_email_due_at IS NOT NULL;

-- Schedule the sequence to run hourly via pg_cron
-- Checks for subscribers whose next_email_due_at <= now()
SELECT cron.schedule(
  'soap-opera-sequence-hourly',
  '0 * * * *',
  $$
    SELECT net.http_post(
      url := 'https://sipiteno.com/functions/v1/soap-opera-sequence',
      headers := '{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"}'::jsonb,
      body := '{}'::jsonb
    );
  $$
);
