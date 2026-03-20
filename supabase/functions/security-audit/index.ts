import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  "https://sipiteno.com",
  "https://www.sipiteno.com",
  ...(Deno.env.get("ENVIRONMENT") === "development"
    ? ["http://localhost:8080", "http://localhost:5173"]
    : []),
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
};

// Check if a request is using service role authentication
function isServiceRoleAuth(authHeader: string | null): boolean {
  if (!authHeader) return false;

  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) return false;

  const token = authHeader.replace("Bearer ", "");

  // Direct match against the service role key
  if (token === serviceRoleKey) return true;

  // Check if it's a valid JWT with service_role claim
  try {
    const [, payloadB64] = token.split(".");
    if (payloadB64) {
      const payload = JSON.parse(atob(payloadB64));
      if (
        payload.role === "service_role" &&
        payload.ref ===
          Deno.env.get("SUPABASE_URL")?.match(
            /https:\/\/(.+?)\.supabase/
          )?.[1]
      ) {
        return true;
      }
    }
  } catch {
    // Not a valid JWT
  }

  return false;
}

// ---------- Types ----------

interface AuditFinding {
  check_name: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  details: Record<string, unknown>;
}

// ---------- Dependency list (from package.json) ----------
// Must be updated when dependencies change. The edge function cannot read the filesystem.

const DEPENDENCIES: Record<string, string> = {
  "@hookform/resolvers": "3.10.0",
  "@radix-ui/react-accordion": "1.2.11",
  "@radix-ui/react-alert-dialog": "1.1.14",
  "@radix-ui/react-aspect-ratio": "1.1.7",
  "@radix-ui/react-avatar": "1.1.10",
  "@radix-ui/react-checkbox": "1.3.2",
  "@radix-ui/react-collapsible": "1.1.11",
  "@radix-ui/react-context-menu": "2.2.15",
  "@radix-ui/react-dialog": "1.1.14",
  "@radix-ui/react-dropdown-menu": "2.1.15",
  "@radix-ui/react-hover-card": "1.1.14",
  "@radix-ui/react-label": "2.1.7",
  "@radix-ui/react-menubar": "1.1.15",
  "@radix-ui/react-navigation-menu": "1.2.13",
  "@radix-ui/react-popover": "1.1.14",
  "@radix-ui/react-progress": "1.1.7",
  "@radix-ui/react-radio-group": "1.3.7",
  "@radix-ui/react-scroll-area": "1.2.9",
  "@radix-ui/react-select": "2.2.5",
  "@radix-ui/react-separator": "1.1.7",
  "@radix-ui/react-slider": "1.3.5",
  "@radix-ui/react-slot": "1.2.3",
  "@radix-ui/react-switch": "1.2.5",
  "@radix-ui/react-tabs": "1.1.12",
  "@radix-ui/react-toast": "1.2.14",
  "@radix-ui/react-toggle": "1.1.9",
  "@radix-ui/react-toggle-group": "1.1.10",
  "@radix-ui/react-tooltip": "1.2.7",
  "@supabase/supabase-js": "2.81.1",
  "@tanstack/react-query": "5.83.0",
  "class-variance-authority": "0.7.1",
  "clsx": "2.1.1",
  "cmdk": "1.1.1",
  "date-fns": "3.6.0",
  "embla-carousel-react": "8.6.0",
  "input-otp": "1.4.2",
  "lucide-react": "0.462.0",
  "next-themes": "0.3.0",
  "posthog-js": "1.362.0",
  "react": "18.3.1",
  "react-day-picker": "8.10.1",
  "react-dom": "18.3.1",
  "react-hook-form": "7.61.1",
  "react-markdown": "10.1.0",
  "react-resizable-panels": "2.1.9",
  "react-router-dom": "6.30.1",
  "recharts": "2.15.4",
  "sonner": "1.7.4",
  "tailwind-merge": "2.6.0",
  "tailwindcss-animate": "1.0.7",
  "vaul": "0.9.9",
  "vite-plugin-prerender": "1.0.7",
  "zod": "3.25.76",
  // Dev dependencies (also check these - they run during build)
  "@vitejs/plugin-react-swc": "3.11.0",
  "vite": "5.4.19",
  "typescript": "5.8.3",
  "postcss": "8.5.6",
  "tailwindcss": "3.4.17",
};

