
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
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { to, subject, html }
      });

      if (error) throw error;

      toast({
        title: "Email sent successfully",
        description: "Your email has been sent.",
      });

      return { success: true, data };
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: error instanceof Error ? error.message : "An error occurred",
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
