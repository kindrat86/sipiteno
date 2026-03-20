-- Check daily at 09:00 UTC (1 hour after blog generation) if a post was published
-- Sends email alert via Resend if no post found

SELECT cron.unschedule('check-daily-blog-published')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-daily-blog-published'
);

SELECT cron.schedule(
  'check-daily-blog-published',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ukqtmxbqsvhyafzxbxdg.supabase.co/functions/v1/check-blog-published',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1))
    ),
    body := '{}'::jsonb
  );
  $$
);
