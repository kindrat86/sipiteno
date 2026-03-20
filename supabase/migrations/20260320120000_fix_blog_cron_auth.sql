-- Fix: pg_cron cannot access current_setting('supabase.service_role_key')
-- because that GUC is only available in Edge Function runtime, not in pg_cron sessions.
-- Solution: Read the service role key from Supabase Vault instead.
--
-- PREREQUISITE: Store your service role key in Vault by running in SQL Editor:
--   SELECT vault.create_secret('YOUR_SERVICE_ROLE_KEY_HERE', 'service_role_key');

-- Unschedule the broken cron job
SELECT cron.unschedule('generate-daily-blog-post')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'generate-daily-blog-post'
);

-- Re-schedule with Vault-based auth
SELECT cron.schedule(
  'generate-daily-blog-post',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ukqtmxbqsvhyafzxbxdg.supabase.co/functions/v1/generate-blog-post',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1))
    ),
    body := '{}'::jsonb
  );
  $$
);
