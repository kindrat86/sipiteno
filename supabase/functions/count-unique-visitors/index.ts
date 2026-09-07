import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Allow custom date via request body, default to today (UTC)
    let dateStr: string;
    try {
      const body = await req.text();
      if (body) {
        const parsed = JSON.parse(body);
        dateStr = parsed.date || new Date().toISOString().slice(0, 10);
      } else {
        dateStr = new Date().toISOString().slice(0, 10);
      }
    } catch {
      dateStr = new Date().toISOString().slice(0, 10);
    }

    const nextDay = new Date(dateStr + "T00:00:00Z");
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    const endDateStr = nextDay.toISOString().slice(0, 10);

    const cfToken = Deno.env.get("CF_ANALYTICS_TOKEN");
    const cfZoneId = Deno.env.get("CF_ZONE_ID");

    if (!cfToken || !cfZoneId) {
      return new Response(
        JSON.stringify({ error: "CF_ANALYTICS_TOKEN or CF_ZONE_ID not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const query = `{
      viewer {
        zones(filter: { zoneTag: "${cfZoneId}" }) {
          httpRequests1dGroups(
            filter: { date_geq: "${dateStr}", date_lt: "${endDateStr}" }
            limit: 5
          ) {
            dimensions { date }
            sum { pageViews }
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

    if (!cfResponse.ok) {
      const errorText = await cfResponse.text();
      return new Response(
        JSON.stringify({ error: `Cloudflare API error: ${cfResponse.status}`, details: errorText }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const cfData = await cfResponse.json();
    const groups = cfData?.data?.viewer?.zones?.[0]?.httpRequests1dGroups || [];

    let uniqueVisitors = 0;
    let pageViews = 0;
    for (const group of groups) {
      uniqueVisitors += group.uniq?.uniques || 0;
      pageViews += group.sum?.pageViews || 0;
    }

    return new Response(
      JSON.stringify({ date: dateStr, uniqueVisitors, pageViews }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
