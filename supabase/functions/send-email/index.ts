
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0";

// Make sure to use the API key from environment variable
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "re_JYqGssn9_MAEN7kuT66CAvAjeWKBDV54z";

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set in environment variables");
}

console.log("Initializing Resend with API key status:", RESEND_API_KEY ? "Present" : "Missing");
const resend = new Resend(RESEND_API_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html } = await req.json();

    if (!to || !subject || !html) {
      throw new Error("Missing required fields: to, subject, or html");
    }

    // Log the email request
    console.log("Sending email to:", to);
    console.log("Subject:", subject);
    console.log("API Key status:", RESEND_API_KEY ? "Present (length: " + RESEND_API_KEY.length + ")" : "Missing");
    
    const emailResponse = await resend.emails.send({
      from: "EngageAI <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