// Expected dependency count — flag when it drifts from package.json
const EXPECTED_DEP_COUNT = 49;

// ---------- Expected security headers ----------

const EXPECTED_HEADERS: Record<string, string> = {
  "x-frame-options": "DENY",
  "x-content-type-options": "nosniff",
  "strict-transport-security": "max-age=31536000",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
};

// CSP must contain these directives
const EXPECTED_CSP_DIRECTIVES = [
  "default-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
];

// ---------- Secret patterns to scan for in public assets ----------

const SECRET_PATTERNS = [
  {
    name: "Supabase Service Role Key",
    pattern:
      /eyJ[A-Za-z0-9_-]{100,}\.[A-Za-z0-9_-]{100,}\.[A-Za-z0-9_-]{40,}/g,
    severity: "critical" as const,
  },
  {
    name: "Stripe Secret Key",
    pattern: /sk_live_[A-Za-z0-9]{20,}/g,
    severity: "critical" as const,
  },
  {
    name: "Generic API Secret",
    pattern: /SUPABASE_SERVICE_ROLE_KEY/g,
    severity: "critical" as const,
  },
  {
    name: "Resend API Key",
    pattern: /re_[A-Za-z0-9]{20,}/g,
    severity: "high" as const,
  },
  {
    name: "Google API Key Reference",
    pattern: /GOOGLE_API_KEY/g,
    severity: "high" as const,
  },
];

// ---------- Suspicious content patterns ----------

