
import { apiRequest } from "./apiRequest";

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
