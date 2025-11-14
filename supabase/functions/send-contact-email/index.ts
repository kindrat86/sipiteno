import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    console.log("Received contact form submission:", { 
      name: formData.fullName, 
      email: formData.email 
    });

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Full Name:</strong> ${formData.fullName}</p>
      <p><strong>Company Name:</strong> ${formData.companyName || "Not provided"}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
      <p><strong>Country/Market:</strong> ${formData.country || "Not provided"}</p>
      <p><strong>Service of Interest:</strong> ${formData.service || "Not provided"}</p>
      <p><strong>Message:</strong></p>
      <p>${formData.message.replace(/\n/g, '<br>')}</p>
    `;

    const emailResponse = await resend.emails.send({
      from: "Sipiteno Contact Form <onboarding@resend.dev>",
      to: ["sales@sipiteno.com"],
      subject: `New Contact Form Submission from ${formData.fullName}`,
      html: emailHtml,
      reply_to: formData.email,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
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
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
