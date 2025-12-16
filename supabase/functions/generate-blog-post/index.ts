import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'https://sipiteno.com',
  'https://www.sipiteno.com',
  'https://sipiteno.lovable.app',
  ...(Deno.env.get('ENVIRONMENT') === 'development' ? ['http://localhost:8080', 'http://localhost:5173'] : [])
];

const getCorsHeaders = (origin: string | null) => {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };
};

// The master system prompt for Sipiteno content agent
const SYSTEM_PROMPT = `You are an autonomous content agent for Sipiteno, a MicroSaaS MVP development agency.

# Context
Sipiteno builds MicroSaaS MVPs in 4–8 weeks for:
- Non-technical founders (bootstrappers)
- Serial entrepreneurs validating ideas fast
- CTOs building internal tools without draining core teams

Sipiteno's real products include:
- VoiceLogPro (construction voice-to-PDF reporting)
- FunnelFixer (AI-powered sales funnel audits)
- AgriTech Monitor
- LogiChain Pro

Your writing must prove execution credibility, speed, and ROI.

# Task
Write ONE long-form blog post (900–1,100 words) focused strictly on MicroSaaS MVPs, rapid validation, niche SaaS, or AI-powered internal tools.

Each post must:
- Be opinionated
- Be tactical
- Be grounded in real builds (VoiceLogPro, FunnelFixer, or similar internal tools)
- Sell Sipiteno's "Rapid MVP (4–8 weeks)" offering without sounding salesy

# Writing Persona
- Role: Senior Product Manager at Sipiteno
- Mentality: Builder, not marketer
- Audience: Founders who value speed, clarity, and ROI

# Tone & Style Rules (Strict)
- Practical
- Direct
- Confident
- No hype
- No buzzwords (forbidden: synergy, disrupt, revolutionary, leverage)
- Use verbs like: ship, deploy, validate, cut scope, test, launch

# Required Structure (in this order)
1. Hook  
   Start with a concrete pain point experienced by a real operator.
2. Problem Breakdown  
   Why this problem wastes time or money.
3. The Build  
   How the MicroSaaS was designed (focus on scope discipline).
4. The Tech (Brief)  
   Mention AI or stack only if it affects speed or cost.
5. Launch & Validation  
   How it was tested fast (days, not months).
6. Result  
   Quantified outcome (time saved, cost reduced, speed gained).
7. Takeaway  
   What founders should copy from this approach.
8. Call to Action  
   Close with:
   "Have an idea for your industry? Let's build your MVP in 4 weeks."

# Blog Format & Best Practices (Strict)

Every blog post MUST follow modern content best practices:

## Headings & Structure
- Use exactly ONE H1 (the title)
- Use multiple H2 sections matching the required structure
- Use H3 only when breaking down steps or examples
- Headings must be descriptive and specific (no vague titles like "Conclusion")

## Readability
- Paragraphs: max 3–4 lines
- Use short, direct sentences
- Prefer bullets and numbered lists when explaining processes
- Avoid walls of text

## SEO Hygiene (Without Keyword Stuffing)
- Naturally include:
  - "MicroSaaS"
  - "MVP"
  - "rapid MVP"
  - "vertical SaaS"
- Use semantic variations, not repetition
- Do NOT mention "SEO" or "keywords" explicitly in the post

## Credibility Signals
- Reference real constraints (time, cost, tradeoffs)
- Include specific numbers (weeks, minutes, dollars, hours saved)
- Use concrete examples from VoiceLogPro, FunnelFixer, or internal tools
- Avoid generic claims like "increased productivity" without numbers

## Formatting Rules
- Use Markdown
- Use bold sparingly for emphasis (never entire paragraphs)
- Do NOT use emojis
- Do NOT use excessive italics
- Code blocks only when showing something technical (rare)

## CTA Placement
- Call to Action must appear:
  - Once at the very end
  - As a standalone paragraph
- CTA text must be exactly:
  "Have an idea for your industry? Let's build your MVP in 4 weeks."

# Constraints
- Do NOT write generic SaaS advice
- Do NOT explain basic concepts
- Do NOT sound like AI
- Do NOT exceed 1,100 words
- Always assume the reader is smart and busy

Output only the final blog post in Markdown.`;

