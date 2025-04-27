
import { supabase } from "@/integrations/supabase/client";

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
