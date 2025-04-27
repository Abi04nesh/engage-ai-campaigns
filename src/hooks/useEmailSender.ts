
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export function useEmailSender() {
  const [isSending, setIsSending] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const { toast } = useToast();

  const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
    setIsSending(true);

    try {
      console.log("Sending email to:", to);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html }
      });

      setLastResponse({ data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      // Check for API key validation error in the response data
      if (data?.error?.name === "validation_error" && data?.error?.message?.includes("API key is invalid")) {
        const apiKeyError = new Error("The Resend API key is invalid. Please check your API key in Supabase Edge Function Secrets.");
        console.error("Resend API key validation error:", data.error);
        throw apiKeyError;
      }

      console.log("Email sent response:", data);
      
      toast({
        title: "Email request processed",
        description: "Your email request has been processed. Check the debug info for details.",
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error sending email:", error);
      
      // More detailed error message
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      
      // Special handling for API key validation errors
      if (errorMessage.includes("API key is invalid")) {
        errorMessage = "The Resend API key is invalid. Please make sure you have added the correct API key to Supabase Edge Function Secrets.";
      }
      
      toast({
        title: "Failed to send email",
        description: errorMessage,
        variant: "destructive",
      });

      return { success: false, error };
    } finally {
      setIsSending(false);
    }
  };

  return {
    sendEmail,
    isSending,
    lastResponse
  };
}