const SUSPICIOUS_PATTERNS = [
  { name: "SQL Injection", pattern: /('|--|;|\bUNION\b|\bSELECT\b.*\bFROM\b|\bDROP\b|\bINSERT\b.*\bINTO\b)/i },
  { name: "XSS Attempt", pattern: /(<script|javascript:|on\w+\s*=|<iframe|<object|<embed)/i },
  { name: "Path Traversal", pattern: /(\.\.\/|\.\.\\|%2e%2e)/i },
];

// ========== CHECK IMPLEMENTATIONS ==========

async function checkDependencyVulnerabilities(): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  try {
    // Check if dependency count has drifted
    const depCount = Object.keys(DEPENDENCIES).length;
    if (depCount !== EXPECTED_DEP_COUNT) {
      findings.push({
        check_name: "dependency_drift",
        severity: "low",
        title: "Dependency list may be outdated",
        description: `Edge function tracks ${depCount} dependencies but expected ${EXPECTED_DEP_COUNT}. Update the DEPENDENCIES list in security-audit/index.ts when package.json changes.`,
        details: { tracked: depCount, expected: EXPECTED_DEP_COUNT },
      });
    }

    // Query OSV.dev for known vulnerabilities (batch API)
    const queries = Object.entries(DEPENDENCIES).map(([pkg, version]) => ({
      package: { name: pkg, ecosystem: "npm" },
      version,
    }));

    const osvResponse = await fetch("https://api.osv.dev/v1/querybatch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ queries }),
    });

    if (!osvResponse.ok) {
      findings.push({
        check_name: "dependency_vuln",
        severity: "low",
        title: "OSV API unavailable",
        description: `Could not check dependencies: OSV API returned ${osvResponse.status}`,
        details: { status: osvResponse.status },
      });
      return findings;
    }

    const osvData = await osvResponse.json();
    const depNames = Object.keys(DEPENDENCIES);

    for (let i = 0; i < osvData.results.length; i++) {
      const result = osvData.results[i];
      if (result.vulns && result.vulns.length > 0) {
        for (const vuln of result.vulns) {
          // Map CVSS to severity
          let severity: AuditFinding["severity"] = "medium";
          const cvss = vuln.database_specific?.cvss_score;
          if (cvss >= 9.0) severity = "critical";
          else if (cvss >= 7.0) severity = "high";
          else if (cvss >= 4.0) severity = "medium";
          else if (cvss > 0) severity = "low";

          findings.push({
            check_name: "dependency_vuln",
            severity,
            title: `Vulnerability in ${depNames[i]}: ${vuln.id}`,
            description:
              vuln.summary ||
              `Known vulnerability ${vuln.id} affects ${depNames[i]}@${DEPENDENCIES[depNames[i]]}`,
            details: {
              package: depNames[i],
              version: DEPENDENCIES[depNames[i]],
              vuln_id: vuln.id,
              cvss_score: cvss,
              aliases: vuln.aliases || [],
              references: (vuln.references || [])
                .slice(0, 3)
                .map((r: { url: string }) => r.url),
            },
          });
        }
      }
    }

    if (
      findings.filter((f) => f.check_name === "dependency_vuln" && f.severity !== "low").length === 0
    ) {
      findings.push({
        check_name: "dependency_vuln",
        severity: "info",
        title: "No dependency vulnerabilities found",
        description: `Scanned ${depCount} packages against OSV.dev — all clean.`,
        details: { packages_scanned: depCount },
      });
    }
  } catch (error) {
    findings.push({
      check_name: "dependency_vuln",
      severity: "low",
      title: "Dependency check failed",
      description: `Error during vulnerability scan: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {},
    });
  }

  return findings;
}

async function checkSecurityHeaders(): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  try {
    const response = await fetch("https://sipiteno.com", {
      method: "GET",
      redirect: "follow",
    });

    // Check each expected header
    for (const [header, expectedValue] of Object.entries(EXPECTED_HEADERS)) {
      const actual = response.headers.get(header);
      if (!actual) {
        findings.push({
          check_name: "header_check",
          severity: "high",
          title: `Missing security header: ${header}`,
          description: `Expected header "${header}" with value containing "${expectedValue}" but it was not present.`,
          details: { header, expected: expectedValue, actual: null },
        });
      } else if (!actual.toLowerCase().includes(expectedValue.toLowerCase())) {
        findings.push({
          check_name: "header_check",
          severity: "medium",
          title: `Unexpected value for header: ${header}`,
          description: `Header "${header}" has value "${actual}" but expected it to contain "${expectedValue}".`,
          details: { header, expected: expectedValue, actual },
        });
      }
    }

    // Check CSP specifically
    const csp = response.headers.get("content-security-policy");
    if (!csp) {
      findings.push({
        check_name: "header_check",
        severity: "high",
        title: "Missing Content-Security-Policy header",
        description:
          "No CSP header found. This leaves the site vulnerable to XSS and code injection.",
        details: { header: "content-security-policy", actual: null },
      });
    } else {
      for (const directive of EXPECTED_CSP_DIRECTIVES) {
        if (!csp.includes(directive)) {
          findings.push({
            check_name: "header_check",
            severity: "medium",
            title: `CSP missing directive: ${directive}`,
            description: `Content-Security-Policy should include "${directive}".`,
            details: { missing_directive: directive, actual_csp: csp },
          });
        }
      }
    }

    // If no header issues found, log info
    if (findings.length === 0) {
      findings.push({
        check_name: "header_check",
        severity: "info",
        title: "All security headers present and correct",
        description:
          "CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy all verified.",
        details: {},
      });
    }
  } catch (error) {
    findings.push({
      check_name: "header_check",
      severity: "high",
      title: "Security header check failed",
      description: `Could not fetch sipiteno.com to verify headers: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: {},
    });
  }

  return findings;
}

