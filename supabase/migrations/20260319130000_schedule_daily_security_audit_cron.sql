-- Schedule daily security audit at 06:00 UTC
-- Uses pg_cron + pg_net to call the security-audit edge function
-- Runs 2 hours before blog generation (08:00 UTC) to catch infrastructure issues early
-- Service role auth for automated execution

-- First, unschedule if it already exists (idempotent)
SELECT cron.unschedule('run-daily-security-audit')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'run-daily-security-audit'
);

-- Schedule the daily security audit job
SELECT cron.schedule(
  'run-daily-security-audit',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ukqtmxbqsvhyafzxbxdg.supabase.co/functions/v1/security-audit',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', current_setting('supabase.service_role_key', true))
    ),
    body := '{}'::jsonb
  );
  $$
);
