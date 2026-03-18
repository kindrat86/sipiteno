-- Schedule daily blog post generation at 08:00 UTC
-- Uses pg_cron + pg_net to call the generate-blog-post edge function
-- The edge function auto-calculates the current day in the 15-topic cycle
-- Service role auth triggers auto-publish (status = 'published')

-- First, unschedule if it already exists (idempotent)
SELECT cron.unschedule('generate-daily-blog-post')
WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'generate-daily-blog-post'
);

-- Schedule the daily blog generation job
SELECT cron.schedule(
  'generate-daily-blog-post',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://ukqtmxbqsvhyafzxbxdg.supabase.co/functions/v1/generate-blog-post',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', concat('Bearer ', current_setting('supabase.service_role_key', true))
    ),
    body := '{}'::jsonb
  );
  $$
);
