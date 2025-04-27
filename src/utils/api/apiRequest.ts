
// Generic API request function with error handling
export async function apiRequest<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', 
  data?: any
): Promise<T> {
  // Base API URL - should be configurable via environment variable in production
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3001/api';
    
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
