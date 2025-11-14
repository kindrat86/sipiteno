import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Zod schema for validation
const contactSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  companyName: z.string().trim().max(100, "Company name too long").optional(),
  email: z.string().trim().email("Invalid email").max(255, "Email too long"),
  phone: z.string().trim().max(50, "Phone too long").optional(),
  country: z.string().trim().max(100, "Country too long").optional(),
  service: z.string().trim().max(100, "Service too long").optional(),
  message: z.string().trim().min(10, "Message too short").max(2000, "Message too long"),
  honeypot: z.string().optional(), // Honeypot field to catch bots
});

interface ContactFormData {
  fullName: string;
  companyName?: string;
  email: string;
  phone?: string;
  country?: string;
  service?: string;
  message: string;
  honeypot?: string;
}

// HTML escape function to prevent XSS
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_HOUR = 3;

// Get client IP address
const getClientIp = (req: Request): string => {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
         req.headers.get("x-real-ip") || 
         "unknown";
};

// Check rate limit
const checkRateLimit = async (supabaseAdmin: any, ipAddress: string): Promise<{ allowed: boolean; message?: string }> => {
  const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW).toISOString();
  
  // Get rate limit record for this IP
  const { data: rateLimitData, error: fetchError } = await supabaseAdmin
    .from("contact_rate_limit")
    .select("*")
    .eq("ip_address", ipAddress)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") { // PGRST116 is "not found"
    console.error("Error fetching rate limit:", fetchError);
    return { allowed: true }; // Allow on error to not block legitimate users
  }

  if (!rateLimitData) {
    // First submission from this IP
    await supabaseAdmin
      .from("contact_rate_limit")
      .insert({
        ip_address: ipAddress,
        submission_count: 1,
        first_submission_at: new Date().toISOString(),
        last_submission_at: new Date().toISOString(),
      });
    return { allowed: true };
  }

  // Check if the window has expired
  const lastSubmission = new Date(rateLimitData.last_submission_at);
  const firstSubmission = new Date(rateLimitData.first_submission_at);
  const now = new Date();

  // Reset counter if more than 1 hour has passed since first submission
  if (now.getTime() - firstSubmission.getTime() > RATE_LIMIT_WINDOW) {
    await supabaseAdmin
      .from("contact_rate_limit")
      .update({
        submission_count: 1,
        first_submission_at: now.toISOString(),
        last_submission_at: now.toISOString(),
      })
      .eq("ip_address", ipAddress);
    return { allowed: true };
  }

  // Check if rate limit exceeded
  if (rateLimitData.submission_count >= MAX_SUBMISSIONS_PER_HOUR) {
    const timeUntilReset = Math.ceil((firstSubmission.getTime() + RATE_LIMIT_WINDOW - now.getTime()) / 60000);
    return { 
      allowed: false, 
      message: `Rate limit exceeded. Please try again in ${timeUntilReset} minutes.` 
    };
  }

  // Increment counter
  await supabaseAdmin
    .from("contact_rate_limit")
    .update({
      submission_count: rateLimitData.submission_count + 1,
      last_submission_at: now.toISOString(),
    })
    .eq("ip_address", ipAddress);

  return { allowed: true };
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client for rate limiting
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get client IP for rate limiting
    const clientIp = getClientIp(req);
    
    // Check rate limit
    const rateLimitResult = await checkRateLimit(supabaseAdmin, clientIp);
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ success: false, error: rateLimitResult.message }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse and validate request body
    const rawData = await req.json();
    
    // Check honeypot field - if filled, it's likely a bot
    if (rawData.honeypot && rawData.honeypot.trim() !== "") {
      console.log("Honeypot triggered, likely bot submission");
      // Return success to not alert the bot
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }
    
    // Validate with Zod
    const validatedData = contactSchema.parse(rawData);
    
    console.log("Received valid contact form submission from IP:", clientIp);

    // Escape all user inputs to prevent XSS
    const safeName = escapeHtml(validatedData.fullName);
    const safeCompany = validatedData.companyName ? escapeHtml(validatedData.companyName) : "Not provided";
    const safeEmail = escapeHtml(validatedData.email);
    const safePhone = validatedData.phone ? escapeHtml(validatedData.phone) : "Not provided";
    const safeCountry = validatedData.country ? escapeHtml(validatedData.country) : "Not provided";
    const safeService = validatedData.service ? escapeHtml(validatedData.service) : "Not provided";
    const safeMessage = escapeHtml(validatedData.message).replace(/\n/g, '<br>');

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Full Name:</strong> ${safeName}</p>
      <p><strong>Company Name:</strong> ${safeCompany}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Phone:</strong> ${safePhone}</p>
      <p><strong>Country/Market:</strong> ${safeCountry}</p>
      <p><strong>Service of Interest:</strong> ${safeService}</p>
      <p><strong>Message:</strong></p>
      <p>${safeMessage}</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Sipiteno Contact Form <sales@sipiteno.com>",
      to: ["sales@sipiteno.com"],
      subject: `New Contact Form Submission from ${safeName}`,
      html: emailHtml,
      reply_to: validatedData.email,
    });

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    
    // Handle validation errors specifically
    if (error.name === "ZodError") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid input data",
          details: error.errors 
        }),
        {
          status: 400,
          headers: { 
            "Content-Type": "application/json", 
            ...corsHeaders 
          },
        }
      );
    }
    
    return new Response(
      JSON.stringify({ success: false, error: "Failed to send message" }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
