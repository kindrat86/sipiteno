import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Brunson "Soap Opera Sequence" — Secret 7 (DotCom Secrets).
 *
 * A 5-email follow-up sequence that arrives over 5 days after a lead
 * downloads the Expansion Playbook. Each email uses the "open loop"
 * technique: plant a curiosity hook at the end that makes the next
 * email impossible to ignore.
 *
 * Email 1 (Day 0): Welcome + deliver playbook + set expectations (the "Backstory")
 * Email 2 (Day 1): The Wall — the brutal lesson (the "Dream" that died)
 * Email 3 (Day 2): The Epiphany — the 3-door discovery in Tbilisi/Kyiv/Almaty
 * Email 4 (Day 3): The Plan — how the system works + case study
 * Email 5 (Day 4): The Offer — book the free strategy call (urgency: limited slots)
 *
 * INVOCATION: Called by pg_cron every hour. Queries for subscribers
 * whose next_email_due_at <= now() and sends the next email in sequence.
 */

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const FROM = "Sipiteno <signal@sipiteno.com>";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const SOAP_SEQUENCE = [
  {
    day: 0,
    subject: "Your Expansion Playbook + the 3 things I wish I'd known in 2009",
    body: (name: string) => `Hi ${name},

Your 47-page Emerging Markets Expansion Playbook is attached. But before you open it, I want to tell you something.

In 2009, I moved a SaaS product into Eastern Europe believing one thing: "if the product is great, the market will come."

Six months later: zero signed deals. Runway bleeding. I was about to shut it down.

Then I took one last trip — to Tbilisi, Kyiv, and Almaty. And in those three cities, I discovered the three things every winning company had... and I didn't.

I'll tell you exactly what those three things are tomorrow. It's the single most expensive lesson I've ever learned — and it's free for you.

Read the playbook today. Tomorrow, the story.

— Sipi
Sipiteno

P.S. If you're in a hurry and want to skip ahead, book a free 30-min strategy call here: https://sipiteno.com/#free-call`,
  },
  {
    day: 1,
    subject: "The day I almost quit (a story about $200K burned)",
    body: (name: string) => `Hi ${name},

Yesterday I told you I'd reveal the 3 things I discovered in Tbilisi, Kyiv, and Almaty.

But first, I need to tell you what happened before that trip. Because if you're trying to enter emerging markets right now, you might be making the same mistake I made.

I had the engineering. I had the roadmap. I had the pitch deck. I burned $200K believing my product would sell itself.

It didn't. Local competitors with INFERIOR products were winning every deal. And I couldn't figure out why.

I was about to shut everything down. Then I booked three flights.

Tomorrow: what I found in those three cities — the pattern that changed everything. It's not what you think.

— Sipi

P.S. The playbook you downloaded yesterday covers the tactical side. Tomorrow's email is the story behind it.`,
  },
  {
    day: 2,
    subject: "Three cities. Same pattern. The 3-door system.",
    body: (name: string) => `Hi ${name},

Tbilisi. Kyiv. Almaty. Three cities, three markets, same pattern.

In every single one, the winning companies had the same three things — the same three things I completely lacked. I call them "the 3 doors":

DOOR 1: The Introductions.
Not cold outreach. Warm handoffs from people already trusted inside the market. The kind of relationships that take 5-10 years to build.

DOOR 2: The Regulatory Map.
Before spending a dollar, knowing exactly which licenses, data rules, and compliance traps apply. Which ones kill deals before they start.

DOOR 3: The Execution Team.
A bilingual, local team that ships. Product, BD, marketing — all operating in the language and culture of the target market. Fast.

That's the system. Three doors. I've now used it to open 28 markets and launch 50+ products.

Tomorrow: how it works in practice — with a real case study (3 pilots in 90 days).

— Sipi

P.S. If you already know which market you want to enter, book a call and I'll tell you which doors are already open for you: https://sipiteno.com/#free-call`,
  },
  {
    day: 3,
    subject: "3 pilots in 90 days: how a cybersecurity SaaS cracked Georgia + Kazakhstan",
    body: (name: string) => `Hi ${name},

Yesterday I showed you the 3-door system. Today: proof it works.

A B2B cybersecurity SaaS came to us after knocking on doors in Georgia and Kazakhstan for TWO YEARS with zero results.

Here's what happened in the first 90 days:

• We opened 5 warm introductions to enterprise buyers (Door 1)
• We mapped the regulatory path — data residency rules that would've killed 2 deals if handled wrong (Door 2)
• We deployed a bilingual BD team that closed in Georgian and Russian (Door 3)

Result: 3 enterprise pilots signed in Q1. A pipeline that took them 2 years to fail at building — opened in 90 days.

This is what the 3-door system does. It doesn't just "help you expand." It compresses 5 years of relationship-building into weeks.

Tomorrow: the offer. And why I can only take 5 new strategy calls this month.

— Sipi`,
  },
  {
    day: 4,
    subject: "5 strategy call slots left this month (book yours)",
    body: (name: string) => `Hi ${name},

Over the past 4 days, I've shared the system behind 50+ market entries across 28 countries.

The 3-door system. The playbook. The case study.

Here's what happens on a strategy call:

• We map your expansion goals for 30 minutes
• I qualify 2-3 target markets live (using the same scorecards in your playbook)
• You get a custom market readiness assessment for your top 2 markets
• You walk away with a written 90-day action plan — yours to keep, even if we never work together

Total value: $1,497. Your cost: $0.

But I only take 5 new calls per month — because each one is with me personally, not a junior SDR. This month, 3 are already booked.

If you're serious about expanding into emerging markets in the next 12 months, book now: https://sipiteno.com/#free-call

If not, no problem. Keep the playbook. Use it. And when you're ready, the door is open.

— Sipi
Sipiteno

P.S. The playbook + scorecard + action plan are yours regardless. The call is just faster: https://sipiteno.com/#free-call`,
  },
];

serve(async (req) => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Find subscribers due for their next email
  const { data: due, error: fetchError } = await supabase
    .from("soap_opera_subscribers")
    .select("id, email, name, current_step, subscribed_at")
    .lte("next_email_due_at", new Date().toISOString())
    .lt("current_step", SOAP_SEQUENCE.length);

  if (fetchError) {
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
    });
  }

  let sent = 0;
  for (const sub of due || []) {
    const email = SOAP_SEQUENCE[sub.current_step];
    try {
      await resend.emails.send({
        from: FROM,
        to: sub.email,
        subject: email.subject,
        text: email.body(sub.name || "there"),
        tags: [{ name: "sequence", value: "soap-opera" }],
      });

      // Advance to next step, set next due time
      const nextStep = sub.current_step + 1;
      const nextDue = nextStep < SOAP_SEQUENCE.length
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // +1 day
        : null; // Sequence complete

      await supabase
        .from("soap_opera_subscribers")
        .update({
          current_step: nextStep,
          next_email_due_at: nextDue,
          last_email_sent_at: new Date().toISOString(),
        })
        .eq("id", sub.id);

      sent++;
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err);
    }
  }

  return new Response(
    JSON.stringify({ sent, checked: (due || []).length }),
    { headers: { "Content-Type": "application/json" } }
  );
});
