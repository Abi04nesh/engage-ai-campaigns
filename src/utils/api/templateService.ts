
import { apiRequest } from "./apiRequest";

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
