
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

      // Check for AWS SES specific errors
      if (data?.error) {
        console.error("AWS SES error:", data.error);
        
        if (data.error.name === "CredentialsError") {
          throw new Error("AWS credentials are invalid or missing. Please check your AWS access keys in Supabase Edge Function Secrets.");
        } else if (data.error.name === "MessageRejected") {
          throw new Error("Email rejected: " + data.error);
        } else {
          throw new Error(data.error);
        }
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
