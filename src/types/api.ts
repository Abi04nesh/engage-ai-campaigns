
export interface SendEmailRequest {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: string;
}