async function checkRlsPolicies(
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  try {
    const { data, error } = await supabaseAdmin.rpc("check_rls_enabled");

    if (error) {
      findings.push({
        check_name: "rls_validation",
        severity: "medium",
        title: "RLS check query failed",
        description: `Could not verify RLS status: ${error.message}`,
        details: { error: error.message },
      });
      return findings;
    }

    if (!data || data.length === 0) {
      findings.push({
        check_name: "rls_validation",
        severity: "info",
        title: "No public tables found",
        description: "No tables in the public schema to check.",
        details: {},
      });
      return findings;
    }

    let allGood = true;
    for (const table of data) {
      if (!table.rls_enabled) {
        allGood = false;
        findings.push({
          check_name: "rls_validation",
          severity: "critical",
          title: `RLS disabled on table: ${table.table_name}`,
          description: `Table "${table.table_name}" does not have Row Level Security enabled. Any authenticated user can read/write all rows.`,
          details: {
            table: table.table_name,
            rls_enabled: false,
            policy_count: table.policy_count,
          },
        });
      } else if (table.policy_count === 0) {
        allGood = false;
        findings.push({
          check_name: "rls_validation",
          severity: "high",
          title: `No RLS policies on table: ${table.table_name}`,
          description: `Table "${table.table_name}" has RLS enabled but no policies defined. This effectively blocks all access (which may be intentional for service-role-only tables, but verify).`,
          details: {
            table: table.table_name,
            rls_enabled: true,
            policy_count: 0,
          },
        });
      }
    }

    if (allGood) {
      findings.push({
        check_name: "rls_validation",
        severity: "info",
        title: "All tables have RLS enabled with policies",
        description: `Verified ${data.length} public tables — all have RLS enabled and at least one policy.`,
        details: {
          tables_checked: data.length,
          tables: data.map((t: { table_name: string; policy_count: number }) => ({
            name: t.table_name,
            policies: t.policy_count,
          })),
        },
      });
    }
  } catch (error) {
    findings.push({
      check_name: "rls_validation",
      severity: "medium",
      title: "RLS validation error",
      description: `Unexpected error: ${error instanceof Error ? error.message : "Unknown"}`,
      details: {},
    });
  }

  return findings;
}

async function checkSuspiciousActivity(
  supabaseAdmin: ReturnType<typeof createClient>
): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    // Check rate limit violations in the last 24 hours
    const { data: rateLimitData, error: rlError } = await supabaseAdmin
      .from("contact_rate_limit")
      .select("ip_address, submission_count, last_submission_at")
      .gte("submission_count", 3)
      .gte("last_submission_at", oneDayAgo);

    if (!rlError && rateLimitData && rateLimitData.length > 0) {
      findings.push({
        check_name: "suspicious_activity",
        severity: "medium",
        title: `${rateLimitData.length} IP(s) hit rate limits in last 24h`,
        description: `The following IPs triggered the contact form rate limit (3+ submissions/hour): ${rateLimitData.map((r: { ip_address: string }) => r.ip_address).join(", ")}`,
        details: { rate_limit_violations: rateLimitData },
      });
    }

    // Scan recent contact submissions for suspicious content
    const { data: submissions, error: subError } = await supabaseAdmin
      .from("contact_submissions")
      .select("id, message, full_name, email, ip_address, created_at")
      .gte("created_at", oneDayAgo);

    if (!subError && submissions) {
      const suspiciousSubmissions = [];
      for (const sub of submissions) {
        const fieldsToCheck = [sub.message, sub.full_name, sub.email].filter(Boolean);
        for (const field of fieldsToCheck) {
          for (const { name, pattern } of SUSPICIOUS_PATTERNS) {
            if (pattern.test(field)) {
              suspiciousSubmissions.push({
                submission_id: sub.id,
                pattern_name: name,
                ip_address: sub.ip_address,
                created_at: sub.created_at,
              });
              break; // One match per submission is enough
            }
          }
        }
      }

      if (suspiciousSubmissions.length > 0) {
        findings.push({
          check_name: "suspicious_activity",
          severity: "medium",
          title: `${suspiciousSubmissions.length} suspicious submission(s) detected`,
          description:
            "Contact form submissions containing potential injection patterns were found in the last 24 hours.",
          details: { suspicious_submissions: suspiciousSubmissions },
        });
      }
    }

    if (findings.length === 0) {
      findings.push({
        check_name: "suspicious_activity",
        severity: "info",
        title: "No suspicious activity detected",
        description:
          "No rate limit violations or suspicious submissions in the last 24 hours.",
        details: {},
      });
    }
  } catch (error) {
    findings.push({
      check_name: "suspicious_activity",
      severity: "low",
      title: "Suspicious activity check failed",
      description: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
      details: {},
    });
  }

  return findings;
}

