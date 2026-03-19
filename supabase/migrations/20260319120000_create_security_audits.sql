-- Create security audit tables for daily automated security monitoring
-- Follows the same pattern as blog_posts and contact_submissions

-- Severity and status enums
CREATE TYPE public.audit_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
CREATE TYPE public.audit_status AS ENUM ('open', 'acknowledged', 'resolved', 'wont_fix');

-- Audit runs table - one row per daily execution
CREATE TABLE public.security_audit_runs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at timestamp with time zone NOT NULL DEFAULT now(),
    completed_at timestamp with time zone,
    total_findings integer DEFAULT 0,
    critical_count integer DEFAULT 0,
    high_count integer DEFAULT 0,
    medium_count integer DEFAULT 0,
    low_count integer DEFAULT 0,
    info_count integer DEFAULT 0,
    status text NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
    error_message text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Individual findings table
CREATE TABLE public.security_audits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id uuid NOT NULL REFERENCES public.security_audit_runs(id) ON DELETE CASCADE,
    check_name text NOT NULL,
    severity audit_severity NOT NULL DEFAULT 'info',
    title text NOT NULL,
    description text,
    details jsonb DEFAULT '{}'::jsonb,
    status audit_status NOT NULL DEFAULT 'open',
    resolved_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on both tables
ALTER TABLE public.security_audit_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audits ENABLE ROW LEVEL SECURITY;

-- Admins can view audit runs
CREATE POLICY "Admins can view audit runs"
ON public.security_audit_runs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view audit findings
CREATE POLICY "Admins can view audits"
ON public.security_audits
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update finding status (acknowledge, resolve, etc.)
CREATE POLICY "Admins can update audits"
ON public.security_audits
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for efficient queries
CREATE INDEX idx_security_audits_run_id ON public.security_audits(run_id);
CREATE INDEX idx_security_audits_severity ON public.security_audits(severity);
CREATE INDEX idx_security_audits_status ON public.security_audits(status);
CREATE INDEX idx_security_audits_created_at ON public.security_audits(created_at DESC);
CREATE INDEX idx_security_audit_runs_created_at ON public.security_audit_runs(created_at DESC);

-- Helper function: check RLS is enabled on all public tables
CREATE OR REPLACE FUNCTION public.check_rls_enabled()
RETURNS TABLE(table_name text, rls_enabled boolean, policy_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT
        t.tablename::text AS table_name,
        t.rowsecurity AS rls_enabled,
        COALESCE(p.policy_count, 0) AS policy_count
    FROM pg_tables t
    LEFT JOIN (
        SELECT tablename, COUNT(*) AS policy_count
        FROM pg_policies
        WHERE schemaname = 'public'
        GROUP BY tablename
    ) p ON t.tablename = p.tablename
    WHERE t.schemaname = 'public';
$$;
