
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
  const { toast } = useToast();

  const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
    setIsSending(true);

    try {
      console.log("Sending email to:", to);
      
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html }
      });

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      console.log("Email sent response:", data);
      
      toast({
        title: "Email sent successfully",
        description: "Your email has been sent.",
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
    isSending
  };
}
