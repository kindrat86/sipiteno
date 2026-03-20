-- Daily analytics email at 07:00 UTC (reports on previous day)
-- Sends visitor count, countries, and contact submissions via Resend

SELECT cron.unschedule('daily-analytics-email')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'daily-analytics-email'
);

SELECT cron.schedule(
  'daily-analytics-email',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ukqtmxbqsvhyafzxbxdg.supabase.co/functions/v1/daily-analytics',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1))
    ),
    body := '{}'::jsonb
  );
  $$
);
