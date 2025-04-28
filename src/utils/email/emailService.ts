
import { supabase } from "@/integrations/supabase/client";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

/**
 * Sends an email using AWS SES through backend API
 * Uses the AWS credentials stored in Supabase Edge Function Secrets
 */
export const sendEmail = async ({ to, subject, html, from }: SendEmailParams) => {
  try {
    console.log("Sending email to:", to);
    
    // Call our API endpoint that uses AWS SES
    const { data, error } = await supabase.functions.invoke('aws-ses-email', {
      body: { 
        to, 
        subject, 
        html,
        from: from || process.env.DEFAULT_FROM_EMAIL || 'noreply@yourdomain.com'
      }
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

// This function is kept for backward compatibility
export const sendEmailWithNotification = async (params: SendEmailParams) => {
  try {
    const result = await sendEmail(params);
    return result;
  } catch (error) {
    throw error;
  }
};
