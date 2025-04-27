
import { toast } from "@/hooks/use-toast";
import { SendEmailRequest, SendEmailResponse } from "@/types/api";
import { supabase } from "@/integrations/supabase/client";

// Send email using our Supabase edge function
export const sendEmail = async (options: SendEmailRequest): Promise<SendEmailResponse> => {
  try {
    // We use the Supabase edge function instead of direct API call
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: options
    });
    
    if (error) {
      console.error('Email sending error (Supabase function):', error);
      return { 
        success: false, 
        message: error.message || 'Unknown error occurred while sending email' 
      };
    }
    
    // Handle AWS SES specific errors
    if (data?.error) {
      return {
        success: false,
        message: data.error.message || 'AWS SES error occurred'
      };
    }
    
    return { 
      success: true, 
      message: 'Email sent successfully',
      messageId: data?.MessageId
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred while sending email' 
    };
  }
};

// Helper function to display toast notifications for email operations
export const sendEmailWithNotification = async (options: SendEmailRequest): Promise<boolean> => {
  const { success, message } = await sendEmail(options);
  
  if (success) {
    toast({
      title: "Email Sent",
      description: "Your email has been sent successfully.",
    });
  } else {
    toast({
      title: "Email Failed",
      description: message,
      variant: "destructive",
    });
  }
  
  return success;
};
