
import { useState } from "react";
import { sendEmail, sendEmailWithNotification } from "@/utils/emailService";

export const useEmailSender = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const sendEmailAsync = async (
    to: string | string[],
    subject: string,
    html: string,
    from?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sendEmail({ to, subject, html, from });
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result.success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
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
