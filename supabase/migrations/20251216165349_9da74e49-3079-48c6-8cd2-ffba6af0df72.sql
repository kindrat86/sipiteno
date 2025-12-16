-- Revoke public execute permissions from cleanup function
-- This function should only be called by service role (Edge Functions) or pg_cron
REVOKE ALL ON FUNCTION public.cleanup_old_rate_limits() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_old_rate_limits() FROM anon;
REVOKE ALL ON FUNCTION public.cleanup_old_rate_limits() FROM authenticated;

-- Add comment to clarify intended usage
COMMENT ON FUNCTION public.cleanup_old_rate_limits() IS 'Cleans up rate limit entries older than 24 hours. Only accessible via service role (Edge Functions) or pg_cron scheduled jobs.';