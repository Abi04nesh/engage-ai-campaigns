
import { toast } from "@/hooks/use-toast";

// This service abstracts the email sending functionality
// AWS credentials should be stored securely in environment variables on your server
// The frontend should only make requests to your backend API

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (options: EmailOptions): Promise<{ success: boolean; message: string }> => {
  try {
    // In a production environment, this request should go to your secure backend
    // NEVER include AWS credentials in frontend code
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred while sending email' 
    };
  }
};

// Helper function to display toast notifications for email operations
export const sendEmailWithNotification = async (options: EmailOptions): Promise<boolean> => {
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
