import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

serve(async (req) => {
  try {
    // Check for custom date range in request body (for testing)
    let customDate: string | null = null;
    try {
      const body = await req.text();
      if (body) {
        const parsed = JSON.parse(body);
        customDate = parsed.date || null;
      }
    } catch { /* empty body is fine */ }

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setUTCDate(now.getUTCDate() - 1);
    // Use custom date or default to yesterday
    const dateStr = customDate || yesterday.toISOString().slice(0, 10);
    const nextDay = new Date(dateStr + "T00:00:00Z");
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const endDateStr = nextDay.toISOString().slice(0, 10);

    // --- 1. Cloudflare Analytics ---
    const cfToken = Deno.env.get("CF_ANALYTICS_TOKEN");
    const cfZoneId = Deno.env.get("CF_ZONE_ID");

    let totalVisitors = 0;
    let totalPageviews = 0;
    let countries: { country: string; visitors: number; requests: number }[] = [];
    let cfError = "";

    if (cfToken && cfZoneId) {
      const query = `{
        viewer {
          zones(filter: { zoneTag: "${cfZoneId}" }) {
            httpRequests1dGroups(
              filter: { date_geq: "${dateStr}", date_lt: "${endDateStr}" }
              limit: 5
            ) {
              dimensions { date }
              sum {
                requests
                pageViews
                countryMap { clientCountryName requests }
              }
              uniq { uniques }
            }
          }
        }
      }`;

      const cfResponse = await fetch("https://api.cloudflare.com/client/v4/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (cfResponse.ok) {
        const cfData = await cfResponse.json();
        const groups = cfData?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

        for (const group of groups) {
          totalPageviews += group.sum?.pageViews || 0;
          totalVisitors += group.uniq?.uniques || 0;

          const countryMap = group.sum?.countryMap || [];
          for (const entry of countryMap) {
            const code = entry.clientCountryName || "Unknown";
            const existing = countries.find(c => c.country === code);
            if (existing) {
              existing.requests += entry.requests || 0;
            } else {
              countries.push({ country: code, visitors: 0, requests: entry.requests || 0 });
            }
          }
        }

        // Sort by requests descending
        countries.sort((a, b) => b.requests - a.requests);
      } else {
        cfError = `Cloudflare API error: ${cfResponse.status}`;
        console.error(cfError, await cfResponse.text());
      }
    } else {
      cfError = "CF_ANALYTICS_TOKEN or CF_ZONE_ID not configured";
      console.error(cfError);
    }

    // --- 2. Contact Submissions ---
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: submissions, error: dbError } = await supabase
      .from("contact_submissions")
      .select("full_name, email, country, service, company_name, created_at")
      .gte("created_at", `${dateStr}T00:00:00Z`)
      .lt("created_at", `${endDateStr}T00:00:00Z`)
      .order("created_at", { ascending: false });

    if (dbError) {
      console.error("DB error:", dbError);
    }

    const submissionCount = submissions?.length || 0;

    // --- 3. Build Email ---
    const html = buildEmail(dateStr, totalVisitors, totalPageviews, countries, submissions || [], cfError);

    // --- 4. Send Email ---
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);
    const emailResult = await resend.emails.send({
      from: "Sipiteno Analytics <analytics@updates.sipiteno.com>",
      to: ["sales@sipiteno.com"],
      subject: `Daily Report ${dateStr}: ${totalVisitors} visitors, ${submissionCount} submissions`,
      html,
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return new Response(
        JSON.stringify({ status: "email_failed", error: emailResult.error, date: dateStr }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`Analytics email sent for ${dateStr}, id: ${emailResult.data?.id}`);
    return new Response(
      JSON.stringify({ status: "sent", emailId: emailResult.data?.id, date: dateStr, visitors: totalVisitors, submissions: submissionCount }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Analytics error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

function buildEmail(
  date: string,
  visitors: number,
  pageviews: number,
  countries: { country: string; visitors: number; requests: number }[],
  submissions: { full_name: string; email: string; country: string | null; service: string | null; company_name: string | null; created_at: string }[],
  cfError: string
): string {
  const countryRows = countries.slice(0, 15).map(c =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${countryName(c.country)}</td>
         <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right">${c.requests}</td></tr>`
  ).join("");

  const submissionRows = submissions.map(s =>
    `<tr><td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(s.full_name)}</td>
         <td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(s.email)}</td>
         <td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(s.country || "-")}</td>
         <td style="padding:6px 12px;border-bottom:1px solid #eee">${esc(s.service || "-")}</td></tr>`
  ).join("");

  const cfSection = cfError
    ? `<p style="color:#e53e3e;font-size:13px">${esc(cfError)}</p>`
    : `
      <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
        <tr style="background:#f7f7f7">
          <td style="padding:12px;font-size:28px;font-weight:bold;text-align:center">${visitors}</td>
          <td style="padding:12px;font-size:28px;font-weight:bold;text-align:center">${pageviews}</td>
        </tr>
        <tr style="background:#f7f7f7">
          <td style="padding:4px 12px 12px;text-align:center;color:#718096;font-size:13px">Unique Visitors</td>
          <td style="padding:4px 12px 12px;text-align:center;color:#718096;font-size:13px">Page Views</td>
        </tr>
      </table>

      ${countries.length > 0 ? `
        <h3 style="margin:16px 0 8px;font-size:15px;color:#4a5568">Top Countries</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr style="background:#f7f7f7">
            <th style="padding:8px 12px;text-align:left;font-size:13px">Country</th>
            <th style="padding:8px 12px;text-align:right;font-size:13px">Requests</th>
          </tr>
          ${countryRows}
        </table>
      ` : ""}
    `;

  const submissionsSection = submissions.length > 0
    ? `
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#f7f7f7">
          <th style="padding:8px 12px;text-align:left;font-size:13px">Name</th>
          <th style="padding:8px 12px;text-align:left;font-size:13px">Email</th>
          <th style="padding:8px 12px;text-align:left;font-size:13px">Country</th>
          <th style="padding:8px 12px;text-align:left;font-size:13px">Service</th>
        </tr>
        ${submissionRows}
      </table>
    `
    : `<p style="color:#718096">No submissions yesterday.</p>`;

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#2d3748">
      <h1 style="font-size:20px;border-bottom:2px solid #3182ce;padding-bottom:8px">
        Sipiteno Daily Report &mdash; ${date}
      </h1>

      <h2 style="font-size:16px;color:#3182ce;margin-top:24px">Website Traffic</h2>
      ${cfSection}

      <h2 style="font-size:16px;color:#3182ce;margin-top:24px">Contact Submissions (${submissions.length})</h2>
      ${submissionsSection}

      <p style="color:#a0aec0;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
        Automated daily report from Sipiteno analytics monitor.
      </p>
    </div>
  `;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function countryName(code: string): string {
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(code);
    return name || code;
  } catch {
    return code;
  }
}
