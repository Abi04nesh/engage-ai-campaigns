
import { apiRequest } from "./apiRequest";

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
