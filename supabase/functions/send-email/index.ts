
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3, SES } from "https://deno.land/x/aws_sdk@v3.32.0-1/client-sdk/ses/mod.ts";

// Make sure to use the API keys from environment variables
const AWS_ACCESS_KEY_ID = Deno.env.get("AWS_ACCESS_KEY_ID");
const AWS_SECRET_ACCESS_KEY = Deno.env.get("AWS_SECRET_ACCESS_KEY");
const AWS_REGION = "us-east-1"; // Default region, you can make this configurable if needed

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("AWS credentials are not set in environment variables");
}

console.log("Initializing AWS SES with credentials status:", AWS_ACCESS_KEY_ID ? "Present" : "Missing");

// Initialize AWS SES client
const ses = new SES({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || ""
  }
});

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
    console.log("AWS credentials status:", AWS_ACCESS_KEY_ID ? "Present" : "Missing");
    
    // Ensure 'to' is always an array
    const recipients = Array.isArray(to) ? to : [to];
    
    // Set up SES parameters
    const params = {
      Source: "abi04nesh@gmail.com", // Make sure this email is verified in AWS SES
      Destination: {
        ToAddresses: recipients
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8"
          }
        }
      }
    };

    // Send the email using AWS SES
    const emailResponse = await ses.sendEmail(params);
    
    console.log("Email sent response:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    
    // Detailed error handling for AWS SES specific errors
    let errorMessage = error.message || "Unknown error";
    let errorDetails = "No additional details";
    let statusCode = 500;
    
    if (error.name === "InvalidParameterValue") {
      statusCode = 400;
    } else if (error.name === "MessageRejected") {
      statusCode = 400;
    } else if (error.name === "CredentialsError") {
      errorMessage = "AWS credentials error";
      errorDetails = "Invalid or missing AWS credentials";
      statusCode = 403;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        details: errorDetails,
        name: error.name || "Error"
      }),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
