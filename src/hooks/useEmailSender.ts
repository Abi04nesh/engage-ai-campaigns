
import { useState } from "react";
import { sendEmail, sendEmailWithNotification } from "@/utils/emailService";
import { SendEmailRequest, SendEmailResponse } from "@/types/api";
import { useToast } from "@/components/ui/use-toast";

export const useEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const sendEmailAsync = async (
    to: string | string[],
    subject: string,
    html: string,
    from?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const request: SendEmailRequest = { to, subject, html, from };
      const result = await sendEmail(request);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage
      } as SendEmailResponse;
    } finally {
      setIsLoading(false);
    }
  };
  
  const sendEmailWithNotificationAsync = async (
    to: string | string[],
    subject: string,
    html: string,
    from?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await sendEmailWithNotification({ to, subject, html, from });
      
      if (!success) {
        setError('Failed to send email');
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Email Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    sendEmail: sendEmailAsync,
    sendEmailWithNotification: sendEmailWithNotificationAsync,
    isLoading,
    error,
  };
};