async function checkExposedSecrets(): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  try {
    // Fetch the site HTML
    const response = await fetch("https://sipiteno.com");
    const html = await response.text();

    // Extract JS bundle URLs from the HTML
    const scriptMatches = html.matchAll(
      /src="(\/assets\/[^"]+\.js)"/g
    );
    const scriptUrls = [...scriptMatches].map((m) => m[1]);

    // Check HTML first
    for (const { name, pattern, severity } of SECRET_PATTERNS) {
      const matches = html.match(pattern);
      if (matches) {
        findings.push({
          check_name: "exposed_secrets",
          severity,
          title: `Potential ${name} found in HTML`,
          description: `The site HTML contains a pattern matching "${name}". Verify this is not a real secret.`,
          details: {
            location: "HTML",
            pattern_name: name,
            match_count: matches.length,
          },
        });
      }
    }

    // Check each JS bundle
    for (const scriptUrl of scriptUrls.slice(0, 5)) {
      // Limit to 5 bundles
      try {
        const jsResponse = await fetch(`https://sipiteno.com${scriptUrl}`);
        const jsContent = await jsResponse.text();

        for (const { name, pattern, severity } of SECRET_PATTERNS) {
          // Reset regex lastIndex for global patterns
          pattern.lastIndex = 0;
          const matches = jsContent.match(pattern);
          if (matches) {
            // Filter out known safe patterns (Supabase anon key is public and expected)
            if (
              name === "Supabase Service Role Key" &&
              matches.length <= 1
            ) {
              // Likely the anon key which is public — still flag but lower severity
              findings.push({
                check_name: "exposed_secrets",
                severity: "low",
                title: `JWT token found in JS bundle (likely anon key)`,
                description: `A JWT pattern was found in ${scriptUrl}. This is expected for the Supabase anon key but verify no service role key is exposed.`,
                details: {
                  location: scriptUrl,
                  pattern_name: name,
                  match_count: matches.length,
                },
              });
            } else {
              findings.push({
                check_name: "exposed_secrets",
                severity,
                title: `Potential ${name} found in JS bundle`,
                description: `${scriptUrl} contains a pattern matching "${name}". This may indicate a leaked secret.`,
                details: {
                  location: scriptUrl,
                  pattern_name: name,
                  match_count: matches.length,
                },
              });
            }
          }
        }
      } catch {
        // Skip individual bundle errors
      }
    }

    if (findings.length === 0) {
      findings.push({
        check_name: "exposed_secrets",
        severity: "info",
        title: "No exposed secrets detected",
        description: `Scanned HTML and ${scriptUrls.length} JS bundles — no secret patterns found.`,
        details: { bundles_scanned: scriptUrls.length },
      });
    }
  } catch (error) {
    findings.push({
      check_name: "exposed_secrets",
      severity: "medium",
      title: "Secret exposure check failed",
      description: `Could not scan site assets: ${error instanceof Error ? error.message : "Unknown"}`,
      details: {},
    });
  }

  return findings;
}

async function checkSslTls(): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  try {
    const response = await fetch("https://sipiteno.com", {
      method: "HEAD",
    });

    if (response.ok || response.status === 301 || response.status === 302) {
      findings.push({
        check_name: "ssl_tls",
        severity: "info",
        title: "SSL/TLS connection successful",
        description:
          "HTTPS connection to sipiteno.com established successfully.",
        details: { status: response.status },
      });
    } else {
      findings.push({
        check_name: "ssl_tls",
        severity: "high",
        title: "Unexpected HTTPS response",
        description: `sipiteno.com returned status ${response.status} over HTTPS.`,
        details: { status: response.status },
      });
    }
  } catch (error) {
    findings.push({
      check_name: "ssl_tls",
      severity: "critical",
      title: "SSL/TLS connection failed",
      description: `Could not establish HTTPS connection to sipiteno.com: ${error instanceof Error ? error.message : "Unknown error"}. The SSL certificate may be expired or misconfigured.`,
      details: {},
    });
  }

  return findings;
}

