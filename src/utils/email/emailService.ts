
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  try {
    console.log("Sending email to:", to);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html }
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

export const sendEmailWithNotification = async (params: SendEmailParams) => {
  const { toast } = useToast();
  
  try {
    const result = await sendEmail(params);
    
    toast({
      title: "Email sent successfully",
      description: "Your email has been sent.",
    });
    
    return result;
  } catch (error) {
    toast({
      title: "Failed to send email",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    
    throw error;
  }
};
