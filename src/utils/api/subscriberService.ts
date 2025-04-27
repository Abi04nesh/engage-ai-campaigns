
import { apiRequest } from "./apiRequest";

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
