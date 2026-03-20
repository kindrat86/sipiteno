import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

serve(async () => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check for a published post from today
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug")
      .eq("status", "published")
      .gte("published_at", todayStart.toISOString())
      .limit(1);

    if (error) {
      console.error("Database query failed:", error);
      throw new Error(`DB error: ${error.message}`);
    }

    if (posts && posts.length > 0) {
      console.log(`Blog post found: ${posts[0].title}`);
      return new Response(
        JSON.stringify({ status: "ok", post: posts[0].title }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // No post found — send alert
    console.warn("No blog post published today, sending alert");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const today = todayStart.toISOString().slice(0, 10);
    const resend = new Resend(resendApiKey);
    await resend.emails.send({
      from: "Sipiteno Blog Monitor <blog-monitor@updates.sipiteno.com>",
      to: ["sales@sipiteno.com"],
      subject: `Blog Alert: No post published on ${today}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #e53e3e;">Daily Blog Post Missing</h2>
          <p>No blog post was published on <strong>${today}</strong>.</p>
          <p>The daily cron job at 08:00 UTC may have failed.</p>
          <p>
            <a href="https://sipiteno.com/admin/blog-generator"
               style="display: inline-block; padding: 10px 20px; background: #3182ce; color: white; text-decoration: none; border-radius: 6px;">
              Generate Manually
            </a>
          </p>
          <p style="color: #718096; font-size: 13px;">
            Check Edge Function logs in the
            <a href="https://supabase.com/dashboard/project/ukqtmxbqsvhyafzxbxdg/functions">Supabase Dashboard</a>
            for details.
          </p>
        </div>
      `,
    });

    console.log("Alert email sent");
    return new Response(
      JSON.stringify({ status: "alert_sent", date: today }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("Monitor error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
