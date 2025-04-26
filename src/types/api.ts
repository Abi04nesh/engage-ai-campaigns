
// Common types
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

// Auth types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  token?: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  sendAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  templateId?: string;
  recipientCount?: number;
}

export interface CampaignRequest {
  name: string;
  subject: string;
  content: string;
  sendAt?: string;
  templateId?: string;
}

export interface CampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
}

export interface CampaignsListResponse {
  success: boolean;
  campaigns: Campaign[];
}

// Subscriber types
export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  metadata?: Record<string, any>;
}

export interface SubscriberRequest {
  email: string;
  name?: string;
  status?: 'active' | 'unsubscribed' | 'bounced';
  source?: string;
  metadata?: Record<string, any>;
}

export interface SubscriberResponse {
  success: boolean;
  message: string;
  subscriber?: Subscriber;
}

export interface SubscribersListResponse {
  success: boolean;
  subscribers: Subscriber[];
}

// Template types
export interface Template {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TemplateRequest {
  name: string;
  content: string;
}

export interface TemplateResponse {
  success: boolean;
  message: string;
  template?: Template;
}

export interface TemplatesListResponse {
  success: boolean;
  templates: Template[];
}

// Analytics types
export interface EmailEvent {
  id: string;
  messageId: string;
  event: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained';
  timestamp: string;
  recipient: string;
  campaignId?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsResponse {
  success: boolean;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    complained: number;
  };
  events?: EmailEvent[];
}

// Activity types
export interface ActivityLog {
  id: string;
  action: string;
  entityType: 'campaign' | 'subscriber' | 'template' | 'auth';
  entityId?: string;
  details?: Record<string, any>;
  timestamp: string;
  userId: string;
}

export interface ActivityResponse {
  success: boolean;
  activities: ActivityLog[];
}