// Topic schedule for 15 days (3-week rotation)
const TOPIC_SCHEDULE = [
  // Week 1 – Speed to Market
  { day: 1, week: 1, topic: "From Napkin Sketch to First Paying Customer in 4 Weeks: The MicroSaaS Blueprint" },
  { day: 2, week: 1, topic: "Why 60 Days Is the Absolute Limit for Your MVP Build" },
  { day: 3, week: 1, topic: "Stop Hiring Full-Time Devs for Your MVP: The Case for Agency Execution" },
  { day: 4, week: 1, topic: "What We Cut Ruthlessly to Ship VoiceLogPro in Under 8 Weeks" },
  { day: 5, week: 1, topic: "The Hidden Cost of \"One More Feature\" in MVPs" },
  // Week 2 – Vertical & Niche SaaS
  { day: 6, week: 2, topic: "Case Study: How VoiceLogPro Saves Construction Crews 5 Hours a Week" },
  { day: 7, week: 2, topic: "Why Blue-Collar SaaS Wins Faster Than B2B Dashboards" },
  { day: 8, week: 2, topic: "Automating Consulting: How FunnelFixer Turned Expertise Into Software" },
  { day: 9, week: 2, topic: "Why Logistics, Construction, and Agriculture Are MicroSaaS Goldmines" },
  { day: 10, week: 2, topic: "Internal Tools Beat Startups: The Overlooked MicroSaaS Opportunity" },
  // Week 3 – AI Wrappers & Technical Strategy
  { day: 11, week: 3, topic: "Building an AI Wrapper That Doesn't Die When ChatGPT Updates" },
  { day: 12, week: 3, topic: "Why Workflow > AI Model in MicroSaaS Products" },
  { day: 13, week: 3, topic: "How We Scope AI Features to Ship in Weeks, Not Quarters" },
  { day: 14, week: 3, topic: "The React + Supabase Stack: Built for MVPs, Not Science Projects" },
  { day: 15, week: 3, topic: "When NOT to Use AI in Your MVP" },
];

// Post-processing prompt for meta assets
const META_PROMPT = `Based on the blog post above, generate:
1. A 155-character meta description (SEO-optimized)
2. A LinkedIn post summary (≤ 280 characters, engaging, with a hook)
3. Three internal link suggestions from these options: VoiceLogPro (/mvp-showcase#voicelogpro), FunnelFixer (/mvp-showcase#funnelfixer), MVP Services (/services/microsaas-mvp), AI Consulting (/services/ai-consulting)

Return as JSON:
{
  "meta_description": "...",
  "linkedin_summary": "...",
  "internal_links": [{"text": "anchor text", "url": "/path"}]
}`;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topicDay, customTopic, generateMeta = true } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Determine topic
    let topic: string;
    let dayNumber: number | null = null;
    let weekNumber: number | null = null;

    if (customTopic) {
      topic = customTopic;
    } else if (topicDay && topicDay >= 1 && topicDay <= 15) {
      const scheduled = TOPIC_SCHEDULE[topicDay - 1];
      topic = scheduled.topic;
      dayNumber = scheduled.day;
      weekNumber = scheduled.week;
    } else {
      // Default to day 6 (VoiceLogPro case study) for demo
      const scheduled = TOPIC_SCHEDULE[5];
      topic = scheduled.topic;
      dayNumber = scheduled.day;
      weekNumber = scheduled.week;
    }

    console.log(`Generating blog post for topic: ${topic}`);

    // Generate blog post
    const blogResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Topic: ${topic}\n\nWrite today's blog post following the system rules exactly.` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!blogResponse.ok) {
      if (blogResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (blogResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await blogResponse.text();
      console.error("AI gateway error:", blogResponse.status, errorText);
      throw new Error(`AI gateway error: ${blogResponse.status}`);
    }

    const blogData = await blogResponse.json();
    const blogContent = blogData.choices?.[0]?.message?.content;

    if (!blogContent) {
      throw new Error("No content generated");
    }

    console.log("Blog post generated successfully");

    // Extract title from the first H1 in markdown
    const titleMatch = blogContent.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : topic;
    const slug = slugify(title);
    const wordCount = countWords(blogContent);

    let metaData = {
      meta_description: "",
      linkedin_summary: "",
      internal_links: []
    };

    // Generate meta assets if requested
    if (generateMeta) {
      console.log("Generating meta assets...");
      
      const metaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            { role: "user", content: `${blogContent}\n\n---\n\n${META_PROMPT}` }
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (metaResponse.ok) {
        const metaResult = await metaResponse.json();
        const metaContent = metaResult.choices?.[0]?.message?.content;
        
        if (metaContent) {
          try {
            // Extract JSON from response
            const jsonMatch = metaContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              metaData = JSON.parse(jsonMatch[0]);
            }
          } catch (e) {
            console.error("Failed to parse meta JSON:", e);
          }
        }
      }
    }

    // Save to database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: savedPost, error: dbError } = await supabaseAdmin
      .from("blog_posts")
      .insert({
        title,
        slug,
        content: blogContent,
        meta_description: metaData.meta_description,
        linkedin_summary: metaData.linkedin_summary,
        internal_links: metaData.internal_links,
        topic_day: dayNumber,
        week_number: weekNumber,
        word_count: wordCount,
        status: "draft"
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      // Return content even if save fails
      return new Response(
        JSON.stringify({
          success: true,
          saved: false,
          post: {
            title,
            slug,
            content: blogContent,
            ...metaData,
            word_count: wordCount
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Blog post saved to database");

    return new Response(
      JSON.stringify({
        success: true,
        saved: true,
        post: savedPost
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating blog post:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
