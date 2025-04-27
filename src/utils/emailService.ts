import { toast } from "@/hooks/use-toast";
import { SendEmailRequest, SendEmailResponse } from "@/types/api";
import { supabase } from "@/integrations/supabase/client";

// Base API URL - should be configurable via environment variable in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

// Generic API request function with error handling
async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if user is logged in
        ...(localStorage.getItem('authToken') && {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        })
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    return responseData as T;
  } catch (error) {
    console.error(`API request error (${method} ${endpoint}):`, error);
    throw error;
  }
}

// Send email using our API
export const sendEmail = async (options: SendEmailRequest): Promise<SendEmailResponse> => {
  try {
    // We now use the Supabase edge function instead of direct API call
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

// Auth service for Supabase authentication
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata.name || '',
          createdAt: new Date(data.user.created_at || '').toISOString()
        };
        
        return {
          success: true,
          message: 'Login successful',
          user,
          token: data.session?.access_token
        };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    }
  },
  
  signup: async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email || '',
          name: name,
          createdAt: new Date(data.user.created_at || '').toISOString()
        };
        
        return {
          success: true,
          message: 'Account created successfully',
          user,
          token: data.session?.access_token
        };
      }
      
      return { success: false, message: 'Signup failed' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Signup failed' };
    }
  },
  
  logout: async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// API services for campaigns
export const campaignService = {
  list: () => apiRequest('/campaigns'),
  
  getById: (id: string) => apiRequest(`/campaigns/${id}`),
  
  create: (campaign: {
    name: string;
    subject: string;
    content: string;
    sendAt?: string;
    templateId?: string;
  }) => apiRequest('/campaigns', 'POST', campaign),
  
  update: (id: string, campaign: {
    name?: string;
    subject?: string;
    content?: string;
    sendAt?: string;
    templateId?: string;
    status?: string;
  }) => apiRequest(`/campaigns/${id}`, 'PUT', campaign),
  
  delete: (id: string) => apiRequest(`/campaigns/${id}`, 'DELETE'),
  
  send: (id: string) => apiRequest(`/campaigns/${id}/send`, 'POST')
};

// API services for subscribers
export const subscriberService = {
  list: () => apiRequest('/subscribers'),
  
  getById: (id: string) => apiRequest(`/subscribers/${id}`),
  
  create: (subscriber: {
    email: string;
    name?: string;
    status?: string;
    metadata?: Record<string, any>;
  }) => apiRequest('/subscribers', 'POST', subscriber),
  
  update: (id: string, subscriber: {
    email?: string;
    name?: string;
    status?: string;
    metadata?: Record<string, any>;
  }) => apiRequest(`/subscribers/${id}`, 'PUT', subscriber),
  
  delete: (id: string) => apiRequest(`/subscribers/${id}`, 'DELETE'),
  
  import: (fileData: string) => apiRequest('/subscribers/import', 'POST', { data: fileData })
};

// API services for templates
export const templateService = {
  list: () => apiRequest('/templates'),
  
  getById: (id: string) => apiRequest(`/templates/${id}`),
  
  create: (template: {
    name: string;
    content: string;
  }) => apiRequest('/templates', 'POST', template),
  
  update: (id: string, template: {
    name?: string;
    content?: string;
  }) => apiRequest(`/templates/${id}`, 'PUT', template),
  
  delete: (id: string) => apiRequest(`/templates/${id}`, 'DELETE')
};

// API services for analytics
export const analyticsService = {
  getStats: () => apiRequest('/analytics/stats'),
  
  getEvents: (filters?: {
    startDate?: string;
    endDate?: string;
    campaignId?: string;
    eventType?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const queryString = queryParams.toString();
    return apiRequest(`/analytics/events${queryString ? `?${queryString}` : ''}`);
  }
};

// API services for activity logs
export const activityService = {
  getRecent: (limit = 10) => apiRequest(`/activity?limit=${limit}`)
};