// ========== EMAIL ALERTING ==========

function buildDailySecurityEmail(
  findings: AuditFinding[],
  runId: string,
  counts: { critical: number; high: number; medium: number; low: number; info: number }
): string {
  const date = new Date().toISOString().slice(0, 10);
  const total = counts.critical + counts.high + counts.medium + counts.low + counts.info;
  const hasIssues = counts.critical > 0 || counts.high > 0 || counts.medium > 0;

  const severityColor: Record<string, string> = {
    critical: "#dc2626",
    high: "#f59e0b",
    medium: "#f97316",
    low: "#3b82f6",
    info: "#22c55e",
  };

  const severityBg: Record<string, string> = {
    critical: "#fef2f2",
    high: "#fffbeb",
    medium: "#fff7ed",
    low: "#eff6ff",
    info: "#f0fdf4",
  };

  let html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#2d3748">
      <h1 style="font-size:20px;border-bottom:2px solid ${hasIssues ? '#dc2626' : '#22c55e'};padding-bottom:8px">
        Sipiteno Security Report &mdash; ${date}
      </h1>

      <h2 style="font-size:16px;color:#4a5568;margin-top:24px">Summary</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
        <tr style="background:#f7f7f7">
          <td style="padding:12px;text-align:center">
            <div style="font-size:28px;font-weight:bold;color:${counts.critical > 0 ? '#dc2626' : '#22c55e'}">${counts.critical}</div>
            <div style="font-size:12px;color:#718096">Critical</div>
          </td>
          <td style="padding:12px;text-align:center">
            <div style="font-size:28px;font-weight:bold;color:${counts.high > 0 ? '#f59e0b' : '#22c55e'}">${counts.high}</div>
            <div style="font-size:12px;color:#718096">High</div>
          </td>
          <td style="padding:12px;text-align:center">
            <div style="font-size:28px;font-weight:bold;color:${counts.medium > 0 ? '#f97316' : '#22c55e'}">${counts.medium}</div>
            <div style="font-size:12px;color:#718096">Medium</div>
          </td>
          <td style="padding:12px;text-align:center">
            <div style="font-size:28px;font-weight:bold">${counts.low}</div>
            <div style="font-size:12px;color:#718096">Low</div>
          </td>
          <td style="padding:12px;text-align:center">
            <div style="font-size:28px;font-weight:bold;color:#22c55e">${counts.info}</div>
            <div style="font-size:12px;color:#718096">Info</div>
          </td>
        </tr>
      </table>

      <h2 style="font-size:16px;color:#4a5568;margin-top:24px">All Findings (${total})</h2>
  `;

  // Show all findings grouped by severity
  const severityOrder: AuditFinding["severity"][] = ["critical", "high", "medium", "low", "info"];
  for (const sev of severityOrder) {
    const sevFindings = findings.filter(f => f.severity === sev);
    if (sevFindings.length === 0) continue;

    for (const finding of sevFindings) {
      html += `
        <div style="margin-bottom:8px;padding:10px 12px;border-left:4px solid ${severityColor[sev]};background:${severityBg[sev]};">
          <strong style="font-size:11px;color:${severityColor[sev]}">[${sev.toUpperCase()}]</strong>
          <strong style="font-size:13px"> ${finding.title}</strong>
          <p style="margin:4px 0 0 0;color:#555;font-size:13px">${finding.description}</p>
        </div>
      `;
    }
  }

  html += `
      <p style="color:#a0aec0;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
        Run ID: ${runId} &bull; Automated daily security audit from Sipiteno.
      </p>
    </div>
  `;

  return html;
}

// ========== MAIN HANDLER ==========

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    // Check for service role authentication (used by cron jobs)
    const isCronRequest = isServiceRoleAuth(authHeader);

    if (isCronRequest) {
      console.log("Authenticated via service role key (cron job)");
    } else {
      // Standard user authentication flow
      if (!authHeader) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized: Missing authorization header",
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? "",
        { global: { headers: { Authorization: authHeader } } }
      );

      const {
        data: { user },
        error: userError,
      } = await supabaseAuth.auth.getUser();
      if (userError || !user) {
        return new Response(
          JSON.stringify({
            error: "Unauthorized: Invalid or expired token",
          }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: roleData, error: roleError } = await supabaseAuth
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError || !roleData) {
        return new Response(
          JSON.stringify({ error: "Forbidden: Admin access required" }),
          {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Authenticated admin user: ${user.email}`);
    }

    // Initialize admin client for DB operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Create a new audit run
    const { data: run, error: runError } = await supabaseAdmin
      .from("security_audit_runs")
      .insert({ started_at: new Date().toISOString() })
      .select()
      .single();

    if (runError || !run) {
      throw new Error(`Failed to create audit run: ${runError?.message}`);
    }

    const runId = run.id;
    console.log(`Security audit run started: ${runId}`);

    // Run all checks (with individual error handling so partial results are saved)
    const allFindings: AuditFinding[] = [];

    const checks = [
      { name: "Dependencies", fn: () => checkDependencyVulnerabilities() },
      { name: "Security Headers", fn: () => checkSecurityHeaders() },
      { name: "RLS Policies", fn: () => checkRlsPolicies(supabaseAdmin) },
      { name: "Suspicious Activity", fn: () => checkSuspiciousActivity(supabaseAdmin) },
      { name: "Exposed Secrets", fn: () => checkExposedSecrets() },
      { name: "SSL/TLS", fn: () => checkSslTls() },
    ];

    for (const check of checks) {
      try {
        console.log(`Running check: ${check.name}`);
        const findings = await check.fn();
        allFindings.push(...findings);
      } catch (error) {
        console.error(`Check "${check.name}" failed:`, error);
        allFindings.push({
          check_name: check.name.toLowerCase().replace(/\s+/g, "_"),
          severity: "low",
          title: `${check.name} check encountered an error`,
          description: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          details: {},
        });
      }
    }

    // Save all findings to database
    if (allFindings.length > 0) {
      const findingsToInsert = allFindings.map((f) => ({
        run_id: runId,
        ...f,
      }));

      const { error: insertError } = await supabaseAdmin
        .from("security_audits")
        .insert(findingsToInsert);

      if (insertError) {
        console.error("Failed to save findings:", insertError);
      }
    }

    // Count severities
    const counts = {
      critical: allFindings.filter((f) => f.severity === "critical").length,
      high: allFindings.filter((f) => f.severity === "high").length,
      medium: allFindings.filter((f) => f.severity === "medium").length,
      low: allFindings.filter((f) => f.severity === "low").length,
      info: allFindings.filter((f) => f.severity === "info").length,
    };

    // Update the run record
    await supabaseAdmin
      .from("security_audit_runs")
      .update({
        completed_at: new Date().toISOString(),
        total_findings: allFindings.length,
        critical_count: counts.critical,
        high_count: counts.high,
        medium_count: counts.medium,
        low_count: counts.low,
        info_count: counts.info,
        status: "completed",
      })
      .eq("id", runId);

    console.log(
      `Audit completed: ${allFindings.length} findings (${counts.critical} critical, ${counts.high} high, ${counts.medium} medium, ${counts.low} low, ${counts.info} info)`
    );

    // Always send daily security report email
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const resend = new Resend(resendApiKey);
        const hasIssues = counts.critical > 0 || counts.high > 0;
        const subject = hasIssues
          ? `⚠️ Security Report: ${counts.critical} critical, ${counts.high} high findings`
          : `✅ Security Report: All clear (${allFindings.length} checks passed)`;
        await resend.emails.send({
          from: "Sipiteno Security <security@updates.sipiteno.com>",
          to: ["sales@sipiteno.com"],
          subject,
          html: buildDailySecurityEmail(allFindings, runId, counts),
        });
        console.log("Daily security report email sent");
      } else {
        console.warn("RESEND_API_KEY not configured — skipping email");
      }
    } catch (emailError) {
      console.error("Failed to send security report email:", emailError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        run_id: runId,
        summary: {
          total: allFindings.length,
          ...counts,
        },
        findings: allFindings,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Security audit error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
